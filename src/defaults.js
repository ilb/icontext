const path = require('path');
const fs = require('fs');
const createDebug = require('debug');
const { hiding } = require('./helpers/DebugHelper');
const debug = createDebug('icontext');

function getDefaultWebXmlPath() {
  if (process.env.CONTEXT_WEBXML) {
    return process.env.CONTEXT_WEBXML;
  }
  return path.resolve(process.cwd(), 'conf/web.xml');
}
function getDefaultContextXmlPath(systemContextBase = '/etc/nodejs/context') {
  if (process.env.CONTEXT_CONTEXTXML) {
    return process.env.CONTEXT_CONTEXTXML;
  }
  let contextXmlPath = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
  let contextXmlPathExists = fs.existsSync(contextXmlPath);
  debug(...hiding('contextXmlPath = %s, exists = %o', contextXmlPath, contextXmlPathExists));
  if (!contextXmlPathExists) {
    const userName = process.env.USERNAME || process.env.USER;
    const workDir = path.basename(process.cwd());
    contextXmlPath = `${systemContextBase}/${userName}/${workDir}.xml`;
    contextXmlPathExists = fs.existsSync(contextXmlPath);
    debug(...hiding('contextXmlPath = %s, exists = %o', contextXmlPath, contextXmlPathExists));
    if (!contextXmlPathExists) {
      contextXmlPath = null;
    }
  }
  return contextXmlPath;
}

module.exports = {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath
};
