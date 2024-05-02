const fs = require('fs');
const { parseWebXml } = require('./webxml.js');
const { parseContextXml } = require('./contextxml.js');
const { hiddenDebug } = require('./helpers/DebugHelper.js');

function readContext(webXmlPath, contextXmlPath) {
  const result = {};
  if (webXmlPath && fs.existsSync(webXmlPath)) {
    const webValues = parseWebXml(fs.readFileSync(webXmlPath, 'utf8'));
    hiddenDebug('icontext', 'web.xml', webValues);
    Object.assign(result, webValues);

    let contextValues = {};
    if (contextXmlPath && fs.existsSync(contextXmlPath)) {
      contextValues = parseContextXml(fs.readFileSync(contextXmlPath, 'utf8'));
      hiddenDebug('icontext', 'context.xml', contextValues);
    }
    for (const key in result) {
      if (process.env[key] !== undefined) {
        hiddenDebug('icontext', 'value from ENV[%o]=%o', key, process.env[key]);
        result[key] = process.env[key];
      } else if (contextValues[key] !== undefined) {
        hiddenDebug('icontext', 'value from CONTEXT[%o]=%o', key, contextValues[key]);
        result[key] = contextValues[key];
      }
    }
  }
  return result;
}

module.exports = { readContext };
