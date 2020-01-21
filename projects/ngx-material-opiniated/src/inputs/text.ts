import {Component, EventEmitter, forwardRef, ViewChild, ElementRef, Output, HostListener, HostBinding, Input, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import {delay} from '@oguimbal/utilities';
import { ErrorStateMatcher } from '@angular/material/core';

const noop = () => {
};

export const TEXT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
// tslint:disable-next-line: no-use-before-declare
    useExisting: forwardRef(() => TextComponent),
    multi: true
};

export type Validator = (v: string) => (string | Promise<string>);

export class StateMatcher implements ErrorStateMatcher {
    constructor(private parent: TextComponent) {

    }
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!this.parent.error;
    //   const isSubmitted = form && form.submitted;
    //   return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }

/**
 *
 * Can apply '.fullWidth' class for a display:block full width element
 */
@Component({
    selector: 'txt',
    styleUrls: ['./text.scss'],
    templateUrl: './text.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TEXT_VALUE_ACCESSOR]
})
export class TextComponent implements ControlValueAccessor {
    private initialized: boolean;
    @HostBinding('class.hasInfo')
    @Input()
    info: string;
    @Input()
    name: string;
    @Input()
    icon: string;
    @Input()
    iconColor: string;
    @Input()
    errorBarWidth;
    @Input()
    readonly: boolean;
    @Input()
    disabled: boolean;
    @Input()
    checkOnInit: boolean;
    @Input()
    placeholder = '';
    isValidating: boolean;
    touched: boolean;
    error: string;
    @Input()
    loading: boolean; // <= not used anymore
    @Input()
    type: 'text' | 'number' = 'text';
    @Input()
    validator: Validator;
    @Output()
    return = new EventEmitter<any>();
    @Output()
    enter = new EventEmitter<any>();
    @Output()
    escape = new EventEmitter<any>();
    @Output()
    focused = new EventEmitter<any>();
    @Output()
    valueChange = new EventEmitter<string>();
    @Output()
    keyup = new EventEmitter<any>();
    @Output()
    blur = new EventEmitter<any>();
    @Input()
    action: (text: string) => Promise<void> | void;
    @Input()
    actionName: string;
    @Input()
    actionIcon = 'plus';
    @Input()
    multiline = false;

    matcher = new StateMatcher(this);
    // http: // almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
    private validatingValue;
    private innerValue: any = '';

    // Placeholders for the callbacks which are later providesd
    // by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    private isPromiseValidator;
    @ViewChild('nti', { static: false }) nativeElement;

    selectString(txt: string) {
        setTimeout(() => {
            const i = (this.innerValue || '').indexOf(txt);
            if (i < 0)
                return;
            (<HTMLInputElement> this.nativeElement.nativeElement).setSelectionRange(i, txt.length);
        }, 1);
    }

    constructor(public renderer: Renderer2
        , private cd: ChangeDetectorRef
        , native: ElementRef) {
        native.nativeElement['_focus'] = () => this._focus();
    }

    @HostListener('focus')
    _focus() {
        setTimeout(() =>
            this.nativeElement.nativeElement.focus()
            // this.renderer.invokeElementMethod(this.nativeElement, 'focus', [])
            );
    }

    get hasFocus() {
        return this.nativeElement.nativeElement === document.activeElement;
    }

    onKeyUp($event: KeyboardEvent) {
// tslint:disable-next-line: deprecation
        if ($event.keyCode === 13) { // enter
            this.return.emit({sender: this});
            this.enter.emit({sender: this});
        }

// tslint:disable-next-line: deprecation
        if ($event.keyCode === 27) { // escape
            this.escape.emit({sender: this});
        }
        this.keyup.emit($event);
        // this.keyup.next($event);
        $event.cancelBubble = true;
    }

    onKeyDown($event: KeyboardEvent) {
        $event.cancelBubble = true; // useful to prevent document: keyup catching CTRL+A (see file-explorer.ts)
    }

    private triggerChange(v: string) {
        this.onChangeCallback(v);
        this.valueChange.emit(v);
        return this.launchValidation();
    }

    async launchValidation() {
        const v = this.innerValue;
        if (!this.validator) {
            return;
        }
        this.touched = true;
        try {
            this.error = undefined;
            this.cd.detectChanges();
            // if (!v){
            //     return;
            // }
            if (this.isPromiseValidator) {
                // throttle if previously returned a promise
                this.isValidating = true;
                this.cd.detectChanges();
                await delay(200);
                this.cd.detectChanges();
                if (this.innerValue !== v) {
                    return;
                }
            }
            let result = this.validator(v);
            if (!result) {
                return;
            }
            if (typeof result['then'] === 'function' && typeof result['catch'] === 'function') {
                // handle a promise
                this.isPromiseValidator = true;
                this.isValidating = true;
                this.validatingValue = v;
                result = await <Promise<string>>result;
                if (this.validatingValue !== v) {
                    return;
                }
            }
            this.error = <string>result;
        } catch (e) {
            this.error = e;
        } finally {
            if (v === this.innerValue) {
                this.isValidating = false;
            }
            this.cd.detectChanges();
        }
    }

    // get accessor
    get value(): any {
        return this.innerValue;
    }

    // set accessor including call the onchange callback
    @Input()
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.triggerChange(v);
        }
    }

    // Set touched on blur
    onBlur() {
        this.blur.emit(null);
        this.onTouchedCallback();
    }

    // From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            if (value && this.checkOnInit && !this.initialized) {
                this.triggerChange(this.value);
                this.initialized = true;
            }
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    performAction = () => {
        return this.action(this.value);
    }

}
