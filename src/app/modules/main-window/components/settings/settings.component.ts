import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ALL_WORDS} from "../../../shared/constants";
import {ElectronService} from "../../../../core/services";
import {logsPath} from "../../../../constants";
import {ConfirmationService} from "primeng/api";
import {cloneDeep, get, isObject, isString, uniqBy} from "lodash";

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
  public readonly settingsStrings = ALL_WORDS.settings;
  public readonly confirmVariant = ConfirmVariant
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
    private confirmationService: ConfirmationService,
    private electronService: ElectronService<any>
  ) {
  }

  public ngOnInit(): void {
    this.settingForm = new FormGroup({
      openRecent: new FormControl(false),
      autoSaveEditor: new FormControl(false),
      darkMode: new FormControl(false),
    });
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

  public isError(logString: string): any {
    return logString.toLowerCase().includes('error');
  }

  private saveAppSetting(): void {

  }

  private clearLogs(): void {
    this.electronService.clearFile(logsPath);
    this.readerLogsData();
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
