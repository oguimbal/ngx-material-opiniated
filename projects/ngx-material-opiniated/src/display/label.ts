import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'text-label',
    template: '{{value}}',
    styles: ['white-space:nowrap;'],
})
export class LabelComponent implements OnInit {

    @Input()
    value: string;

    constructor() { }

    ngOnInit() { }
}
