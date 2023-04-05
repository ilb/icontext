const { buildContext } = require('./context.js');
const { spawnSync } = require('child_process');

/**
 * synchronous wrapper
 * @returns
 */
function buildContextSync() {
  const { error, stdout } = spawnSync(process.execPath, [__filename]);
  if (error) {
    throw error;
  }
  const context = JSON.parse(stdout);
  return context;
}

/**code runs in spawnSync */
if (process.argv[1] == __filename) {
  buildContext().then(JSON.stringify).then(console.log);
}

module.exports = { buildContextSync };
