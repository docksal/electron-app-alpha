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

let debugEnabled = false;
let errorLevel = 0;

const DEBUG = 0;
const INFO = 1;
const WARN = 2;
const ERROR = 3;

exports.log = (level, msg) => {
  if (!debugEnabled || errorLevel > level) return;
  let fileName = "";
  let prefix = '';
  (level == INFO) ? prefix = '<INFO> ' : 0;
  (level == WARN) ? prefix = '<WARN> ' : 0;
  (level == ERROR) ? prefix = '<ERROR> ' : 0;
  let line = fileName + prefix + msg + (msg[msg.length-1] == "\n" ? "" : "\n");

  if (level < 3) {
    fs.writeFileSync(LOGFILE, line, {flag: 'a'});
  } else {
    fs.writeFileSync(ERRFILE, line, {flag: 'a'});
  }

  console.log(line.trim());
};

exports.debug = (msg) => {
  msg = msg + ''
  exports.log(DEBUG, msg);
};

exports.info = (msg) => {
  msg = msg + ''
  exports.log(INFO, msg);
};

exports.warn = (msg) => {
  msg = msg + ''
  exports.log(WARN, msg);
};

exports.error = (msg) => {
  exports.log(ERROR, msg);
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
