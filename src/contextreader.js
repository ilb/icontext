const fs = require('fs');
const { parseWebXml } = require('./webxml.js');
const { parseContextXml } = require('./contextxml.js');
const { debug } = require('./helpers/DebugHelper.js');

function readContext(webXmlPath, contextXmlPath) {
  const result = {};
  if (webXmlPath && fs.existsSync(webXmlPath)) {
    const webValues = parseWebXml(fs.readFileSync(webXmlPath, 'utf8'));
    debug('icontext', 'web.xml', webValues);
    Object.assign(result, webValues);

    let contextValues = {};
    if (contextXmlPath && fs.existsSync(contextXmlPath)) {
      contextValues = parseContextXml(fs.readFileSync(contextXmlPath, 'utf8'));
      debug('icontext', 'context.xml', contextValues);
    }
    for (const key in result) {
      if (process.env[key] !== undefined) {
        debug('icontext', 'value from ENV: %o', { [key]: process.env[key] });
        result[key] = process.env[key];
      } else if (contextValues[key] !== undefined) {
        debug('icontext', 'value from CONTEXT: %o', { [key]: contextValues[key] });
        result[key] = contextValues[key];
      }
    }
  }
  return result;
}

module.exports = { readContext };