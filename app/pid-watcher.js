const fs = require('fs');
const os = require('os');

let prefix;

switch (os.platform()) {
  case 'win32':
    prefix = 'C:\\Users\\' + process.env.USERNAME + '\\.babun\\cygwin\\tmp\\pid.docksal.';
    break;
  default:
    prefix = '/tmp/pid.docksal.';
    break;
}

/**
 * Starts watching a file and executes the callback when that file gets deleted
 * @param action
 * @param {function(fileExisted)} callback
 */
exports.watch = (action, callback) => {
  let filename = prefix + action;
  try {
    fs.open(filename, 'r', (err, fd) => fd.close);
    let watcher = fs.watch(filename, {encoding: 'buffer'}, (eventType, filename) => {
      if (eventType == 'rename') {
        watcher.close();
        callback(true);
      }
    });
  } catch (e) {
    callback(false);
    global.log.debug('ENOENT: ' + filename);
  }
};

/**
 * Create pid file for action
 * @param action
 * @param callback
 */
exports.create = (action, callback) => {
  fs.writeFile(prefix + action, '', (err) => { callback(); });
};