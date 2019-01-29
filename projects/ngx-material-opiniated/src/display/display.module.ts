import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label';
import { MoneyComponent } from './money';
import { NumberLabelComponent } from './number-label';
import { TemplateInjectorComponent } from './template-injector';
import { OpiniatedCommonModule } from '../common';

const Components = [
    LabelComponent,
    MoneyComponent,
    NumberLabelComponent,
    TemplateInjectorComponent
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
