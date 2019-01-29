import { Component, Input } from '@angular/core';
import { IGridColumn } from './grid-datasource';
import { INotificationService } from '../services';

@Component({
    template: `<btn *ngIf="show" class="sm" [icon]="icon" [disabled]='!canExecute' [action]='execute'  [ngClass]='btnClass'>{{message}}</btn>`,
})
export class ActionBinderComponent {

    @Input()
    action: any;
    @Input()
    item: any;
    @Input()
    icon: string;

    @Input()
    message: string;

    btnClass: string;
    col: IGridColumn;

    constructor(private alert: INotificationService) {

    }

    get show() {
        if (!this.col.canExecute)
            return true;
        const exec = this.col.canExecute.bind(this.col)(this.item);
        return exec !== 'hide';
    }

    get canExecute() {
        if (!this.action)
            return false;
        if (this.col.canExecute) {
            const exec = this.col.canExecute.bind(this.col)(this.item);
            return exec === true || exec === 'active';
        }
        return true;
    }


    execute = async () => {
        if (!this.canExecute)
            return;
        let fn = this.action;
        if (typeof fn !== 'function')
            fn = fn.action;

        if (typeof fn !== 'function') {
            console.warn('Cannot execute action ' + this.col.name);
            return;
        }

        fn = fn.bind(this.item);

        try {
            // this.executing = true;
            // confirm if required
            if (this.col.confirm) {
                const conf = this.col.confirm;
                if (!await this.alert.confirm(conf.title))
                    return;
            }
            // execute
            const exec = fn();
            if (exec && exec.then)
                await exec; // if promise, await !
        } finally {
            // this.executing = false;
            // this.refresh();
        }
    }
}
