import {app, ipcMain} from 'electron';
import {AppUpdater, KnexAdapter, MainWindow, PreloaderWindow} from "./electron-app.model";
import {isEmpty, sortBy} from "lodash";
import {copySync, remove} from "fs-extra";


let knexAdapter: KnexAdapter;
let mainWindow: MainWindow;
let preloaderWindow: PreloaderWindow;
let appUpdater: AppUpdater;


function startProgram(): void {
  setTimeout(() => {
    knexAdapter = new KnexAdapter();
    if (knexAdapter.isDevMode) {
      preloaderWindow = new PreloaderWindow(knexAdapter);
      knexAdapter.addKnexConnection();
      knexAdapter.addSessionRecord();
      mainWindow = new MainWindow(knexAdapter);
      setTimeout(() => mainWindow.createMainWindow(), 1000);
    } else {
      knexAdapter.addKnexConnection();
      try {
        knexAdapter.readServiceInfo((items) => {
          if (!isEmpty(items)) {
            items = sortBy(items, (item) => {
              return item.id
            });
            if (!items[items.length - 1].firstAfterUpdate) {
              knexAdapter.backupOrRestoreDBFile(true);
              knexAdapter.addKnexConnection();
              preloaderWindow = new PreloaderWindow(knexAdapter);
              mainWindow = new MainWindow(knexAdapter);
              appUpdater = new AppUpdater(knexAdapter);
              preloaderWindow.createLoaderWindow(() => startMainWindowActions());
              setTimeout(() => {
                appUpdater.startCheckingUpdate(
                  preloaderWindow.window,
                  () => startMainWindowActions(),
                  () => {
                    appUpdater.appUpdater.quitAndInstall();
                  }
                );
              }, 1000);
            } else {
              if (knexAdapter.isConnected){
                knexAdapter.knexAdapter.destroy();
                knexAdapter.backupOrRestoreDBFile(false);
                remove(knexAdapter.dataTablePath, (e) => {
                  copySync(knexAdapter.dataTableReqPath, knexAdapter.dataTablePath, {overwrite: true});
                  knexAdapter.addKnexConnection();
                  preloaderWindow = new PreloaderWindow(knexAdapter);
                  mainWindow = new MainWindow(knexAdapter);
                  appUpdater = new AppUpdater(knexAdapter);
                  preloaderWindow.createLoaderWindow(() => startMainWindowActions());
                  setTimeout(() => {
                    appUpdater.startCheckingUpdate(
                      preloaderWindow.window,
                      () => startMainWindowActions(),
                      () => {
                        appUpdater.appUpdater.quitAndInstall();
                      }
                    );
                  }, 1000);
                });
              }else {
                remove(knexAdapter.dataTablePath, (e) => {
                  copySync(knexAdapter.dataTableReqPath, knexAdapter.dataTablePath, {overwrite: true});
                  knexAdapter.addKnexConnection();
                  preloaderWindow = new PreloaderWindow(knexAdapter);
                  mainWindow = new MainWindow(knexAdapter);
                  appUpdater = new AppUpdater(knexAdapter);
                  preloaderWindow.createLoaderWindow(() => startMainWindowActions());
                  setTimeout(() => {
                    appUpdater.startCheckingUpdate(
                      preloaderWindow.window,
                      () => startMainWindowActions(),
                      () => {
                        appUpdater.appUpdater.quitAndInstall();
                      }
                    );
                  }, 1000);
                });
              }
            }
          }
        });
      } catch (e: any) {
      }
    }
  }, 500);
}

function startMainWindowActions(): void {
  if (!appUpdater.noListeners){
    appUpdater.removeListeners();
    if (typeof preloaderWindow.window !== 'undefined') {
      preloaderWindow.window.close();
    }
    knexAdapter.addKnexConnection();
    knexAdapter.addSessionRecord();
    setTimeout(() => mainWindow.createMainWindow(), 1000);
  }
}

try {
  app.on('ready', () => {
    startProgram();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
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

} catch (e) {
  // Catch Error
  // throw e;
}
