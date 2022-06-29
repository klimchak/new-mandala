import {app, ipcMain, ipcRenderer} from 'electron';
import {download} from "electron-dl";
import {AppUpdater, KnexAdapter, MainWindow, PreloaderWindow} from "./electron-app.model";


const dbPath = {
  rootDBPath: `${app.getAppPath()}\\db.db`,
  workDBPath: `${app.getAppPath()}\\resources\\app\\assets\\database\\db.db`
}

let knexAdapter: KnexAdapter;
let mainWindow: MainWindow;
let preloaderWindow: PreloaderWindow;
let appUpdater: AppUpdater;


function startProgram(): void {
  setTimeout(() => {
    knexAdapter = new KnexAdapter();
    mainWindow = new MainWindow(knexAdapter);
    preloaderWindow = new PreloaderWindow(knexAdapter);
    appUpdater = new AppUpdater(knexAdapter);
    if (preloaderWindow.isDevMode) {
      startMainWindow();
    } else {
      preloaderWindow.createLoaderWindow(() => startMainWindowActions());
      setTimeout(() => {
        appUpdater.startCheckingUpdate(
          preloaderWindow.window,
          () => startMainWindowActions(),
          () => ipcRenderer.send('start-update', true)
        );
      }, 1000);
    }
  }, 500);
}

function startMainWindow(): void {
  knexAdapter.addKnexConnection();
  knexAdapter.addSessionRecord();
  setTimeout(() => mainWindow.createMainWindow(), 1000);
}

function startMainWindowActions(): void {
  if (!appUpdater.noListeners){
    appUpdater.removeListeners();
    if (typeof preloaderWindow.window !== 'undefined') {
      preloaderWindow.window.close();
    }
    startMainWindow();
  }
}

try {
  app.on('ready', () => {
    startProgram();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      console.warn('outSession');
      if (typeof mainWindow.window !== 'undefined') {
        knexAdapter.updateSessionRecord();
      }
    }
  });

  app.on('activate', () => {
    if (typeof preloaderWindow.window === 'undefined') {
      startProgram();
    }
  });

  ipcMain.on('quitApp', (e, value) => {
    if (value) {
      mainWindow.window.close();
    }
  });

  ipcMain.on('updaterIsClosed', (e, value) => {
    if (value) {
      startMainWindowActions();
    }
  });

  ipcMain.on('start-update', (e, value) => {
    if (value) {
      console.log('start-update');
      console.log('app version: ', app.getVersion());
      download(mainWindow.window, dbPath.workDBPath, {errorTitle: 'errror'})
        .then((value) => {
          setTimeout(() => appUpdater.appUpdater.quitAndInstall(), 1000);
        });
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
