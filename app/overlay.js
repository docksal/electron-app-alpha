/**
 * Small overlay window to show information about some current process
 */

const {BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let appOverlayWin;
global.appOverlayData = {};

exports.show = (message) => {
  global.appOverlayData.message = message;

  // if exists just show
  if (appOverlayWin) {
    appOverlayWin.show();
    return;
  }

  appOverlayWin = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    titleBarStyle: 'hidden',
    show: true,
    backgroundColor: '#2b2b2b',
    center: true,
    movable: false,
    resizable: false,
    maximizable: false,
    // closable: false, setting this creates issues closing the app
    //skipTaskbar: true
  });

  // and load the index.html of the app.
  appOverlayWin.loadURL(url.format({
    pathname: path.join(global.dir.html, 'appOverlay.html'),
    protocol: 'file:',
    slashes: true
  }));

  appOverlayWin.once('ready-to-show', () => {
    appOverlayWin.show();
    //appOverlayWin.webContents.openDevTools()
  });

  // Emitted when the window is closed.
  appOverlayWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    appOverlayWin = null
  })
};

exports.hide = () => {
  appOverlayWin.hide();
//  appOverlayWin.close();
};