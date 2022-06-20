import {Component, OnInit} from '@angular/core';
import {ElectronService as CustomElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationDialogComponent} from './modules/shared/modals/confirmation-dialog/confirmation-dialog.component';
import {ConfirmPopupAnswerModel, ConfirmPopupEntriesModel} from './modules/shared/models/confirm-popup.model';
import {ALL_WORDS} from './modules/shared/constants';
import {oldDataTablePath} from './constants';
import {DatabaseServiceMadel} from './modules/shared/models/database.madel';
import {fullUpdateAnswer, SessionModel} from './modules/shared/models/session.model';
import {isEmpty} from 'lodash';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'new-mandala';
  public strings = ALL_WORDS;

  constructor(
    private electronService: CustomElectronService<DatabaseServiceMadel>,
    private translate: TranslateService,
    private dialogService: DialogService
  ) {
    this.translate.setDefaultLang('en');
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

  public ngOnInit(): void {
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
