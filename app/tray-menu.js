/**
 * Controls tray and tray menu
 */

const {app, Tray, Menu} = require('electron');
const path = require('path');
const docksalVm = require('./docksal-vm');
const overlay = require('./overlay');

let appIcon = null;
const iconOnline = path.join(global.dir.images, 'tray/macos/', 'icon.png');
const iconOffline = path.join(global.dir.images, 'tray/macos/', 'icon-red.png');
const iconHighlightPath = path.join(global.dir.images, 'iconHighlight.png');

refreshMenuVM = function (contextMenu, appIcon) {
  docksalVm.getStatus((isRunning) => {
    contextMenu.items[0].enabled = !isRunning;
    contextMenu.items[1].enabled = isRunning;
    if (!isRunning) {
      appIcon.setImage(iconOffline);
    } else {
      appIcon.setImage(iconOnline);
    }
  });
};

exports.create = () =>{
  overlay.show('Starting Docksal UI...');
  app.dock.hide(); // hide from Dock
  appIcon = new Tray(iconOffline);
  //appIcon.setPressedImage(iconHighlightPath);

  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Start VM',
      enabled: false,
      click: function(){
        contextMenu.items[0].enabled = false; // disable self
        docksalVm.start(() => {
          refreshMenuVM(contextMenu, appIcon);
        });
      }
    },
    {
      label: 'Stop VM',
      enabled: false,
      click: function() {
        contextMenu.items[1].enabled = false; // disable self
        docksalVm.stop(() => {
          refreshMenuVM(contextMenu, appIcon);
        });
      }
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
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip('Docksal UI');
  appIcon.setContextMenu(contextMenu);

  refreshMenuVM(contextMenu, appIcon);
  setTimeout(() => overlay.hide(), 1000);
  // setInterval(() => {
  //   refreshVmStatus(contextMenu, appIcon);
  // }, 2000);

};
