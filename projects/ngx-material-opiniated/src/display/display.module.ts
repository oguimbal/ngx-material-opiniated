import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label';
import { MoneyComponent } from './money';
import { NumberLabelComponent } from './number-label';
import { OpiniatedCommonModule } from '../common/index';

const Components = [
    LabelComponent,
    MoneyComponent,
    NumberLabelComponent
];


@NgModule({
  declarations: [
      ...Components
  ],
  imports: [
    CommonModule,
    OpiniatedCommonModule.forChild()
  ],
  exports: [...Components],
  entryComponents: [...Components]
})
export class OpiniatedDisplayModule {
}
