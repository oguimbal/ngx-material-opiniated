import { Component, OnInit, ChangeDetectionStrategy, Inject, HostBinding, HostListener } from '@angular/core';
import { IAlertDialogData } from './notification-service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'alert-dialogs',
  templateUrl: './alert-dialogs.html',
  styleUrls: ['./alert-dialogs.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertDialogsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IAlertDialogData, private dialogRef: MatDialogRef<AlertDialogsComponent>) {
  }

  ngOnInit() {
  }

  get canOk() {
    if (this.data.type === 'ConfirmText') {
        return this.data.input === this.data.confirmText;
    }
    return true;
}

async done(success: boolean) {
    if (success && !this.canOk)
        return;
    let ret: any = success;
    if (this.data.type === 'Prompt')
        ret = success ? this.data.input : undefined;
    if (this.data.type === 'SaveOrDiscard'){
        if (success === null)
            ret = 'cancel';
        else
            ret = ret ? 'save' : 'discard';
    }
    this.data.done(ret);
    this.dialogRef.close();
}

@HostListener('document:keyup', ['$event'])
onDocumentKeyup($event) {
    if (!this.data)
        return;
    if ($event.keyCode === 13) { // enter
        this.done(true);
    }
    if ($event.keyCode === 27) { // escape
        this.done(null);
    }
}

}
