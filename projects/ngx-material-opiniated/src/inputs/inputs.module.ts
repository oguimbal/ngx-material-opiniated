import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TextComponent } from './text';
import { DateTimeComponent } from './datetime';
import { CheckComponent } from './check';
import { BtnComponent } from './btn';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { OpiniatedCommonModule } from '../common/index';

const Components = [
    TextComponent,
    DateTimeComponent,
    CheckComponent,
    BtnComponent,
];

@NgModule({
  declarations: [
      ...Components
  ],
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
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    OpiniatedCommonModule.forChild()
  ],
  exports: [...Components],
  entryComponents: [...Components]
})
export class OpiniatedInputsModule {
}
