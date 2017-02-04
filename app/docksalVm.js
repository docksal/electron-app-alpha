const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

fs.writeFileSync('/tmp/docksal-ui.log', process.env.PATH);
fs.writeFileSync('/tmp/docksal-ui.err', '');

/**
 * Get vm status
 * @param {function(isRunning:boolean)} callback
 */
exports.getStatus = (callback) => {
  const ps = spawn('/bin/bash', ['/usr/local/bin/fin', 'vm', 'status']);
  ps.stdout.on('data', (data) => {
    data = `${data}`;
    fs.writeFileSync('/tmp/docksal-ui.log', data, {flag: 'a'});
    callback(data.indexOf("Running") >= 0);
  });
  ps.stderr.on('data', (data) => {
    fs.writeFileSync('/tmp/docksal-ui.err', data);
  });
};

/**
 * Stop vm
 * @param {function(exitCode)} callback
 */
exports.stop = (callback) => {
  const stopVmScript = path.join(global.dir.bash, 'bash/stop-vm.sh');
  const ps = spawn('/usr/bin/open', ['-a', 'Terminal', stopVmScript ]);
  // We can't track when process has finished as spawning new window exits immediately
  // ps.on('close', (code) => {
  //   console.log('stop-vm done')
  //   callback(`${code}`);
  // });
};

/**
 * Start vm
 * @param {function(exitCode)} callback
 */
exports.start = (callback) => {
  const startVmScript = path.join(global.dir.bash, 'start-vm.sh');
  const ps = spawn('/usr/bin/open', ['-a', 'Terminal', startVmScript ]);
  // We can't track when process has finished as spawning new window exits immediately
  // ps.on('close', (code) => {
  //   console.log('start-vm done')
  //   callback(`${code}`);
  // });
};