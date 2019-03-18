import { NgModule, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { OpiniatedCommonModule } from '../common/index';
import { CommonModule } from '@angular/common';
import { CountryService } from './country.service';
import { PhoneNumberComponent } from './phone';
import { CountryPipe } from './country.pipe';

const Components = [
    PhoneNumberComponent
];

@NgModule({
  declarations: [
      ...Components
      ,  CountryPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    OpiniatedCommonModule.forChild()
  ],
  providers: [CountryService],
  exports: [
      ...Components
      ,  CountryPipe
    ],
  entryComponents: [...Components]
})
export class OpiniatedPhoneModule {
}
