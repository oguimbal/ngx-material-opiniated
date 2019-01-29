import {OnChanges, Component, Input, OnInit} from '@angular/core';
import {prettyCurrency, prettyNumber, IMoney} from '@oguimbal/utilities';


//// can add attribute "bold" on it (see css)
@Component({
    template: `<span>{{val}}</span><span class="dec text-light">{{dec}}</span> {{cur}}`,
    selector: 'money',
    styles: [':host { white-space:nowrap; } .dec { font-size: 0.85em; padding-left: 0.2em;}'],
})
export class MoneyComponent implements OnChanges, OnInit {

    @Input()
    value: number | IMoney;

    @Input()
    currency = 'EUR';

    val: any;
    dec: any;
    cur: any;

    ngOnInit() {
        this.ngOnChanges();
    }

    ngOnChanges(): void {
        // recompute currency
        let cur = this.currency;
        if (typeof this.value === 'object')
            cur = (<IMoney>this.value).cur;
        this.cur = prettyCurrency(cur);

        // recompute value
        let val: any = this.value;
        if (typeof val === 'object')
            val = (<IMoney>val).amt;
        const rnd = Math.floor(parseFloat(val));
        this.dec = (val - rnd).toFixed(2).substring(1);
        this.val = prettyNumber(rnd, 0);
    }
}
