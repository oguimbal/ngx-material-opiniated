import { Component, OnInit, TemplateRef, OnChanges, ViewContainerRef, Input} from '@angular/core';


@Component({
// tslint:disable-next-line: component-selector
    selector: 'template-injector',
    template: ``,
})
export class TemplateInjectorComponent implements OnInit, OnChanges {
    @Input()
    value: any;
    @Input()
    template: TemplateRef<any>;
    @Input()
    name = 'item';
    model: any;

    constructor(
        private view: ViewContainerRef
    ) {
    }

    ngOnInit() {
        this.model = {};
        this.model[this.name] = this.value;
        this.view.createEmbeddedView(this.template, this.model);
    }

    ngOnChanges(c: any) {
        if (!this.model) {
            return;
        }
        this.model[this.name] = this.value;
    }
}
