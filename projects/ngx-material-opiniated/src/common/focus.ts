import {Directive, ElementRef, ViewContainerRef, Optional, Renderer2, Input} from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    constructor(public renderer: Renderer2, private elt: ElementRef, @Optional() private view: ViewContainerRef) {
    }

    @Input()
    set focus(v) {
        if (typeof v === 'string') {
            v = v === 'true';
        }
        if (typeof v === 'function') {
            v = v();
        }
        v = !!v;

        if (v) {
            if (this.elt.nativeElement.tagName === 'NG2-DROPDOWN-BUTTON') {
                setTimeout(() => {
                    // do not propagate click event on button...
                    const but = this.elt.nativeElement.childNodes[0];
                    const handler = (e: Event) => {
                        e.stopPropagation();
                        but.removeEventListener('click', handler);
                        return false;
                    };
                    but.addEventListener('click', handler);
                    but.click();
                }, 1);
            } else if (typeof this.elt.nativeElement._focus === 'function') {
                setTimeout(() => this.elt.nativeElement._focus(), 1);
            } else {
                setTimeout(() => this.elt.nativeElement.focus(), 1);
            }
        }
    }
}
