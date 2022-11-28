import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ALL_WORDS} from "../../../shared/constants";
import {logsPath} from "../../../../constants";
import {ConfirmationService} from "primeng/api";
import {cloneDeep, get, isObject, isString, uniqBy} from "lodash";
import {CoreService} from "../../../shared/services/core/core.service";
import {ApplicationOptionModel} from "../../../shared/models/application-option.model";
import {ToastNotificationsService} from "../../../shared/services/toast-notifications/toast-notifications.service";
import {ToastNotificationsModel} from "../../../shared/models/toast-notifications.model";
import ToastVariant = ToastNotificationsModel.ToastVariant;
import {ElectronService} from "../../../shared/services/core/electron.service";

export enum ConfirmVariant {
  clear_log = 1,
  update_log,
  save_setting,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  public readonly otherStrings = ALL_WORDS.otherStrings;
  public readonly messagesStrings = ALL_WORDS.otherStrings.messages;
  public readonly settingsStrings = ALL_WORDS.settings;
  public readonly confirmVariant = ConfirmVariant;
  public readonly toastVariant = ToastVariant;
  public settingForm: FormGroup;
  public baseVariant = [
    {name: this.otherStrings.on, value: true},
    {name: this.otherStrings.off, value: false}
  ];
  public logScrollerData: { logIndex: number; logData: string }[] = [];
  public fakeProgress = 0;

  public get logIsCleared(): boolean {
    return this.logScrollerData.length === 1 && !this.logScrollerData[0].logData;
  }

  private logFile: string;

  constructor(
    private toastNotificationService: ToastNotificationsService,
    private coreService: CoreService,
    private confirmationService: ConfirmationService,
    private electronService: ElectronService<any>
  ) {
  }

  public ngOnInit(): void {
    this.settingForm = new FormGroup({
      id: new FormControl(1),
      openRecent: new FormControl(false),
      autoSaveEditor: new FormControl(false),
      darkMode: new FormControl({value: false, disabled: true}),
      noRemandDelete: new FormControl(false),
      noRemandEdit: new FormControl(false),
      noRemandUpdate: new FormControl(false),
    });
    this.settingForm.patchValue(this.coreService.applicationOption);
    this.readerLogsData();
  }

  public openAppFolder(): void {
    this.electronService.openAppFolder();
  }

  public confirm(event: Event, confirmVariant: ConfirmVariant) {
    let message = '';
    switch (confirmVariant) {
      case ConfirmVariant.clear_log: {
        message = this.settingsStrings.appSureClearLogs;
        break;
      }
      case ConfirmVariant.update_log: {
        message = this.settingsStrings.appSureReloadLogs;
        break;
      }
      case ConfirmVariant.save_setting: {
        message = this.settingsStrings.appSureSaveSetting;
        break;
      }
    }
    this.confirmationService.confirm({
      target: event.target,
      message,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        switch (confirmVariant) {
          case ConfirmVariant.clear_log: {
            this.clearLogs();
            break;
          }
          case ConfirmVariant.update_log: {
            this.readerLogsData();
            break;
          }
          case ConfirmVariant.save_setting: {
            this.saveAppSetting();
            break;
          }
        }
      }
    });
  }

  public logIsString(data: any): boolean {
    return isString(data);
  }

  public logIsObject(data: any): boolean {
    return isObject(data);
  }

  public getDataFromObject(obj: any, field: string): any {
    return get(obj, field);
  }

  public setStateClass(logString: string, toastVariant: ToastVariant): boolean {
    switch (toastVariant) {
      case ToastVariant.SUCCESS:
        return logString.toLowerCase().includes('Success'.toLowerCase());
      case ToastVariant.INFO:
        return logString.toLowerCase().includes('Information'.toLowerCase()) || logString.toLowerCase().includes('info');
      case ToastVariant.WARN:
        return logString.toLowerCase().includes('Warning'.toLowerCase()) || logString.toLowerCase().includes('warn') ;
      case ToastVariant.ERROR:
        return logString.toLowerCase().includes('Error'.toLowerCase()) || logString.toLowerCase().includes('err');
    }
  }

  private saveAppSetting(): void {
    const appSetting: ApplicationOptionModel = this.settingForm.getRawValue();
    this.electronService.updateRecordInDatabase<ApplicationOptionModel>('applicationOptions', 1, appSetting)
      .then((value) => {
        this.electronService.getDataFromDatabase<ApplicationOptionModel>(
          'applicationOptions',
          'id', 'noRemandDelete', 'noRemandEdit', 'noRemandUpdate', 'openRecent', 'autoSaveEditor', 'darkMode').then((item) => {
          this.coreService.applicationOption = {
            noRemandDelete: Boolean(item[item.length - 1].noRemandDelete),
            noRemandUpdate: Boolean(item[item.length - 1].noRemandUpdate),
            noRemandEdit: Boolean(item[item.length - 1].noRemandEdit),
            openRecent: Boolean(item[item.length - 1].openRecent),
            autoSaveEditor: Boolean(item[item.length - 1].autoSaveEditor),
            darkMode: Boolean(item[item.length - 1].darkMode),
          };
          this.toastNotificationService.showNotification(ToastVariant.SUCCESS, {message: this.messagesStrings.settingSaveSuccessful});
        });
      })
      .catch((e) => {
        this.toastNotificationService.showNotification(ToastVariant.ERROR, {
          message: this.otherStrings.messages.settingSaveError,
          summary: e
        });
      });
  }

  private clearLogs(): void {
    this.electronService.clearFile(logsPath);
    this.readerLogsData();
    this.toastNotificationService.showNotification(ToastVariant.SUCCESS, {message: this.messagesStrings.cleanLogsSuccessful});
  }

  private readerLogsData(): void {
    this.logScrollerData = [];
    this.fakeProgress = 10;
    setTimeout(() => {
      this.fakeProgress = 50;
      setTimeout(() => {
        this.readeAndAnalyseData();
        this.fakeProgress = 100;
        setTimeout(() => this.fakeProgress = 0, 500);
      }, 500);
    }, 500);
  }

  private readeAndAnalyseData(): void {
    this.logFile = this.electronService.readeFile(logsPath);
    const temporaryData = [];
    let a = null;
    this.logFile.split('\r\n')
      .forEach((logString, index) => {
        try {
          a = JSON.parse(logString);
        } catch (e) {
        }
        temporaryData.push({logIndex: index + 1, logData: a ? cloneDeep(a) : logString})
        a = null;
      });
    this.logScrollerData = uniqBy(temporaryData, 'logData');
  }
}
