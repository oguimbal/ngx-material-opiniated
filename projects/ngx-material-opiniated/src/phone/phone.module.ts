import { NgModule, Component, ModuleWithProviders, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OpiniatedCommonModule } from '../common/index';
import { CommonModule } from '@angular/common';
import { CountryService } from './country.service';
import { PhoneNumberComponent, PHONE_VALIDATOR, PhoneValidator } from './phone';
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

  public static forRoot(options: {validator: PhoneValidator}): ModuleWithProviders {
    return {
        ngModule: OpiniatedPhoneModule,
        providers: [
            {
                provide: PHONE_VALIDATOR,
                useValue: options.validator,
            },
        ]
    };
}
}
