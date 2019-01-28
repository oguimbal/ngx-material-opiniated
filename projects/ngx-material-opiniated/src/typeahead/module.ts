import { NgModule } from '@angular/core';
import { OpiniatedTypeaheadComponent } from './typeahead';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { TemplateInjectorComponent } from './template-injector';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [OpiniatedTypeaheadComponent, TemplateInjectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FontAwesomeModule
  ],
  exports: [OpiniatedTypeaheadComponent]
})
export class OpiniatedTypeaheadModule {
}
