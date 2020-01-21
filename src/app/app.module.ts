import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OpiniatedTypeaheadModule, OpiniatedPhoneModule, OpiniatedNotificationModule, OpiniatedDisplayModule, OpiniatedInputsModule , OpiniatedGridModule, INotificationService, OpiniatedCommonModule } from 'projects/ngx-material-opiniated/src/public_api';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from 'ngx-contextmenu';
import { validatePhone } from './validate-phone';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    OpiniatedTypeaheadModule,
    OpiniatedDisplayModule,
    OpiniatedInputsModule,
    OpiniatedGridModule,
    OpiniatedPhoneModule.forRoot({
      validator: validatePhone
    }),
    OpiniatedCommonModule.forRoot(),
    OpiniatedNotificationModule.forRoot(),
    HttpClientModule,
    MatCardModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
