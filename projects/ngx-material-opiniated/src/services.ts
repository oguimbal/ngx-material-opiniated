import { Observable } from 'rxjs';


export class INotificationService {
  error(error: any) {
    console.error(error);
  }
  confirm(message?: string): Promise<boolean> {
    return Promise.resolve(confirm(message));
  }

  success(message: string) {
    alert(message);
  }

  info(message: string) {
    alert(message);
  }
}
