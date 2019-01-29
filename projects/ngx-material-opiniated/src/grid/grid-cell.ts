import { Component, OnDestroy, OnChanges, ViewContainerRef, SimpleChanges, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef, Inject, forwardRef, EmbeddedViewRef, Input } from '@angular/core';
import { Column } from './grid-datasource';
import {GridComponent} from './grid';
import { Observable } from 'rxjs';

@Component({
    selector: 'column-cell',
    template: '',
})
export class GridCellComponent implements OnDestroy, OnChanges {

    @Input()
    item: any;
    @Input()
    column: Column;
    private cref: ComponentRef<any>;
    private disposes = [];
    private _isEditting = false;
    vref: EmbeddedViewRef<any>;

    constructor(private _viewContainer: ViewContainerRef
        , private cd: ChangeDetectorRef
        , @Inject(forwardRef(() => GridComponent))  private grid: GridComponent
        , private compFactoryRes: ComponentFactoryResolver) {
    }

    get isEditting() {
        // if (!this.column.editable || this.column.def.readonly)
        //     return false;
        return this._isEditting;
        // if (this.column.editMode) {
        //     if (this.item['$$new$$'])
        //         return this.column.editMode !== 'new';
        //     return this.column.editMode !== 'edit';
        // }
    }

    @Input()
    set isEditting(v) {
        const ct = this.customTemplate;
        if (this.column.def.readonly && !ct)
            return;
        v = !!v;
        if (!this.column.editable &&  !ct || this._isEditting === v)
            return;
        this._isEditting = v;
        if (this.column.def.customType.readonlyComponent && !ct)
            this.ngOnDestroy(); // destroys sub-component
    }

    get customTemplate() {
        return this.grid.templateByColumn[this.column.key];
    }


    ngOnDestroy() {
        this.disposes.forEach(x => x());
        this.disposes = [];
        if (this.cref) {
            this._viewContainer.clear();
            this.cref.destroy();
            this.cref = null;
        }
        if (this.vref) {
            this._viewContainer.clear();
            this.vref.destroy();
            this.vref = null;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

        const template =  this.customTemplate;
        if (template) {
            // use a child template
            if (!this.vref)
                this.vref = this._viewContainer.createEmbeddedView(template, {});
            this.vref.context.$implicit = this.item;
            this.vref.context.readonly = !this.isEditting;
            this.vref.detectChanges();
            return;
        }

        // create view if necessary
        const ctype = this.column.def.customType;

        if (!this.cref) {
            this._viewContainer.clear();
            let comp = {type: ctype.component, onInit: ctype.onInitComponent};
            if (!this.isEditting && ctype.readonlyComponent) {
                comp = {type: ctype.readonlyComponent, onInit: ctype.onInitReadonlyComponent};
            }
            const factory = this.compFactoryRes.resolveComponentFactory(comp.type);
            this.cref = this._viewContainer.createComponent(factory, 0);

            if (ctype.bindItemOn)
                this.cref.instance[ctype.bindItemOn] = this.item;

            // subscribe to changes
            const change = <Observable<any>> this.cref.instance[(ctype.bindOn || 'value') + 'Change'];
            if (change && change.subscribe) {
                const sub = change.subscribe(val => {
                    if (this.item[this.column.key] === val)
                        return;
                    this.item[this.column.key] = val;
                    this.cd.detectChanges();
                });
                this.disposes.push(() => sub.unsubscribe());
            }

            if (comp.onInit)
                comp.onInit(this.cref.instance, this.column);

        }

        // ====== bind values
        if (!ctype.readonlyComponent && !this.column.def.readonly)
            this.cref.instance[this.column.def.customType.bindReadonlyOn || 'readonly'] = !this.isEditting;
        this.cref.instance[ctype.bindOn || 'value'] = this.item[this.column.key];

        // detect changes
        this.cref.changeDetectorRef.detectChanges();
    }
}
