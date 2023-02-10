const fs = require('fs');
const { parseWebXml } = require('./WebXmlReader.cjs');
const { parseContextXml } = require('./ContextXmlReader.cjs');
const createDebug = require('debug');
const debug = createDebug('node_context');
/**
 * copies all properties from source which exists in target
 * @param {*} target
 * @param {*} source
 */
function assignExisting(target, source) {
  for (const prop in source) {
    if (target[prop] === undefined || target[prop] === null) {
      target[prop] = source[prop];
    } else {
      debug('property "%o" not defined, skipping', prop);
    }
  }
}

function readContext(webXmlPath, contextXmlPath) {
  const result = {};
  if (webXmlPath && fs.existsSync(webXmlPath)) {
    const webxml = fs.readFileSync(webXmlPath, 'utf8');
    const values = parseWebXml(webxml);
    debug('WebXmlReader = %o', values);
    Object.assign(result, values);
  }

  if (contextXmlPath && fs.existsSync(contextXmlPath)) {
    const contextXml = fs.readFileSync(contextXmlPath, 'utf8');
    const values = parseContextXml(contextXml);
    debug('ContextXmlReader = %o', values);
    assignExisting(result, values);
  }
  return result;
}

module.exports = { readContext };
