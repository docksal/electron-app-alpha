/**
 * Browser can spawn many windows and load external resources
 */

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let windows = [];
let webuiIndex = 7;

/**
 * Open browser window with the defined path and protocol
 * @param {string} pathname
 * @param {string} [protocol=http]
 */
exports.open = (pathname, protocol) => {

  if (windows[webuiIndex] != null) {
    windows[webuiIndex].show();
    return;
  }

  windows[webuiIndex] = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false // disable for jQuery, see http://stackoverflow.com/a/38311388
    }
    // titleBarStyle: 'hidden',
    // show: false,
    // backgroundColor: '#2b2b2b',
    // center: true,
    // movable: false,
    // resizable: false,
    // maximizable: false,
    // // closable: false, setting this creates issues closing the app
    // skipTaskbar: true
  });
  let win = windows[webuiIndex];

  win.loadURL(url.format({
    pathname: pathname,
    protocol: (protocol ? protocol : 'http') + ':',
    slashes: true
  }));

  typeof app.dock != 'undefined' && app.dock.show();
  win.once('ready-to-show', () => {
    win.show();
    //appOverlayWin.webContents.openDevTools()
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows[webuiIndex] = null;
    typeof app.dock != 'undefined' && app.dock.hide();
  });
};

exports.openWebui = () => {
  exports.open('webui.docksal');
};