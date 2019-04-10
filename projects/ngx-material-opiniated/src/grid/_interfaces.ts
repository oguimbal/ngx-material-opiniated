import { Type } from '@angular/core';

/** property key (if string), true if self value, or a getter */
export type PropGetter<T> = string | true | ((item) => T);
export type ColumnNativeType = 'string' | 'number' | 'boolean' | 'money' | 'date' | 'action';
export type Alignment = 'center' | 'left' | 'right';

export interface IGridColumn {
    name?: string;
    type?: ColumnNativeType;
    customType?: IColumnType;
    /** default 'left' */
    align?: Alignment;
    canSort?: boolean;
    canFilter?: boolean;
    /** for actions */
    icon?: string;
    /** for actions */
    color?: 'success' | 'danger' | 'cancel';
    /** for actions */
    canExecute?: (item) => boolean|'active'|'inactive'|'hide';
    readonly?: boolean;
    /** A custom argument, usable on custom column types initialization */
    arg?: any;
    /** for actions */
    confirm?: {
        title: string; yes: string;
    };
}
export interface IColumnType {
    component: Type<any>;
    readonlyComponent?: Type<any>;
    onInitComponent?: (component: any, col: IGridColumn) => void;
    onInitReadonlyComponent?: (component: any, col: IGridColumn) => void;
    /** if sortable column */
    sortOn?: PropGetter<string|number>;
    /** if filterable column */
    filterOn?: PropGetter<number|string|string[]>;
    /** Component's property to bind. Defaults to 'value' */
    bindOn?: string;
    /** Component's property to bind full item to (if any) */
    bindItemOn?: string;
    /** Readonly property binding. Defaults to 'readonly' */
    bindReadonlyOn?: string;
    /**  defaults to 'left' */
    align?: Alignment;
    readonly?: boolean;
    _matches?: (x: any) => boolean;
    _matchPriority?: number;
}

