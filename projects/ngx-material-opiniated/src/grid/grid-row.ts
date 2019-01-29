import { Component, OnInit, EventEmitter, Inject, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output } from '@angular/core';
import { copyWithFunctions, resetTo } from '@oguimbal/utilities';
import { GridComponent } from './grid';
import { Column } from './grid-datasource';
import { INotificationService } from '../services';



// ======================================================================================== Row

@Component({
    selector: 'tr.datarow',
    styleUrls: ['./grid-row.scss'],
    templateUrl: './grid-row.pug',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridRowComponent implements OnInit {
    currentRow: any;
    original = null;
    private _isEditting = false;

    @Input()
    row: any;
    @Input()
    onSave: (elt) => void|any|Promise<any> = null;
    @Input()
    onDelete: (elt) => void|any|Promise<any> = null;
    @Input()
    columns: Column[] = [];
    @Input()
    cellClass: string;
    @Output()
    delete = new EventEmitter();

    constructor(
        private notif: INotificationService,
        private cd: ChangeDetectorRef,
        @Inject(forwardRef(() => GridComponent))  private grid: GridComponent) {

    }
    ngOnInit() {
        this.currentRow = this.row;
    }

    classFor(col: Column) {
        const datatype = 'col-' + (col.def.type || 'custom');
        const align = col.align;
        if (align === 'left')
            return datatype;
        return ['text-', align, ' ', datatype].join('');
    }


    get isEditting() {
        if (this._isEditting)
            return true;
        return this.currentRow && this.currentRow['$$new$$'];
    }


    edit() {
        if (this.isEditting)
            return;
        this._isEditting = true;
        if (typeof this.currentRow.clone === 'function')
            this.original = this.currentRow.clone();
        else
            this.original = copyWithFunctions(this.currentRow, false);
        this.currentRow.$$isEditting = true;
        this.grid.cd.detectChanges();
        this.cd.detectChanges();
    }

    save = async () => {
        try {
            if (!this.isEditting)
                return;
            let sv = this.onSave(this.currentRow);
            if (sv && typeof sv.then === 'function')
                sv = await sv;
            const final = sv || this.currentRow;
            // if (this.original)
            //     copyFunctions(final, this.original);
            if (this.currentRow !== final) {
                if (typeof this.currentRow.resetTo === 'function')
                    this.currentRow.resetTo(final);
                else
                    resetTo(this.currentRow, final);
            }
            this.original = null;
            this._isEditting = false;
            delete this.currentRow['$$new$$'];
            delete this.currentRow['$$isEditting'];
            delete this.currentRow['$$open'];
            this.grid.cd.detectChanges();
            this.cd.detectChanges();
        } catch (err) {

            if (typeof err !== 'string')
                err = err.message;
            if (typeof err === 'string')
                this.notif.error('Failed to save: ' + err);
            else
                this.notif.error('Failed to save');
        }
    }
    doDelete = async () => {
        if (this.isEditting)
            return;
        if (!(await this.notif.confirm('Do you really want to delete this ?')))
            return;
        let sv = this.onDelete(this.currentRow);
        if (sv && typeof sv.then === 'function')
            sv = await sv;
        this.delete.emit(this.row);
        this.cd.detectChanges();
    }

    cancel() {
        if (!this.isEditting)
            return;
        if (!this.original) {
            this.delete.emit(this.row); // not 'currentRow'
            return;
        }
        if (typeof this.currentRow.resetTo === 'function')
            this.currentRow.resetTo(this.original);
        else
            resetTo(this.currentRow, this.original);
        this.original = null;
        this._isEditting = false;
        delete this.currentRow['$$new$$'];
        delete this.currentRow['$$isEditting'];
        delete this.currentRow['$$open'];

        this.grid.cd.detectChanges();
        this.cd.detectChanges();
    }

    onCellClick(item: any, col: Column, $event: MouseEvent) {
        const t = this.grid.openTemplateByColumn[col.key];
        if (!this.isCellOpenable(item, col))
            return;
        $event.stopPropagation();
        if (item['$$open'] === t.template)
            delete item['$$open'];
        else {
            delete item['$$open'];
            item['$$open'] = t.template;
        }
        this.grid.cd.detectChanges();
        this.cd.detectChanges();
    }

    isCellOpen(item: any, col: Column) {
        const t =  this.grid.openTemplateByColumn[col.key];
        return this.isCellOpenable(item, col) && item.$$open === t.template ;
    }

    isCellOpenable(item: any, col: Column) {
        const t = this.grid.openTemplateByColumn[col.key];
        if (!t)
            return false;
        switch (t.canOpen) {
            case 'editonly':
                return this.isEditting;
            case 'readonly':
                return !this.isEditting;
        }
        return true;
    }
}
