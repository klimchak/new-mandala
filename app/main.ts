import {app, BrowserWindow, screen, ipcRenderer, ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import {fullUpdateAnswer, SessionModel} from "../src/app/modules/shared/models/session.model";
import {dataTablePath} from "../src/app/constants";
import {knex} from "knex";

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

let session: SessionModel = {
  id: Date.now(),
  sessionStart: new Date().toISOString(),
  sessionStop: null
};

let webContext: any;
const knexAdapter = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, dataTablePath),
  },
  useNullAsDefault: true
});

knexAdapter('serviceInfo').insert([{id: session.id, sessionStart: session.sessionStart}], fullUpdateAnswer).then(() => {
  console.warn('session start', session);
});

function createWindow(): BrowserWindow {

  // const electronScreen = screen;
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    // frame: false,
    // maximizable: false,
    // minimizable: false,
    title: 'MandalaApp 2.0.0',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });
  //win.setTitle('sdsdsdsds');
  webContext = win.webContents;

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
      knexAdapter('serviceInfo').where('id', session.id).update({ sessionStop: new Date().toISOString()})
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

  ipcMain.on('quitApp', (e, value) => {
    if (value){
      win.close();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
