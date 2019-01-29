import { Component, OnInit, EventEmitter, ViewChild, ElementRef, OnChanges, Input, Output } from '@angular/core';
import moment from 'moment';

// https://www.npmjs.com/package/ngx-clarity-datetime

@Component({
    selector: 'datetime',
    templateUrl: './datetime.html',
    styleUrls: ['./datetime.scss'],
})
export class DateTimeComponent implements OnInit, OnChanges {

    @Input()
    name: string;
    @Input()
    placeholder: string;
    @Input()
    minDate;
    @Input()
    maxDate;
    @Input()
    inline: Boolean = false;
    @Input()
    showClear: Boolean = false;
    @Input()
    disabled: boolean;
    @Input()
    readonly: boolean;

    valueInternal: Date;

    @Output()
    valueChange = new EventEmitter<moment.Moment>();

    @Input()
    type: 'date' | 'moment' = 'moment';
    opened = true;

    options: any = {};
    private _value;


    @ViewChild('dtinput') picker: ElementRef;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(c) {
        if ('options' in c && Object.keys(c).length === 1)
            return;

        this.options = {
            showTodayButton: true,
            showClear: this.showClear,

             // https://github.com/Eonasdan/bootstrap-datetimepicker/issues/1220#issuecomment-126805404
             debug: this.inline,
             inline: this.inline,
             keepOpen: this.inline,
        };
        if (this.minDate)
            this.options.minDate = this.minDate;
        if (this.maxDate)
            this.options.maxDate = this.maxDate;
    }

    onDateChange($event) {
        const m = moment($event);
        if (this.valueInternal && !moment(this.valueInternal).diff(m, 'ms'))
            return;
        const oldVal = this._value;
        if (m.isValid()) {
            this.valueInternal = moment($event).toDate();
            this._value = this.type === 'moment' ? m : m.toDate();
        } else {
            this._value = null;
            this.valueInternal = null;
        }
        if (this._value !== oldVal)
            this.valueChange.emit(this._value);
        if (this.picker)
            this.picker.nativeElement.blur();
    }


    get value(): moment.Moment | string | Date {
        return this._value;
    }


    @Input()
    set value(dt) {
        this._value = dt;
        const m = moment(dt);
        this.valueInternal = m.isValid() ? m.toDate() : null;
    }
}
