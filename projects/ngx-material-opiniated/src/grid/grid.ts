import {Component, EventEmitter, TemplateRef, ChangeDetectorRef, AfterViewInit, ContentChildren, QueryList, Directive, AfterContentInit, Input, Output } from '@angular/core';
import {DataSource, Column} from './grid-datasource';

const gridColumnKey = '_gridColumn';
@Directive({
    selector: '[gridColumn]',
})
export class GridColumnDirective {

    @Input()
    set gridColumn(name: string) {
        this._templateRef[gridColumnKey] = name;
    }

    constructor(private _templateRef: TemplateRef<any>
    ) {
    }
}


const gridOpenColumnKey = '_gridOpenColumn';
@Directive({
    selector: '[gridOpenColumn]',
})
export class GridOpenColumnDirective {

    @Input()
    set gridOpenColumn(name: string) {
        const val = this._templateRef[gridOpenColumnKey] = this._templateRef[gridOpenColumnKey] || {};
        val.name = name;
    }

    @Input()
    set canOpen(openOn: 'editonly' | 'readonly' | null) {
        const val = this._templateRef[gridOpenColumnKey] = this._templateRef[gridOpenColumnKey] || {};
        val.canOpen = openOn;
    }

    constructor(private _templateRef: TemplateRef<any>
    ) {
    }
}

// ======================================================================================== GRID
@Component({
    selector: 'grid',
    templateUrl: './grid.html',
    styleUrls: ['./grid.scss'],
})
export class GridComponent implements AfterViewInit, AfterContentInit {
    private _pageLength: number;
    private _source;
    private _columns: Column[];
    private _canFilter = false;
    data: DataSource;

    @Input()
    canSearch = true;

    @Input()
    rowContextMenu: any;

    @Input()
    cellClass: (value: any, col: Column, elt: any) => string;

    @Output()
    rowClick = new EventEmitter();

    @Input()
    searchPlaceholder = '';
    // can be either 'true' for all columns except those explicitely not sorted, or false to define a by-column sorting
    @Input()
    canSort = true;

    @Input()
    onSave: (elt: any) => void|any|Promise<any>;

    @Input()
    onDelete: (elt: any) => void|any|Promise<any>;

    @Input()
    canAdd: boolean|string;

    @Input()
    add: () => void;

    @Input()
    create: () => any;

    @Input()
    gridTitle = '';

    @ContentChildren(TemplateRef) allTemplates: QueryList<TemplateRef<any>>;

    templateByColumn: {[column: string]: TemplateRef<any>} = {};
    openTemplateByColumn: {[column: string]: {template: TemplateRef<any>; canOpen: 'editonly' | 'readonly' | null}} = {};
    ngAfterViewInit(): void {
        // this.refresh();
        this.cd.detectChanges();
    }

    get isEditting() {
        return this.lines && !!this.lines.find(l => l['$$new$$'] || l['$$isEditting']);
    }


    ngAfterContentInit() {
        this.allTemplates.forEach(t => {
            const col = t[gridColumnKey];
            if (col)
                this.templateByColumn[col] = t;
            const openCol = t[gridOpenColumnKey];
            if (openCol) {
                this.openTemplateByColumn[openCol.name] = {template: t, canOpen: openCol.canOpen};
            }
        });
    }

    classFor(col: Column) {

        const align = col.align;
        let cl = ''; // 'col-' + col.type;
        if (align !== 'left')
            cl = cl + ' text-' + align;
        if (this.canSortCol(col))
            cl = cl + ' cansort';
        return cl;
    }

    get canClick() {
        return this.rowClick.observers.length > 0;
    }

    onClick($event: any, x: any) {
        this.rowClick.emit(x);
    }

    private canSortCol(col: Column) {
        if (!this.canSort)
            return false;
        return col.canSort;
    }

    @Input()
    set customFilter(filter: (search: string, item: any) => boolean) {
        this.data.customFilter = filter;
    }

    sortClassFor(col: Column) {
        if (!this.canSortCol(col))
            return '';
        switch (this.data.sortOrderfor(col.key)) {
            case 'asc':
                return 'fa fa-sort-asc';
            case 'desc':
                return 'fa fa-sort-desc';
            default:
                return 'fa fa-sort';
        }
    }

    sortBy(col: Column) {
        if (!this.canSortCol(col))
            return;
        this.data.sortBy(col.key);
    }


    get canAddText() {
        if (typeof this.canAdd === 'string')
            return this.canAdd;
        return 'Add new';
    }

    onAdd($event?: any) {
        if (this.add) {
            this.add();
            return;
        }
        if (this.data)
            this.data.create(this.create);
    }

    get columns() {
        return this._columns;
    }

    @Input()
    set columns(v) {
        if (this._columns === v)
            return;
        if (this.data)
            this.data.setColumns(v);
        this._columns = v;
    }

    get lines() {
        return this.data ? this.data.data : [];
    }

    removeRow(row) {
        this.data.data.splice(this.data.data.indexOf(row), 1);
    }

    get canFilter() { return this._canFilter; }
    @Input()
    set canFilter(v: boolean) {
        v = v === true || (<any>v) === 'true';
        if (v === this._canFilter)
            return;
        this._canFilter = v;
        this.resetFilters();
    }


    gotoPage(pageId) {
        if (typeof pageId !== 'undefined')
            this.data.page = pageId;
    }

    get currentPage() {
        return parseInt(<string>this.data.page, 10);
    }

    get source() { return this._source; }

    get totalCount() {
        return this.data.totalCount;
    }

    get searchText() {
        if (!this.data)
            return '';
        return this.data.searchText;
    }

    set searchText(v) {
        if (!this.data)
            return;
        this.data.searchText = v;
    }

    refresh() {
        this.data.refreshData();
    }

    /**
     * Sets the source. Can be:
     * - a set of objects (in memory source)
     * - a static json data url source (will be transformed to an in-memory source)
     * - a configurable url source, using {q} as a question (does not work with 'canFilter')
     * - a fully customizable source: must be a function which returns an Rx observable,
     *    and which takes for argument: (filters:{filteredProperty:filterValue},  order:[{column:'name', desc:true/false}])
     */
    @Input()
    set source(v) {
        this.data = new DataSource(v);
        if (this._pageLength) {
            this.data.setPageLength(this._pageLength, false);
        }
        this._source = v;
        if (this._columns)
            this.data.setColumns(this._columns);
        this.refresh();
    }

    constructor(public cd: ChangeDetectorRef) {

    }

    // ============== resets grid filtering ============
    resetFilters() {
        if (this.data)
            this.data.columns.forEach(x => x.filter = null);
    }


    @Input()
    get pageLength() {
        return this.data ? this.data.pageLength : this._pageLength;
    }

    set pageLength(v) {
        if (this.pageLength === v)
            return;
        if (this.data)
            this.data.setPageLength(v);
        else
            this._pageLength = v;
    }
}
