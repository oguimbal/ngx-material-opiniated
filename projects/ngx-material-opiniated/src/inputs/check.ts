import {Component, EventEmitter, Input, Output} from '@angular/core';

/*
Classes usable:
.danger
.danger-false
*/
@Component({
    selector: 'check',
    styleUrls: ['./check.scss'],
    templateUrl: './check.pug',
})
export class CheckComponent {

    @Input()
    value: boolean;

    @Output()
    valueChange = new EventEmitter<boolean>();

    @Input()
    readonly: boolean;

    onChange($event) {
        if (this.readonly) {
            return;
        }
        this.value = !!$event;
        this.valueChange.emit(this.value);
    }
}

