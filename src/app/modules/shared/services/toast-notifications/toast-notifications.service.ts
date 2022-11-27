import {Injectable} from '@angular/core';
import {get} from 'lodash';
import {MessageService} from 'primeng/api';
import {ToastNotificationsModel} from "../../models/toast-notifications.model";
import ToastVariant = ToastNotificationsModel.ToastVariant;
import ToastOptions = ToastNotificationsModel.ToastOptions;
import ToastVariantString = ToastNotificationsModel.ToastVariantString;
import {ElectronService} from "../../../../core/services";
import {logsPath} from "../../../../constants";
import {ALL_WORDS} from "../../constants";

@Injectable({providedIn: 'root'})
export class ToastNotificationsService {
  private readonly otherString = ALL_WORDS.otherStrings;
  constructor(
    private messageService: MessageService,
    private electronService: ElectronService<any>
    ) {
  }

  public showNotification(toastVariant: ToastVariant, toastOptions: ToastOptions): void {
    this.messageService.add({
      severity: ToastVariantString[toastVariant],
      summary: toastOptions?.summary ?? this.getDefaultSummary(toastVariant),
      detail: toastOptions?.message
    });
    this.electronService.addRowMessageLogInFile(logsPath, {
      severity: ToastVariantString[toastVariant],
      summary: toastOptions?.summary ?? this.getDefaultSummary(toastVariant),
      detail: toastOptions?.message
    });
  }

  private getDefaultSummary(toastVariant: ToastVariant): string {
    switch (toastVariant) {
      case ToastVariant.SUCCESS: return this.otherString.off;
      case ToastVariant.INFO: return this.otherString.info;
      case ToastVariant.WARN: return this.otherString.warning;
      case ToastVariant.ERROR: return this.otherString.error;
    }
  }
}
