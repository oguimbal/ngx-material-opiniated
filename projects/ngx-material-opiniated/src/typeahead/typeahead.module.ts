import { NgModule } from '@angular/core';
import { OpiniatedTypeaheadComponent } from './typeahead';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OpiniatedDisplayModule } from '../display';
import { OpiniatedCommonModule } from '../common';



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
    OpiniatedDisplayModule,
    MatTooltipModule,
    OpiniatedCommonModule.forChild()
  ],
  exports: [OpiniatedTypeaheadComponent]
})
export class OpiniatedTypeaheadModule {
}
