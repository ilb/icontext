const path = require('path');
const fs = require('fs');
const createDebug = require('debug');
const debug = createDebug('node_context');

function getDefaultWebXmlPath() {
  return path.resolve(process.cwd(), 'conf/web.xml');
}
function getDefaultContextXmlPath(systemContextBase = '/etc/nodejs/context') {
  let contextXmlPath = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
  let contextXmlPathExists = fs.existsSync(contextXmlPath);
  debug('contextXmlPath = %s, exists = %o', contextXmlPath, contextXmlPathExists);
  if (!contextXmlPathExists) {
    const userName = process.env.USERNAME || process.env.USER;
    const workDir = path.basename(process.cwd());
    contextXmlPath = `${systemContextBase}/${userName}/${workDir}.xml`;
    contextXmlPathExists = fs.existsSync(contextXmlPath);
    debug('contextXmlPath = %s, exists = %o', contextXmlPath, contextXmlPathExists);
    if (!contextXmlPathExists) {
      contextXmlPath = null;
    }
  }
  return contextXmlPath;
}
function getDefaultEnvJsPath() {
  let envJsPath = path.resolve(process.cwd(), '.env.mjs');
  let envJsPathExists = fs.existsSync(envJsPath);
  debug('envJsPath = %s, exists = %o', envJsPath, envJsPathExists);
  if (!envJsPathExists) {
    envJsPath = path.resolve(process.cwd(), '.env.js');
    envJsPathExists = fs.existsSync(envJsPath);
    debug('envJsPath = %s, exists = %o', envJsPath, envJsPathExists);
    if (!envJsPathExists) {
      envJsPath = null;
    }
  }
  return envJsPath;
}

module.exports = {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
};
