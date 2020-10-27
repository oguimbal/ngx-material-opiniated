import { EventEmitter, NgZone, Injectable } from '@angular/core';
import { ConfirmOpts, INotificationService } from '../services';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface IAlertDialogData {
    text: string;
    title?: string;
    done: (success: any) => void; type: string;
    input?: string;
    confirmText?: string;
    yesText?: string;
    noText?: string;
}

@Injectable()
export class NotificationService extends INotificationService {

    onDialog = new EventEmitter<IAlertDialogData>();

    constructor(
        private readonly snackBar: MatSnackBar,
        private readonly zone: NgZone
    ) {
        super();
    }

    default(message: string) {
        this.show(message, {
            duration: 2000,
            panelClass: 'default-notification-overlay'
        });
    }

    info(message: string) {
        this.show(message, {
            duration: 2000,
            panelClass: 'info-notification-overlay'
        });
    }

    success(message: string) {
        this.show(message, {
            duration: 2000,
            panelClass: 'success-notification-overlay'
        });
    }

    warn(message: string) {
        this.show(message, {
            duration: 2500,
            panelClass: 'warning-notification-overlay'
        });
    }

    error(message: string) {
        this.show(message, {
            duration: 3000,
            panelClass: 'error-notification-overlay'
        });
    }

    private show(message: string, configuration: MatSnackBarConfig) {
        // Need to open snackBar from Angular zone to prevent issues with its position per
        // https://stackoverflow.com/questions/50101912/snackbar-position-wrong-when-use-errorhandler-in-angular-5-and-material
        this.zone.run(() => this.snackBar.open(message, null, configuration));
    }

    alert(text: string, title?: string): Promise<any> {
        return new Promise(done => this.onDialog.emit({
            text,
            title,
            done,
            type: 'Alert'
        }));
    }

    saveOrDiscard(text: string, title?: string): Promise<'save' | 'discard' | 'cancel'> {
        return new Promise<any>(done => this.onDialog.emit({
            text,
            title,
            done,
            type: 'SaveOrDiscard'
        }));
    }
    prompt(text: string, title?: string, initialText?: string, selectedText?: string): Promise<string> {
        return new Promise<string>(done => this.onDialog.emit({
            text,
            title,
            done,
            type: 'Prompt',
            input: initialText,
            confirmText: selectedText
        }));
    }
    confirmWithText(text: string, title?: string, confirmText?: string) {
        return new Promise<string>(done => this.onDialog.emit({
            text,
            title,
            done,
            type: 'ConfirmText',
            confirmText: confirmText || 'yes, i am sure',
        }));
    }

    confirm(text: string | ConfirmOpts, title?: string): Promise<boolean> {
        const opts: ConfirmOpts = typeof text === 'string' ? { message: text, title } : { ...text };
        opts.noText = opts.noText ?? $localize`Cancel`;
        opts.yesText = opts.yesText ?? $localize`Confirm`;
        return new Promise<boolean>(done => this.onDialog.emit({
            text: opts.message,
            title: opts.title,
            done,
            type: 'Confirm',
            yesText: opts.yesText,
            noText: opts.noText,
        }));
    }
    yesNo(message: string, title?: string): Promise<boolean> {
        return this.confirm({
            message,
            title,
            yesText: $localize`Yes`,
            noText: $localize`No`,
        })
    }
}
