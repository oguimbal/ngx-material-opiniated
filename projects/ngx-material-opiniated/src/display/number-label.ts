import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { prettyNumber, IMoney } from '@oguimbal/utilities';

@Component({
    selector: 'number-label',
    template: `<span>{{val}}</span><span class="dec">{{dec}}</span>`,
    styles: ['white-space:nowrap; .dec { font-size: smaller; padding-left:4px;}'],
})
export class NumberLabelComponent implements OnInit, OnChanges {

    @Input()
    value: number;
    @Input()
    round = 2;
    val;
    dec;

    constructor() { }

    ngOnInit() {
        this.ngOnChanges();
     }


    ngOnChanges(): void {
        // recompute currency
        // recompute value
        let val: any = this.value;
        if (val && typeof val === 'object') {
                val = (<IMoney>val).amt;
        }
        if (typeof val === 'string')
            val = parseFloat(val);
        if (typeof val === 'number') {
            const rnd = Math.floor(val);
            this.dec = (val - rnd).toFixed(this.round).substring(1);
            this.val = prettyNumber(rnd, 0);
        } else {
            this.val = '-';
            this.dec = '';
        }
    }
}
