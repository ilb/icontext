const { spawnSync } = require('child_process');
const ContextFactory = require('./ContextFactory.js');

/**
 * asynchronous buildContext
 */
async function buildContext(options) {
  const contextFactory = new ContextFactory(options);
  return await contextFactory.buildContext();
}

/**
 * synchronous wrapper
 * @returns
 */
function buildContextSync() {
  const res = spawnSync(process.execPath, [__filename], { env: process.env });
  if (res.error) {
    throw res.error;
  }
  if (res.status !== 0) {
    throw new Error(res.stderr.toString());
  }
  // console.log(res.stdout.toString());
  // console.log(res.stderr.toString());

  const context = JSON.parse(res.stdout);
  return context;
}

/**code runs in spawnSync */
if (process.argv[1] == __filename) {
  // console.log(process.env.CONTEXT_WEBXML);
  buildContext().then(JSON.stringify).then(console.log);
}

module.exports = { buildContext, buildContextSync };
