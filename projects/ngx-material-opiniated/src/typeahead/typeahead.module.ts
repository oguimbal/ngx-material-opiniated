import { NgModule } from '@angular/core';
import { OpiniatedTypeaheadComponent } from './typeahead';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OpiniatedCommonModule } from '../common/index';



@NgModule({
  declarations: [OpiniatedTypeaheadComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FontAwesomeModule,
    MatTooltipModule,
    OpiniatedCommonModule.forChild()
  ],
  exports: [OpiniatedTypeaheadComponent]
})
export class OpiniatedTypeaheadModule {
}
