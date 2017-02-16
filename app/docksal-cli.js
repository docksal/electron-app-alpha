/**
 * Docksal VM related functions
 */

const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');
const os = require('os');
const pid = require('./pid-watcher');

const isLinux = (process.platform === 'linux');

global.log.verbose('[PATH]: ' + process.env.PATH);

// // Path to UNIX home directory
// const USERHOME = (() => {
//   if (os.platform() == 'win32') {
//     let winPath = path.join(process.env.USERPROFILE, '.babun', 'cygwin', 'home', process.env.USERNAME)
//   } else {
//     return process.env.HOME;
//   }
// })();
//
// global.log.debug(USERHOME);

function cygpath (path, option) {
  switch (option) {
    default:
      // unix type path by default
      // will convert win path but will not touch unix path
      return path.replace(':', '').replace(/\\/g, '/').replace(/^([^/])/, '/$1')
      break;
  }
}

function cross_os_spawn(file, args) {
  switch (os.platform()) {
    case 'darwin':
      return spawn(file, args, {shell:true});
      break;
    case 'win32':
      //const ps = spawn('cmd', ['/c', '%USERPROFILE%/.babun/cygwin/bin/bash.exe', '-ic', '/usr/local/bin/fin ps -a'])
      const _bash = path.join(process.env.USERPROFILE,'.babun','cygwin','bin','bash.exe');
      return spawn(_bash, ['-c', file + ' ' + args.join(' ')]);
      break;
    case 'linux':
      return spawn(file, args, {shell:true});
      break;
  }
}

function cross_os_open(script) {
  switch (os.platform()) {
    case 'darwin':
      return spawn('/usr/bin/open', ['-a', 'Terminal', script]);
      break;
    case 'win32':
      const _bash = path.join(process.env.USERPROFILE,'.babun','cygwin','bin','bash.exe');
      // spaces in script path need to be escaped
      return spawn('cmd', ['/c', 'start', 'cmd', '/c', _bash, '-ic', script.replace(' ', '\\ ')]);
      break;
    case 'linux':
      return spawn('gnome-terminal', ['-e', "bash -c " + script]);
      break;
  }
}

/**
 * Get vm status
 * @param {function(isRunning:boolean)} callback
 */
exports.vmStatus = (callback) => {
  let ps;
  if (isLinux) {
    ps = cross_os_spawn('docker', ['info']);
  } else {
    ps = cross_os_spawn('~/.docksal/bin/docker-machine', ['status', 'docksal']);
  }

  let stderr = '';
  ps.stdout.on('data', (data) => {
    data = `${data}`;
    global.log.verbose("(docksal-cli.js): " + data);
    callback(data.indexOf("Running") >= 0);
  });
  ps.stderr.on('data', (data) => {
    stderr += `${data}`;
  });
  ps.on('close', (code) => {
    if (`${code}` != "0") {
      global.log.error("(docksal-cli.js): " + stderr);
      callback(false);
    }
  });
};

/**
 * Stop vm
 * @param {function()} callback
 */
exports.vmStop = (callback) => {
  pid.create('stopvm', () => {
    const stopVm = isLinux ?
      path.join(global.dir.bash, 'stop-docker.sh') :
      cygpath(path.join(global.dir.bash, 'stop-vm.sh'));
    const ps = cross_os_open(stopVm);
    pid.watch('stopvm', () => {
      global.log.info('(docksal-cli.js) stopvm has finished');
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
    const startVm = isLinux ?
      path.join(global.dir.bash, 'start-docker.sh') :
      cygpath(path.join(global.dir.bash, 'start-vm.sh'));
    const ps = cross_os_open(startVm);
    pid.watch('startvm', () => {
      global.log.info('(docksal-cli.js) startvm has finished');
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
    const webuiStart = cygpath(path.join(global.dir.bash, 'webui.sh'));
    const ps = cross_os_open(webuiStart);
    pid.watch('webui', () => {
      global.log.info('(docksal-cli.js) WEBUI has started');
      callback();
    });
  });
};
