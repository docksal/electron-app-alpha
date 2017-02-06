/**
 * Docksal VM related functions
 */

const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');
const pid = require('./pid-watcher');

global.log.debug(process.env.PATH);

/**
 * Get vm status
 * @param {function(isRunning:boolean)} callback
 */
exports.vmStatus = (callback) => {
  const ps = spawn(process.env.HOME + '/.docksal/bin/docker-machine', ['status', 'docksal']);
  ps.stdout.on('data', (data) => {
    data = `${data}`;
    global.log.debug("[docksalVm] " + data);
    callback(data.indexOf("Running") >= 0);
  });
  ps.stderr.on('data', (data) => {
    global.log.error("[docksalVm] " + data);
  });
};

/**
 * Stop vm
 * @param {function()} callback
 */
exports.vmStop = (callback) => {
  pid.create('stopvm', () => {
    const stopVm = path.join(global.dir.bash, 'stop-vm.sh');
    const ps = spawn('/usr/bin/open', ['-a', 'Terminal', stopVm ]);
    pid.watch('stopvm', () => {
      global.log.info('VM has stopped');
      callback();
    });
  });
};

/**
 * Start vm
 * @param {function()} callback
 */
exports.vmStart = (callback) => {
  pid.create('startvm', () => {
    const startVm = path.join(global.dir.bash, 'start-vm.sh');
    const ps = spawn('/usr/bin/open', ['-a', 'Terminal', startVm ]);
    pid.watch('startvm', () => {
      global.log.info('VM has started');
      callback();
    });
  });
};

/**
 * Open WebUI
 * @param {function()} callback
 */
exports.webui = (callback) => {
  pid.create('webui', () => {
    const webuiStart = path.join(global.dir.bash, 'webui.sh');
    const ps = spawn('/usr/bin/open', ['-a', 'Terminal', webuiStart ]);
    pid.watch('webui', () => {
      global.log.info('WEBUI has started');
      callback();
    });
  });
};
