import {Component, EventEmitter, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, Input, Output, HostListener, OnChanges} from '@angular/core';
import { INotificationService } from '../services';

/**
 *
 * Sizes:  btn.xs   btn.sm
 * Colors: btn.cancel  btn.danger  btn.success
 */
@Component({
    selector: 'btn,a.linkBtn',
    styleUrls: ['./btn.scss'],
    templateUrl: './btn.html',
})
export class BtnComponent implements OnDestroy, AfterViewInit, OnChanges {

    @Input()
    icon: string;
    @Input()
    color: 'primary' | 'accent' | 'warn' | undefined;
    @Input()
    loading = false;
    @Input()
    disabled = false;

    @Input()
    type: 'stroked' | 'raised' | 'icon' | 'flat' | 'basic' | 'fab' | 'minifab' | 'minifab-content' = 'raised';

    @Input()
    action: () => Promise<any>;

    @Output()
    clicked = new EventEmitter();
    noContent: boolean;
    btnClass: string;
    @ViewChild('btnContent') content;

    constructor(private cdRef: ChangeDetectorRef
        , private notif: INotificationService
        , private elt: ElementRef) {

    }

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent) {

        const prevent = () => {
            $event.stopPropagation();
            $event.preventDefault();
        };
        if (this.loading || this.disabled) {
            prevent();
            return;
        }
        if (this.action) {
            prevent();
            this.startAction();
            return;
        }

        const htm = <HTMLElement>this.elt.nativeElement;
        if (htm.tagName.toLowerCase() === 'a' && htm.getAttribute('href')) {
            return;
        }
        prevent();
        this.clicked.emit($event);
    }

    private async startAction() {
        this.loading = true;
        try {
            await this.action();
        } catch (ex) {
            this.notif.error(ex);
        } finally {
            this.loading = false;
            if (this.action) // might be destroyed
                this.cdRef.detectChanges();
        }
        return;
    }

    ngOnDestroy() {
        this.action = null;
    }

    ngAfterViewInit(): void {
        this.noContent = this.content
            && this.content.nativeElement
            && !this.content.nativeElement.children.length
            && !this.content.nativeElement.textContent;
        this.cdRef.detectChanges();
    }

    ngOnChanges() {
    }
}
