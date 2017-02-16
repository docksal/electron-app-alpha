/**
 * Global Logging. Disabled by default.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

let LOGS_FOLDER;

switch (os.platform()) {
  case 'win32':
    LOGS_FOLDER = 'C:\\Users\\' + process.env.USERNAME + '\\.babun\\cygwin\\tmp';
    break;
  default:
    LOGS_FOLDER = '/tmp';
    break;
}

const LOGFILE = path.join(LOGS_FOLDER, 'docksal-ui.log');
const ERRFILE = path.join(LOGS_FOLDER, 'docksal-ui.err');

exports.DEBUG_VERBOSE_LEVEL = 0;
exports.DEBUG_LEVEL = 1;
exports.INFO_LEVEL = 2;
exports.WARN_LEVEL = 3;
exports.ERROR_LEVEL = 4;

let debugEnabled = false;
let errorLevel = exports.DEBUG_LEVEL;

exports.log = (level, msg) => {
  if (!debugEnabled || errorLevel > level) return;
  let fileName = "";
  let prefix = '';
  (level == exports.INFO_LEVEL) && (prefix = '<INFO> ');
  (level == exports.WARN_LEVEL) && (prefix = '<WARN> ' );
  (level == exports.ERROR_LEVEL) && (prefix = '<ERROR> ');
  let line = fileName + prefix + msg + (msg[msg.length-1] == "\n" ? "" : "\n");

  if (level < exports.ERROR_LEVEL) {
    fs.writeFileSync(LOGFILE, line, {flag: 'a'});
  } else {
    fs.writeFileSync(ERRFILE, line, {flag: 'a'});
  }

  console.log(line.trim());
};

exports.verbose = (msg) => {
  msg = msg + '';
  exports.log(exports.DEBUG_VERBOSE_LEVEL, msg);
};

exports.debug = (msg) => {
  msg = msg + '';
  exports.log(exports.DEBUG_LEVEL, msg);
};

exports.info = (msg) => {
  msg = msg + '';
  exports.log(exports.INFO_LEVEL, msg);
};

exports.warn = (msg) => {
  msg = msg + '';
  exports.log(exports.WARN_LEVEL, msg);
};

exports.error = (msg) => {
  msg = msg + '';
  exports.log(exports.ERROR_LEVEL, msg);
};

exports.start = () => {
  debugEnabled = true;
};

exports.stop = () => {
  debugEnabled = false;
};

exports.setErrorLevel = (level) => {
  errorLevel = level;
};

let logStart = 'Log start ' + (new Date()).toString() + "\n-------------------------\n";
fs.writeFileSync(LOGFILE, logStart);
fs.writeFileSync(ERRFILE, logStart);
