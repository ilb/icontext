const fs = require('fs');
const { parseWebXml } = require('./webxml.js');
const { parseContextXml } = require('./contextxml.js');
const createDebug = require('debug');
const { hiding } = require('./helpers/DebugHelper.js');
const debug = createDebug('icontext');

function readContext(webXmlPath, contextXmlPath) {
  const result = {};
  if (webXmlPath && fs.existsSync(webXmlPath)) {
    const webValues = parseWebXml(fs.readFileSync(webXmlPath, 'utf8'));
    debug(...hiding('web.xml', webValues));
    Object.assign(result, webValues);

    let contextValues = {};
    if (contextXmlPath && fs.existsSync(contextXmlPath)) {
      contextValues = parseContextXml(fs.readFileSync(contextXmlPath, 'utf8'));
      debug(...hiding('context.xml', contextValues));
    }
    for (const key in result) {
      if (process.env[key] !== undefined) {
        debug(...hiding('value from ENV[%o]=%o', key, process.env[key]));
        result[key] = process.env[key];
      } else if (contextValues[key] !== undefined) {
        debug(...hiding('value from CONTEXT[%o]=%o', key, contextValues[key]));
        result[key] = contextValues[key];
      }
    }
  }
  return result;
}

module.exports = { readContext };
