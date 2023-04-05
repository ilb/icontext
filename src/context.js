const { spawnSync } = require('child_process');
const ContextFactory = require('./ContextFactory.js');

/**
 * asynchronous buildContext
 */
async function buildContext() {
  const contextFactory = new ContextFactory();
  await contextFactory.buildContext();
}

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

module.exports = { buildContext, buildContextSync };
