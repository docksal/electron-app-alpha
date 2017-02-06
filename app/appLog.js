/**
 * Global Logging. Disabled by default.
 */

const path = require('path');
const fs = require('fs');

const LOGFILE = '/tmp/docksal-ui.log';
const ERRFILE = '/tmp/docksal-ui.err';

let debugEnabled = false;


exports.debug = (msg) => {
  if (!debugEnabled) return;
  let fileName = "";
  fs.writeFileSync(LOGFILE, fileName + msg + (msg[msg.length-1] == "\n" ? "" : "\n"), {flag: 'a'});
};

exports.error = (msg) => {
  if (!debugEnabled) return;
  let fileName = "";
  fs.writeFileSync(ERRFILE, fileName + msg + (msg[msg.length-1] == "\n" ? "" : "\n"), {flag: 'a'});
};

exports.start = () => {
  debugEnabled = true;
};

exports.stop = () => {
  debugEnabled = false;
};

let logStart = 'Log start ' + (new Date()).toString() + "\n-------------------------\n";
fs.writeFileSync(LOGFILE, logStart);
fs.writeFileSync(ERRFILE, logStart);
