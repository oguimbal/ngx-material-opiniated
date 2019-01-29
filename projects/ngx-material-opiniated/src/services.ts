
export abstract class INotificationService {
  abstract default(message: string);
  abstract error(error: any);
  abstract success(message: string);
  abstract info(message: string);

  abstract alert(text: string, title?: string): Promise<any>;
  abstract confirm(message?: string, title?: string): Promise<boolean>;
  abstract saveOrDiscard(text: string, title?: string): Promise<'save' | 'discard' | 'cancel'>;
  abstract prompt(text: string, title?: string, initialText?: string, selectedText?: string): Promise<string>;
  abstract confirmWithText(text: string, title?: string, confirmText?: string);
}
