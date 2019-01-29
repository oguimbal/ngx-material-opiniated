import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderDirective } from './loader';
import { LoaderLoadingViewComponent } from './loader.loadingview';
import { LoaderErrorViewComponent } from './loader.errorview';
import { MatTooltipModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OpiniatedCommonModule } from '../common';

const EntryComponents = [
    LoaderLoadingViewComponent,
    LoaderErrorViewComponent,
];


@NgModule({
  declarations: [
    LoaderDirective,
      ...EntryComponents
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    FontAwesomeModule,
    OpiniatedCommonModule.forChild()
  ],
  exports: [LoaderDirective],
  entryComponents: [...EntryComponents]
})
export class OpiniatedLoaderModule {
}
