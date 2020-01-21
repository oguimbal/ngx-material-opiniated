

import { Observable, isObservable, from, ObservableInput } from 'rxjs';

/** Infers an observable from a given value (constant value, promise, observable, ...) */
export function toObservable<T>(value: any): Observable<T> {
    if (typeof value === 'function')
        value = value();
    if (isObservable<T>(value))
        return value;
    if (value && typeof value.then === 'function')
        return from(value) as any;
    return from([value]);
}

export function graphMatches(item: any, val: string) {
    if (!item) {
        return false;
    }
    if (!val) {
        return true;
    }
    val = val.toLowerCase();
    const m = (o: any, i: number) => {
        if (!o || i > 3) {
            return false;
        }
        if (o instanceof Array) {
            return !!o.find(x => m(x, i + 1));
        }
        switch (typeof o) {
            case 'object':
                return !!Object.keys(o).find(x => m(o[x], i + 1));
            case 'string':
                return o.toLowerCase().includes(val);
        }
        return false;
    };
    return m(item, 0);
}
