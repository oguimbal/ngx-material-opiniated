import { Component, OnInit, TemplateRef, ViewContainerRef, OnChanges, EmbeddedViewRef, OnDestroy, SimpleChanges, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'tr.openrow',
    template: `<td [attr.colspan]="colspan"><div #target></div></td>`,
    styleUrls: ['./grid-open.scss'],
})
export class GridOpenRowComponent implements OnInit, OnChanges, OnDestroy {
    vref: EmbeddedViewRef<any>;

    @Input()
    item: any;
    @Input()
    readonly: boolean;
    @Input()
    template: TemplateRef<any>;
    @Input()
    colspan;

    @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;

    ngOnInit() {
    }
    ngOnDestroy(): void {
        if (this.vref)
            this.vref.destroy();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.vref &&  'template' in changes) {
            this.vref.destroy();
            this.vref = null;
        }
        if (!this.vref) {
            this.vref = this.target.createEmbeddedView(this.template, {$implicit: this.item, readonly: this.readonly});
        }
        this.vref.context.readonly = this.readonly;
        this.vref.context.$implicit = this.item;
    }

}
