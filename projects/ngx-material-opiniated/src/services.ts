
export abstract class INotificationService {
  abstract default(message: string);
  abstract error(error: string);
  abstract warn(messag: string);
  abstract success(message: string);
  abstract info(message: string);

  abstract alert(text: string, title?: string): Promise<any>;
  abstract saveOrDiscard(text: string, title?: string): Promise<'save' | 'discard' | 'cancel'>;
  abstract prompt(text: string, title?: string, initialText?: string, selectedText?: string): Promise<string>;
  abstract confirmWithText(text: string, title?: string, confirmText?: string): Promise<string>;

  abstract confirm(message: string, title?: string): Promise<boolean>;
  abstract confirm(opts: ConfirmOpts): Promise<boolean>;
  abstract yesNo(text: string, title?: string): Promise<boolean>;
  // abstract choices<T extends { [id: string]: string }>(opts: {
  //   text: string;
  //   title?: string;
  //   choices: T
  // }): Promise<keyof T | null>;
}


export interface ConfirmOpts {
  message: string;
  title?: string;
  yesText?: string;
  noText?: string;
}