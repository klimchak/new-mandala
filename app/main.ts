import {app, BrowserWindow, ipcMain, screen, autoUpdater} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import {knex} from "knex";
import SimpleUpdater from "electron-simple-updater"



const updater = SimpleUpdater.init({
  checkUpdateOnStart: true,
  autoDownload: true,
});

const fullUpdateAnswer = ['id', 'sessionStart', 'sessionStop'];

// const dataTablePath = '../src/assets/database/db.db';
// const dataTablePath = '\\assets\\database\\db.db';

const assetsPath = process.env?.APP_DEV ? '/src/assets' : '\\assets';
const dataTablePath = process.env?.APP_DEV ? `${assetsPath}/database/db.db` : `${assetsPath}\\database\\db.db`;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

fs.appendFileSync('mylog.txt', __dirname + '\n');

let win: BrowserWindow = null;
let preloaderWindow: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');


let webContext: any;
const knexAdapter = knex({
  client: 'sqlite3',
  connection: {
    // filename: path.join(__dirname, dataTablePath),
    filename: `${app.getAppPath()}${dataTablePath}`,
  },
  useNullAsDefault: true
});

let session = {
  id: Date.now(),
  sessionStart: new Date().toISOString(),
  sessionStop: null
};

knexAdapter('serviceInfo').insert([{id: session.id, sessionStart: session.sessionStart}], fullUpdateAnswer).then(() => {
  fs.appendFileSync('mylog.txt', JSON.stringify(session) + '\n');
}).catch((e) => {
  fs.appendFileSync('mylog.txt', 'knexAdapter ERROR:  ' + e + '\n');
});

function createWindow(): BrowserWindow {

  // const electronScreen = screen;
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    // opacity: 0.9,
    // modal: true,
    width: size.width,
    height: size.height,
    // frame: false,
    // maximizable: false,
    // minimizable: false,
    title: 'MandalaApp 2.0.0',
    show: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });
  //win.setTitle('sdsdsdsds');
  webContext = win.webContents;

  // // Create the browser window.
  // preloaderWindow = new BrowserWindow({
  //   opacity: 0.9,
  //   width: 600,
  //   height: 400,
  //   frame: false,
  //   show: true,
  //   alwaysOnTop: true,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     allowRunningInsecureContent: (serve),
  //     contextIsolation: false,
  //   },
  // });
  //
  // preloaderWindow.loadURL(url.format({
  //   pathname: `${app.getAppPath()}${assetsPath}\\preload\\preload.html`,
  //   protocol: 'file:',
  //   slashes: true
  // }));
  // preloaderWindow.center();

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
    webContext.on('did-fail-load', () => {
      win.loadURL('http://localhost:4200');
    });
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));

    webContext.on('did-fail-load', () => {
      if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
        // Path when running electron in local folder
        pathIndex = '../dist/index.html';
      }

      win.loadURL(url.format({
        pathname: path.join(__dirname, pathIndex),
        protocol: 'file:',
        slashes: true
      }));
    });
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(createWindow, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      console.warn('outSession');
      knexAdapter('serviceInfo').where('id', session.id).update({sessionStop: new Date().toISOString()})
        .then((value) => {
          console.warn('inserted value when app quiting', value);
          app.quit();
        })
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  updater.on('update-available', () => {
    win.webContents.send('update-available');
  });
  updater.on('update-downloading', () => {
    win.webContents.send('update-downloading');
  });
  updater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
  });

  ipcMain.on('quitApp', (e, value) => {
    if (value) {
      win.close();
    }
  });

  ipcMain.on('updaterIsClosed', (e, value) => {
    if (value) {
      preloaderWindow.close();
      win.show();
    }
  });

  ipcMain.on('restart_app', () => {
    updater.quitAndInstall();
  });

  ipcMain.on('start-update', () => {
    updater.checkForUpdates();
  });

} catch (e) {
  // Catch Error
  // throw e;
}
