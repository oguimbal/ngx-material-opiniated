import { NgModule, ModuleWithProviders } from '@angular/core';
import { AlertDialogsComponent } from './alert-dialogs';
import { OpiniatedCommonModule } from '../common/index';
import { INotificationService } from '../services';
import { NotificationService } from './notification-service';
import { MatDialog, MatDialogModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpiniatedInputsModule } from '../inputs/index';

@NgModule({
    declarations: [
        AlertDialogsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        OpiniatedInputsModule,
        OpiniatedCommonModule,
        MatSnackBarModule,
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        AlertDialogsComponent
    ],
    exports: [
        MatSnackBarModule,
    ]
})
export class OpiniatedNotificationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: OpiniatedNotificationModule,
            providers: [
                {
                    provide: INotificationService,
                    useClass: NotificationService
                }
            ]
        };
    }
    constructor(
        alert: INotificationService,
        mat: MatDialog) {
        (<NotificationService>alert).onDialog.subscribe(data => {
            mat.open(AlertDialogsComponent, {data});
        });
    }
}
