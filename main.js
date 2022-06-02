const {app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const env = process.env.NODE_ENV || 'development';
const url = require("url");
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

// If development environment
if (env === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules/.bin/electron.cmd')
  });
}
// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules/.bin/electron.cmd')
// });
// Create the browser window.
let win;
let webContext;
let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, '/dist/new-mandala/assets/database/db.db')
  }
});
function createWindow() {
  win = new BrowserWindow({
    nodeIntegration: true,
    contextIsolation: false
  });
  webContext = win.webContents;
  webContext.on('did-fail-load', () => {
    win.loadFile(path.join(__dirname, `/dist/new-mandala/index.html`))
    // win.loadURL(
    //   url.format({
    //     pathname: path.join(__dirname, `/dist/new-mandala/index.html`),
    //     protocol: "file:",
    //     slashes: true,
    //   })
    // );
  });
  win.loadFile(path.join(__dirname, `/dist/new-mandala/index.html`))
  // // Load the index.html of the app.
  // win.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/dist/new-mandala/index.html`),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );

  // Open the DevTools.
  win.webContents.openDevTools()
}
ipcMain.on("mainWindowLoaded", function () {
  console.log('get data from DB')
  let result = knex.select("userName").from("users")
  console.log('get data from DB')
  result.then(function(rows){
    win.webContents.send("resultSent", rows);
  })
});
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
