/**
 * Controls tray and tray menu
 */

const {app, Tray, Menu} = require('electron');
const path = require('path');
const docksal = require('./docksal-cli');
const overlay = require('./overlay');
const browser = require('./browser');

let appIcon = null;
const iconOnline = path.join(global.dir.images, 'tray/macos/', 'icon.png');
const iconOffline = path.join(global.dir.images, 'tray/macos/', 'icon-red.png');
const iconHighlightPath = path.join(global.dir.images, 'iconHighlight.png');

const isLinux = (process.platform === 'linux');

// Tray on Ubuntu will not work without libappindicator1

function checkLinuxTraySupport (cb) {
  require('child_process').exec('dpkg --get-selections libappindicator1', function (err, stdout) {
    if (err) return cb(false);
    cb(stdout.endsWith('\tinstall\n'));
  })
}

if (isLinux) {
  checkLinuxTraySupport(function (supportsTray) {
    if (!supportsTray) {
      console.log('[ERROR] libappindicator1 is not installed. Install it with apt-get first. Aborting.');
      app.exit();
    }
  })
}

/**
 * Refreshes menu after VM updates
 * @param contextMenu
 * @param appIcon
 */
refreshMenuVM = function (contextMenu, appIcon) {
  docksal.vmStatus((isRunning) => {
    global.log.debug('(tray-menu.js): redrawing, isRunning ' + isRunning);
    contextMenu.items[0].enabled = !isRunning; // Start VM
    contextMenu.items[1].enabled = isRunning; // Stop VM
    contextMenu.items[2].enabled = isRunning; // Open WebUI
    if (!isRunning) {
      appIcon.setImage(iconOffline);
    } else {
      appIcon.setImage(iconOnline);
    }
    // on Linux there's a need to call this after each menu update
    isLinux && appIcon.setContextMenu(contextMenu);
  });
};

exports.create = () =>{
  overlay.show('Starting Docksal UI...');
  typeof app.dock != 'undefined' && app.dock.hide(); // hide from Dock
  appIcon = new Tray(iconOffline);
  //appIcon.setPressedImage(iconHighlightPath);

  let contextMenu = Menu.buildFromTemplate([
    {
      label: isLinux ? 'Start Docker' : 'Start VM',
      enabled: false,
      click: function(){
        contextMenu.items[0].enabled = false; // disable self
        docksal.vmStart(() => {
          refreshMenuVM(contextMenu, appIcon);
        });
      }
    },
    {
      label: isLinux ? 'Stop Docker' : 'Stop VM',
      enabled: false,
      click: function() {
        contextMenu.items[1].enabled = false; // disable self
        docksal.vmStop(() => {
          refreshMenuVM(contextMenu, appIcon);
        });
      }
    },
    {
      label: 'Open WebUI',
      enabled: false,
      click: function() {
        contextMenu.items[2].enabled = false; // disable self
        docksal.webui(() => {
          contextMenu.items[2].enabled = true;
          browser.openWebui();
        });
      }
    },
    {
      type: 'separator'
    },
    // {
    //   label: 'Refresh',
    //   enabled: true,
    //   click: function() {
    //     overlay.show('Getting VM status...');
    //     docksalVm.getStatus((isRunning) => {
    //       contextMenu.items[0].enabled = !isRunning;
    //       contextMenu.items[1].enabled = isRunning;
    //       overlay.hide();
    //     });
    //   }
    // },
    // {
    //   label: 'Item2',
    //   submenu: [
    //     { label: 'submenu1' },
    //     { label: 'submenu2' }
    //   ]
    // },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.exit();
      },
    }
  ]);
  appIcon.setToolTip('Docksal UI');
  appIcon.setContextMenu(contextMenu);

  refreshMenuVM(contextMenu, appIcon);
  setTimeout(() => overlay.hide(), 1500);
  // setInterval(() => {
  //   refreshVmStatus(contextMenu, appIcon);
  // }, 2000);

};
