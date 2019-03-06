import {escapeRegExp, sortBy, range} from '@oguimbal/utilities';
import moment from 'moment';
import * as inputs from '../inputs/index';
import * as display from '../display/index';
import { ActionBinderComponent } from './action-binder';
import { IGridColumn, IColumnType, ColumnNativeType, Alignment, PropGetter } from './_interfaces';

enum SourceType { Objects, Json, ConfigurableJson, Custom }


const nativeTypes: {[key: string]: IColumnType} = {
    'string': {
        component: inputs.TextComponent,
        readonlyComponent: display.LabelComponent,
        sortOn: true,
        filterOn: true,
        _matches: x => typeof x === 'string',
        _matchPriority: 10,
        onInitComponent: (x: inputs.TextComponent, col: IGridColumn) => {
            x.icon = col.icon;
        },
    },
    'number': {
        component: inputs.TextComponent,
        readonlyComponent: display.NumberLabelComponent,
        onInitComponent: (x: inputs.TextComponent) => x.type = 'number',
        sortOn: true,
        filterOn: true,
        align: 'right',
        _matches: x => typeof x === 'number',
        _matchPriority: 10,
    },
    'boolean': {
        component: inputs.CheckComponent,
        sortOn: true,
        filterOn: x => x,
        align: 'center',
        _matches: x => typeof x === 'boolean',
        _matchPriority: 10,
    },
    'money': {
        component: display.MoneyComponent,
        sortOn: 'amt',
        filterOn: x => [x.amt, x.cur],
        align: 'right',
        readonly: true, // <= does not support edition
        _matches: x => typeof x === 'object' && 'amt' in x && 'cur' in x,
        _matchPriority: 10,
    },
    'date': {
        component: inputs.DateTimeComponent,
        sortOn: true,
        filterOn: true,
        _matches: x => x instanceof Date || moment.isMoment(x) || typeof x === 'string' && moment(x, moment.ISO_8601).isValid(),
        _matchPriority: 50,
    },
    'action': {
        component: ActionBinderComponent,
        bindOn: 'action',
        bindItemOn: 'item',
        readonly: true, // <= does not support edition
        _matches: x => typeof x === 'function',
        _matchPriority: 10,
        onInitComponent: (x: ActionBinderComponent, col: IGridColumn) => {
            if (col.icon)
                x.icon = 'fa ' + col.icon;
            if (col.color)
                x.btnClass = col.color;
            x.col = col;
            x.message = col.arg || col.name;
        }
    },
};

let nativeTypesArray: {key: ColumnNativeType; type: IColumnType}[];

function initArray(force?: boolean) {
    if (nativeTypesArray && !force)
        return;
    nativeTypesArray = Object.keys(nativeTypes)
        .sort((a, b) => nativeTypes[b]._matchPriority -  nativeTypes[a]._matchPriority)
        .map(k => ({type: nativeTypes[k], key: <ColumnNativeType> k}));
}

export function addGridNativeType(key: string, type: IColumnType) {
    if (!type._matches || !type.component)
        throw new Error('Invalid native type');
    nativeTypes[key] = type;
    if (nativeTypesArray)
        initArray(true); // reinit array
}






const showGrid_key = '__showgrid__';
export function showGrid(name?: string|IGridColumn) {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const c = target.constructor;
        const v = (c[showGrid_key] || (c[showGrid_key] = {}));
        if (typeof name === 'object') {
            v[propertyKey] = name;
        } else {
            v[propertyKey] = {
                name: (name || propertyKey),
            };
        }
        return descriptor;
    };
}



export class Column {

    editMode: 'new' | 'edit' | null = null;
    private _filter: string;

    get filter() {
        return this._filter;
    }
    set filter(v: string) {
        if (v === this._filter)
            return;
        this._filter = v;
        this.owner.page = 0;
        this.onFilterChanged();
        this.owner.refreshData();
    }

    get canFilter(): boolean {
        return this.def.canFilter !== false && !!this.def.customType.filterOn;
    }

    get canSort(): boolean {
        return this.def.canSort !== false && !!this.def.customType.sortOn;
    }

    get align(): Alignment {
        return this.def.align || this.def.customType.align || 'left';
    }

    set align(v: Alignment) {
        this.def.align = v;
    }

    get editable(): boolean {
        return !this.def.readonly && !this.def.customType.readonly;
    }


    private _name: string;
    get name() {
        return this._name;
    }

    set name(name) {
        if (name === this.key) {
            name = name.replace(/[A-Z]/g, x => ' ' + x.toLowerCase());
            name = name.substring(0, 1).toUpperCase() + name.substring(1);
        }
        this._name = name;
    }

    get sortBy(): PropGetter<string|number> {
        if (this.def.canSort === false)
            return null;
        return this.def.customType.sortOn;
    }

    get filterOn(): PropGetter<number|string|string[]> {
        if (this.def.canSort === false)
            return null;
        return this.def.customType.filterOn;
    }

    constructor(private owner: DataSource,
        private onFilterChanged: (() => void),
        public key: string,
        public def: IGridColumn,
        public nullable: boolean) {

        if (!this.def.customType)
            this.def.customType = nativeTypes[this.def.type];
        if (!this.def.customType)
            throw new Error(`Unspecified column type ${this.def.type}/${this.def.customType}/${this.def.name}`);
        this.name = this.def.name || key || '';
    }
}

export class DataSource {
    private _totalCount: number;
    get totalCount() {
        return this._totalCount;
    }
    get data(): any[] {
        // if (!this._data) {
        //     if (this.isLoading || this.error)
        //         return this._data || [];
        //     this.refreshData();
        // }
        return this._data;
    }
    get pageCount() {
        return this._pageCount;
    }
    get page() {
        return this._page;
    }

    set page(v) {
        if (this._page === v)
            return;
        this._page = v;
        this.refreshData();
    }
    get pageLength() {
        return this._pageLength;
    }



    get pageBy() {
        return this._pageBy;
    }
    set pageBy(v) {
        if (this._pageBy === v)
            return;
        this._pageBy = v;
        this.refreshData();
    }


    constructor(private source: any) {


        // 1) finds how to get data
        let retreiveRaw: (() => Promise<any[]>) = null;
        if (typeof source === 'string') {
            if (this.source.indexOf('{q}') >= 0) {
                let currentQuestion = null;
                const currentResult = null;
                retreiveRaw = () => {
                    if (currentQuestion === this.question && currentResult)
                        return currentResult;
                    currentQuestion = this.question;
                    throw new Error ('No htpt get => migrate that');
                    // return currentResult = http.get<any[]>(str)
                    //     .then(data => this.inferColumns(data));
                };
            } else {
                throw new Error ('No htpt get => migrate that');
                // const got = http.get<any[]>(source)
                //     .then(data => this.inferColumns(data));
                // retreiveRaw = () => got;
            }
        } else if (Array.isArray(source)) {
            this.inferColumns(source);
            retreiveRaw = () => Promise.resolve(source);
        } else if (typeof source === 'function') {
            let dataGot = null;
            retreiveRaw = async () => {
                if (dataGot)
                    return dataGot;
                let data = source();
                if (typeof data.subscribe === 'function')
                    data = data.toPromise();
                if (data && typeof data.then === 'function')
                    data = await data;
                return dataGot = this.inferColumns(data);
            };
        }

        // 2) apply in memory filtering
        let retreiveFiltered = retreiveRaw;
        if (retreiveRaw) {
            let filtered: any[];
            retreiveFiltered = async () => {
                if (this.cachedFilter && filtered)
                    return Promise.resolve(filtered);
                this.cachedFilter = this.createFilter();
                const data = await retreiveRaw();
                return filtered = data.filter(this.cachedFilter);
            };
        }
        // 3) apply sorting
        let retreiveSorted = retreiveFiltered;
        if (retreiveFiltered) {
            retreiveSorted = () => retreiveFiltered()
                .then(data => {
                    for (const order of this.orders) {
                        const col = this.columnByKey[order.key];
                        if (!col)
                            continue;
                        let sortKey = col.sortBy;
                        if (sortKey === true)
                            sortKey = col.key;
                        if (typeof sortKey === 'string')
                            data = sortBy(data, sortKey, !order.asc);
                        else
                            data = sortBy(data, sortKey, !order.asc);
                    }
                    return data;
                });
        }

        // apply paging
        let retreivePaged = retreiveSorted;
        if (retreiveSorted) {
            retreivePaged = () => retreiveSorted()
                .then(data => {
                    // page by number
                    this._totalCount = data.length;
                    if (!this.pageBy) {
                        const page = parseInt(<any>this.page, 10);
                        const paged = data.slice(page * this.pageLength, (page + 1) * this.pageLength);
                        return paged;
                    }
                    // page by alphabetic key
                    throw new Error('Alphabetic paging not implemented');
                });
        }

        if (!retreivePaged)
            throw new Error('Custom sources not yet implemented');

        this.refreshData = () => {
            const loader = async () => {
                this.isLoading++;
                try {
                    const loaded = await retreivePaged();
                    if (this.currentLoad === loader)
                        this._data = loaded;
                } catch (e) {
                    // if (this.currentLoad === loader)
                    //     this._data = null;
                    throw e;
                } finally {
                    this.isLoading--;
                }
            };
            this.currentLoad = loader;
        };
    }
    get searchText() {
        return this._searchText;
    }

    set searchText(v) {
        if (this._searchText === v)
            return;
        this._searchText = v;
        if (this.columns)
            this.columns.forEach(x => x.filter = null);
        this.cachedFilter = null;
        this.refreshData();
    }

    private question;
    error: any;

    private orders: {asc: boolean; key: string; }[] = [];
    private ordersByKey: {[key: string]: boolean} = {};

    columns: Column[] = [];
    private columnsInfered: boolean;
    private columnByKey: {[key: string]: Column} = {};
    refreshData: () => void = null;
    isLoading = 0;

    private _pageBy = null;

    private _data = null;

    private _pageCount = null;


    private _page: number|string = 0;

    private _pageLength = 15;

    currentLoad: () => Promise<any>;

    private _searchText;

    private _stringColumnsDefs;


    customFilter: (search: string, item: any) => boolean;
    private cachedFilter;

    setPageLength(v: number, noRefresh?: boolean) {
        if (this._pageLength === v)
            return;
        this._pageLength = v;
        if (!noRefresh)
            this.refreshData();
    }


    sortBy(key: string) {
        const col = this.columnByKey[key];
        if (!col)
            return;
        const found = this.orders.find(x => x.key !== key);
        if (found) {
            if (found.asc) {
                found.asc = false;
                this.ordersByKey[key] = false;
            } else {
                this.orders.splice(this.orders.indexOf(found), 1);
                delete this.ordersByKey[key];
            }
        } else {
            this.orders.splice(0, 0, {asc: true, key: key});
            this.ordersByKey[key] = true;
        }
        this.refreshData();
    }


    sortOrderfor (key: string): 'asc' | 'desc' | null {
        if (!(key in this.ordersByKey))
            return null;
        return this.ordersByKey[key] ? 'asc' : 'desc';
    }


    /**
     * Guess column schema, based on data.
    */
    private inferColumns<T>(data: T[]): T[] {
        if (!Array.isArray(data))
            throw new Error('Source must return array of data: ' + this.source);
        initArray();
        // get some stats on data columns
        const getType: (x) => ColumnNativeType|null = x => {
            if (x === null || typeof x === 'undefined')
                return null;
            for (const nt of nativeTypesArray) {
                if (nt.type._matches(x))
                    return nt.key;
            }
            return null;
        };

        const first: Object = data.find(x => !!x);
        const constr = first ? Object.getPrototypeOf(first).constructor : null;
        let showGridx: { [key: string]: IGridColumn } = constr ? constr[showGrid_key] : null;
        let dataKeys: { [key: string]: IGridColumn } = null;
        if (showGridx) {
            // yea ! that's an explicit model using @showGrid() attributes
            dataKeys = showGridx;
        } else
            showGridx = {};

        const columns: {[key: string]: {nullable: boolean; type: {[native: string]: number}; }} = {};
        data
            .slice(0, 30) // let's assume that 30 elements will be sufficient to guess schema
            .forEach(elt => {
                for (const k in (<any> dataKeys || elt)) {
                    if (!k || k.startsWith('$') || k.startsWith('_') || !(k in elt))
                        continue;
                    const val = elt[k];
                    let stat = columns[k];
                    if (!stat)
                        columns[k] = stat = { nullable: false, type: {} };
                    const strong = showGridx[val];
                    const tv = (strong ? strong.type : null) || getType(val);
                    if (!tv) {
                        stat.nullable = true;
                        continue;
                    }
                    stat.type[tv] = (stat.type[tv] || 0) + 1;
                }
            });

        // create the columns
        this.columns = [];
        this.columnByKey = {};
        Object.keys(columns).forEach(key => {
            const stat = columns[key];
            const chosenTypes = Object.keys(stat.type)
                        .map(tk => ({ count: stat.type[tk], type: tk }))
                        .sort(x => x.count);
            const chosenType = chosenTypes[chosenTypes.length - 1];
            const type = <ColumnNativeType>(chosenType ? chosenType.type : 'string');

            // Merge with custom config
            let strong: IGridColumn = showGridx[key] || {};
            if (strong) {
                if (!strong.type && !strong.customType)
                    strong.type = type;
            } else {
                strong = {
                    type: type,
                };
            }
            const col = new Column(this, () => {
                this.cachedFilter = null;
            }, key, strong, stat.nullable);
            this.columns.push(col);
            this.columnByKey[key] = col;
        });

        this.columnsInfered = Object.keys(this.columnByKey).length > 0;
        if (this._stringColumnsDefs)
            this.setColumns(this._stringColumnsDefs);

        return data;
    }
    setColumns(columnDefs: string|Column[]) {
        this._stringColumnsDefs = columnDefs;
        if (!this.columnsInfered) // must wait for actual column definition (from data)
            return;

        // If string, then just filter columns (format 'x,y,z')
        if (typeof columnDefs === 'string') {
            const showCols = (<string>columnDefs).split(',').map(x => x.trim());
            this.columns = showCols
                .map(sc => this.columnByKey[sc])
                .filter(x => !!x);
            return;
        }
    }
    /**
     * Creates a function that returns an object predicate
    */
    private createFilter(): ((data: any) => boolean) {

        const makeColFilter: (col: Column, val: any) => ((item: any) => boolean) = (col: Column, val: any) => {
            if (val === undefined || val === null)
                return null;
            const numVal = parseInt(val, 10);
            const regVal = typeof val === 'string' ? new RegExp(escapeRegExp(val), 'i') : null;
            if (!col.canFilter)
                return null;
            let getter = col.filterOn;
            if (getter === true)
                getter = col.key;
            if (typeof getter === 'string') {
                const f = getter;
                getter = x => x[f];
            } else if (typeof getter === 'function') {
                const f = getter;
                getter = x => f(x[col.key]);
            }
            const get = getter;
            const checkVal = (x: any) => {
                if (x === val || x === numVal)
                    return true;
                if (typeof x === 'string' && regVal && regVal.test(x))
                    return true;
            };
            if (!get)
                return null;
            return x => {
                const v = get(x);
                if (Array.isArray(v))
                    return !!(<any[]>v).find(checkVal);
                return checkVal(v);
            };
        };
        if (this.searchText) {
            // filter by global search
            const parts = this.columns.map(col => makeColFilter(col, this.searchText)).filter(x => !!x);
            let finalFilter = x => !!parts.find(p => p(x));
            if (parts.length === 0)
                finalFilter = () => true;
            if (this.customFilter) {
                return (x) => {
                    const custResult = this.customFilter(this.searchText, x);
                    if (typeof custResult === 'boolean')
                        return custResult;
                    return finalFilter(x);
                };
            }
            return finalFilter;
        } else {
            // filter by column
            const parts = this.columns.map(col => makeColFilter(col, col.filter)).filter(x => !!x);
            if (parts.length === 0)
                return () => true;
            return x => !parts.find(p => !p(x));
        }
    }

    create(addFn?: () => void) {
        if (this.isLoading)
            return;
        let data = null;
        if (addFn)
            data = addFn();
        data = data || {};
        data.$$new$$ = true;
        this.data.push(data);
        this.inferColumns(this.data);
    }
}
