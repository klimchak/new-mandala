import {app, BrowserWindow, dialog, screen, WebContents} from 'electron';
import * as url from 'url';
import {Knex, knex} from "knex";
import {NsisUpdater} from 'electron-updater';
import {GithubOptions} from "builder-util-runtime/out/publishOptions";
import {appendFileSync, copySync, remove} from 'fs-extra'
import {UpdateInfo} from "builder-util-runtime";
import {UpdateDownloadedEvent} from "electron-updater/out/main";
import MessageBoxOptions = Electron.MessageBoxOptions;
import Size = Electron.Size;


export abstract class BaseWindow {
  public window: BrowserWindow;
  public knexAdapter: KnexAdapter;
  public webContext: WebContents;

  public get isDevMode(): boolean {
    return !!process.env?.APP_DEV;
  }

  public pathIndexFile;
  protected displaySize: Size = screen.getPrimaryDisplay().workAreaSize;

  constructor(knexAdapter: KnexAdapter) {
    this.knexAdapter = knexAdapter;
  }

  public createMainWindow(): void {
  }

  protected loadingUrl(): void {
    this.window.loadURL(url.format({pathname: this.pathIndexFile, protocol: 'file:', slashes: true}));
  }
}

export class MainWindow extends BaseWindow {
  public args: string[];
  public serve: boolean;
  public pathIndexFile = this.isDevMode ? `${app.getAppPath()}/dist/index.html` : `${app.getAppPath()}/index.html`;

  constructor(knexAdapter: KnexAdapter) {
    super(knexAdapter);
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    // console.log('process.env', process.env)
    this.setArgsAndServe();
  }

  public createMainWindow(): void {
    this.window = new BrowserWindow({
      x: 0, y: 0,
      width: this.displaySize.width, height: this.displaySize.height,
      frame: true, autoHideMenuBar: true,
      title: `MandalaApp v${app.getVersion()}`,
      show: true,
      webPreferences: {nodeIntegration: true, allowRunningInsecureContent: (this.serve), contextIsolation: false, devTools: this.isDevMode},
    });
    this.webContext = this.window.webContents;

    if (this.serve) {
      const debug = require('electron-debug');
      debug();
      require('electron-reloader')(module);
      this.window.loadURL('http://localhost:4200');
      this.webContext.on('did-fail-load', () => this.window.loadURL('http://localhost:4200'));
    } else {
      this.loadingUrl();
      this.webContext.on('did-fail-load', () => this.loadingUrl());
    }

    this.window.on('closed', () => this.window = null);
  }

  private setArgsAndServe(): void {
    this.args = process.argv.slice(1);
    this.serve = this.args.some(val => val === '--serve');
  }
}

export class PreloaderWindow extends BaseWindow {
  public pathIndexFile = this.isDevMode ? `${app.getAppPath()}/dist/assets/preload/preload.html` : `${app.getAppPath()}/assets/preload/preload.html`;

  constructor(knexAdapter: KnexAdapter) {
    super(knexAdapter);
  }

  public createLoaderWindow(callback: () => void): void {
    this.window = new BrowserWindow({width: 600, height: 400, frame: this.isDevMode, autoHideMenuBar: true, opacity: 0.9, webPreferences: {devTools: this.isDevMode}});
    this.webContext = this.window.webContents;
    this.loadingUrl();
    this.webContext.on('did-fail-load', () => this.loadingUrl());
    this.window.on('closed', () => {
      callback();
      // this.window = null;
    });
  }
}

export interface SessionLog {
  id: number;
  sessionStart: string;
  sessionStop: string;
  firstAfterUpdate: boolean;
}


export class KnexAdapter {
  public knexAdapter: Knex;
  public dataTableReqPath: string = process.env['APPDATA'] + '\\dbreq.db';
  public dataTablePath = this.isDevMode ? `${app.getAppPath()}/src/assets/database/db.db` : `${app.getAppPath()}\\assets\\database\\db.db`;
  public get isConnected(): boolean{
    return typeof this.knexAdapter !== 'undefined';
  }
  private session: SessionLog = {
    id: Date.now(),
    sessionStart: new Date().toISOString(),
    sessionStop: null,
    firstAfterUpdate: false
  };

  public get isDevMode(): boolean {
    return !!process.env?.APP_DEV;
  }

  public addKnexConnection(): void {
    this.knexAdapter = knex({
      client: 'sqlite3',
      connection: {
        // filename: path.join(__dirname, dataTablePath),
        filename: this.dataTablePath,
      },
      useNullAsDefault: true
    });
    console.log('@@@@@@@@@@@@@@@@@    new knex adapter       @@@@@@@@@@@@@@@@@@@@@@@@@')
  }

  public closeKnexConnection(): Promise<void> {
    return this.knexAdapter.destroy();
  }

  public readServiceInfo(callback?: (items) => void): void {
    this.knexAdapter('serviceInfo').select('id', 'sessionStart', 'sessionStop', 'firstAfterUpdate').then((items) => {
      callback(items);
    }).catch((e) => {
      this.addLogFileRecord('knexAdapter ERROR:  ' + e);
    });
  }

  public addSessionRecord(callback?: () => void): void {
    this.knexAdapter('serviceInfo').insert([this.session]).then(() => {
      this.addLogFileRecord(JSON.stringify(this.session));
      if (typeof callback !== 'undefined'){
        callback();
      }
    }).catch((e) => {
      this.addLogFileRecord('knexAdapter ERROR:  ' + e);
    });
  }

  public updateSessionRecord(callback?: () => void): void {
    this.knexAdapter('serviceInfo').where('id', this.session.id).update({
      sessionStop: new Date().toISOString(),
      firstAfterUpdate: false
    })
      .then((value) => {
        this.addLogFileRecord(JSON.stringify(this.session));
        if (typeof callback !== 'undefined'){
          callback();
        }
      })
  }

  public addLogFileRecord(value: string): void {
    appendFileSync('mylog.txt', `${value} \n`);
  }

  public backupOrRestoreDBFile(backup: boolean): void {
    if (backup) {
      copySync(this.dataTablePath, this.dataTableReqPath, {overwrite: true});
    } else {
      remove(this.dataTablePath, (e) => {
        console.log('!@!@!@!@@ ', e)
        copySync(this.dataTableReqPath, this.dataTablePath, {overwrite: true});
      });
    }
  }
}

export class AppUpdater {
  private options = {
    provider: "github",
    repo: 'new-mandala',
    owner: 'klimchak',
    vPrefixedTagName: false,
    host: 'api.github.com',
    protocol: "https",
    token: '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',
    private: true,
    channel: 'latest',
    releaseType: "release",
  } as GithubOptions;

  public noListeners = false;
  public appUpdater: NsisUpdater;

  public knexAdapter: KnexAdapter;

  constructor(knexAdapter: KnexAdapter) {
    this.knexAdapter = knexAdapter;
    this.appUpdater = new NsisUpdater(this.options);
  }

  public startCheckingUpdate(window: BrowserWindow, UpdateNotAvailableCallback: () => void, UpdateDownloadedCallback: () => void): void {
    this.updaterError(window, () => UpdateNotAvailableCallback());
    // this.updaterCheckingForUpdate();
    // this.updaterUpdateAvailable();
    this.updaterUpdateNotAvailable(() => UpdateNotAvailableCallback());
    this.updaterUpdateDownloaded(window, () => UpdateDownloadedCallback());
    this.appUpdater.checkForUpdatesAndNotify({body: 'Идет получение необходимых файлов.', title: 'Обновление найдено'});
  }

  public updaterError(window: BrowserWindow, callback: () => void): void {
    this.appUpdater.on(
      UpdaterEventsType.error,
      (e, message) => {
        this.knexAdapter.addLogFileRecord('start update error: ' + JSON.stringify(message));
        this.showDialog(
          window,
          'error',
          'Странно.... Зови фиксика!',
          'Ошибка: нет доступа к репозиторию. Лог сохранен в файл',
          () => {
            callback();
          }
        );
      });
  }

  public updaterCheckingForUpdate(): void {
    this.appUpdater.on(UpdaterEventsType.checking_for_update, () => this.knexAdapter.addLogFileRecord('start checking_for_update'));
  }

  public updaterUpdateNotAvailable(callback: () => void): void {
    this.appUpdater.on(
      UpdaterEventsType.update_not_available,
      (info: UpdateInfo) => {
        this.knexAdapter.addLogFileRecord('start update_not_available: ' + JSON.stringify(info));
        callback();
      }
    );
  }

  public updaterUpdateAvailable(): void {
    this.appUpdater.on(
      UpdaterEventsType.update_available,
      (info: UpdateInfo) => this.knexAdapter.addLogFileRecord('start update_available: ' + JSON.stringify(info))
    );
  }

  public updaterUpdateDownloaded(window: BrowserWindow, callback: () => void): void {
    this.appUpdater.on(
      UpdaterEventsType.update_downloaded,
      (event: UpdateDownloadedEvent) => {
        this.knexAdapter.addLogFileRecord('start-update update-downloaded: ' + event);
        // this.showDialog(
        //   window,
        //   'question',
        //   'Обновление программы',
        //   'Новая версия доступна для установки. Программа обновится автоматически после закрытия.',
        //   () => {
        callback();
        // }
        // );
      });
  }

  public showDialog(window: BrowserWindow, type: 'warning' | 'question' | 'error' | 'info', title: string, detail: string, callback?: () => void): void {
    const dialogOpts = {type, title, detail} as MessageBoxOptions;
    dialog.showMessageBox(window, dialogOpts).then((value) => callback());
  }

  public removeListeners(): void {
    this.appUpdater.removeAllListeners();
    this.noListeners = true;
  }
}

export enum UpdaterEventsType {
  error = 'error',
  checking_for_update = 'checking-for-update',
  update_not_available = 'update-not-available',
  update_available = 'update-available',
  update_downloaded = 'update-downloaded',
  download_progress = 'download-progress',
  update_cancelled = 'update-cancelled',
  appimage_filename_updated = 'appimage-filename-updated'
}
