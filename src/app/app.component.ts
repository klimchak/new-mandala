import {Component, OnInit} from '@angular/core';
import {ElectronService as CustomElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationDialogComponent} from './modules/shared/modals/confirmation-dialog/confirmation-dialog.component';
import {ConfirmPopupAnswerModel, ConfirmPopupEntriesModel} from './modules/shared/models/confirm-popup.model';
import {ALL_WORDS} from './modules/shared/constants';
import {oldDataTablePath} from './constants';
import {fullUpdateAnswer, SessionModel} from './modules/shared/models/session.model';
import {isEmpty} from 'lodash';
import {PrimeNGConfig} from 'primeng/api';
import {ApplicationOptionModel} from './modules/shared/models/application-option.model';
import {MandalaModel} from './modules/shared/models/mandala.model';
import {CoreService} from './modules/shared/services/core/core.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'new-mandala';
  public strings = ALL_WORDS;

  constructor(
    private electronService: CustomElectronService<MandalaModel>,
    private coreService: CoreService,
    private translateService: TranslateService,
    private config: PrimeNGConfig,
    private dialogService: DialogService
  ) {
    this.translateService.setDefaultLang('ru');
    // console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      // console.log(process.env);
      // console.log('Run in electron');
      // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      // console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      // console.log('Run in browser');
    }
  }

  public translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  public ngOnInit(): void {
    this.translateService.setDefaultLang('ru');
    this.translate('ru');
    this.electronService.getDataFromDatabase<ApplicationOptionModel>(
      'applicationOptions',
      'id', 'noRemandDelete', 'noRemandEdit', 'noRemandUpdate')
      .then((item) => {
        this.coreService.applicationOption = {
          noRemandDelete: Boolean(item[item.length - 1].noRemandDelete),
          noRemandUpdate: Boolean(item[item.length - 1].noRemandUpdate),
          noRemandEdit: Boolean(item[item.length - 1].noRemandEdit),
        };
      });
    // try {
    //   this.electronService.getDataFromDatabase('serviceInfo', 'noRemandAgain').then((dbAnswer) => {
    //     console.log(dbAnswer);
    //
    //     this.electronService.fs.exists(oldDataTablePath, (exists) => {
    //       if (exists && (typeof dbAnswer === 'undefined' || dbAnswer?.noRemandAgain)) {
    //         this.openConfirmationDialog();
    //       } else {
    //         this.logSession();
    //       }
    //     });
    //     //
    //     // this.electronService.hasTableExist('mandala').then((val) => {
    //     //   console.log('hasTableExist', val);
    //     // });
    //   }).catch((e) => {
    //     console.log(e);
    //     this.logSession();
    //   });
    // } catch (e) {
    //   console.log(e);
    //   this.logSession();
    // }


    // this.logSession();
  }

  // private openConfirmationDialog(): void {
  //   this.dialogService.open(ConfirmationDialogComponent, {
  //     data: {
  //       headerText: this.strings.COMPONENTS.appComponent.confirm_dialog_text,
  //       acceptText: true,
  //       noRemandAgain: true,
  //       removeLatestVersion: true
  //     } as ConfirmPopupEntriesModel,
  //     closable: false,
  //     closeOnEscape: false
  //   }).onClose.subscribe((value: ConfirmPopupAnswerModel) => {
  //     console.log(value);
  //     if (value.answer) {
  //
  //     }
  //     if (value.removeLatestVersion) {
  //       this.electronService.removeFile(oldDataTablePath);
  //     }
  //     this.logSession(value.noRemandAgain);
  //   });
  // }

  // private logSession(noRemandAgain = false): void {
  //   const sessionStart = new Date();
  //   const recordId = Date.now();
  //   this.electronService.insertRecordsInDatabase<SessionModel>(
  //     'serviceInfo',
  //     [{id: recordId, sessionStart: sessionStart.toISOString()}],
  //     fullUpdateAnswer)
  //     .then((dbAnswer) => {
  //       if (!isEmpty(dbAnswer)){
  //         this.electronService.session.sessionStart = sessionStart.toISOString();
  //         this.electronService.session.id = recordId;
  //         this.electronService.ipcRenderer.sendToHost('createSession', JSON.stringify(this.electronService.session));
  //         this.electronService.ipcRenderer.emit('createSession', JSON.stringify(this.electronService.session));
  //         this.electronService.ipcRenderer.postMessage('createSession', JSON.stringify(this.electronService.session));
  //       }
  //       console.log('!!',dbAnswer);
  //     });
  // }

}
