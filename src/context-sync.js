const { context } = require('./context-sync.js');
const { spawnSync } = require('child_process');

/**
 * synchronous wrapper
 * @returns
 */
function contextSync() {
  const { error, stdout } = spawnSync(process.execPath, [__filename]);
  if (error) {
    throw error;
  }
  // console.log(stdout.toString(), 'zzz');
  const context = JSON.parse(stdout);
  return context;
}

module.exports = { contextSync };
if (process.argv[1] == __filename) {
  // console.log(process.argv[1]);

  context().then(JSON.stringify).then(console.log);
}
