import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ALL_WORDS} from './modules/shared/constants';
import {PrimeNGConfig} from 'primeng/api';
import {ApplicationOptionModel} from './modules/shared/models/application-option.model';
import {MandalaModel} from './modules/shared/models/mandala.model';
import {CoreService} from './modules/shared/services/core/core.service';
import {DialogService} from 'primeng/dynamicdialog';
import {ElectronService} from "./modules/shared/services/core/electron.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'new-mandala';
  public strings = ALL_WORDS;

  constructor(
    private electronService: ElectronService<MandalaModel>,
    private coreService: CoreService,
    private translateService: TranslateService,
    private config: PrimeNGConfig,
    private dialogService: DialogService
  ) {
    this.translateService.setDefaultLang('ru');
    // console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      if (!this.electronService.isKnex){
        this.electronService.createConnection();
      }
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
    if (this.electronService.isElectron) {
      this.electronService.getDataFromDatabase<ApplicationOptionModel>(
        'applicationOptions',
        'id', 'noRemandDelete', 'noRemandEdit', 'noRemandUpdate', 'openRecent', 'autoSaveEditor', 'darkMode')
        .then((item) => {
          this.coreService.applicationOption = {
            noRemandDelete: Boolean(item[item.length - 1].noRemandDelete),
            noRemandUpdate: Boolean(item[item.length - 1].noRemandUpdate),
            noRemandEdit: Boolean(item[item.length - 1].noRemandEdit),
            openRecent: Boolean(item[item.length - 1].openRecent),
            autoSaveEditor: Boolean(item[item.length - 1].autoSaveEditor),
            darkMode: Boolean(item[item.length - 1].darkMode),
          };
        });
    }
  }
}
