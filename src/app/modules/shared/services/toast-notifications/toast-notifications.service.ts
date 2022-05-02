import {Injectable} from '@angular/core';
import {get} from 'lodash';
import {MessageService} from 'primeng/api';

@Injectable({providedIn: 'root'})
export class ToastNotificationsService {
  constructor(private messageService: MessageService) {
  }

  public showNotification(type: string, message?: {message: string}): void {
    let text = get(message, 'message', 'Error occurred') as string;
    switch (type) {
      case 'success': {
        text = get(message, 'message') as string;
        this.messageService.add({severity: 'success', summary: 'Success', detail: text});
        break;
      }
      case 'info': {
        text = get(message, 'message') as string;
        this.messageService.add({severity: 'info', summary: 'Information', detail: text});
        break;
      }
      case 'warning': {
        this.messageService.add({severity: 'warn', summary: 'Warning', detail: text});
        break;
      }
      case 'error': {
        this.messageService.add({severity: 'error', summary: 'Error', detail: text});
        break;
      }
    }
  }
}
