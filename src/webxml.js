const { parseValue } = require('./parser.js');
const { xml2jswrapper } = require('./xml2jswrapper.cjs');

function parseWebXml(src) {
  const config = xml2jswrapper(src);

  if (!config['web-app']) {
    throw new Error(`web.xml should contain web-app node`);
  }
  const result = {};
  if (config['web-app']['env-entry'] !== undefined) {
    config['web-app']['env-entry'].forEach((entry) => {
      const val = getEnvEntryValue(entry);
      result[val.name] = val.value;
    });
  }

  if (config['web-app']['resource-env-ref']) {
    for (const resource of config['web-app']['resource-env-ref']) {
      let { name } = getResourceEntryValue(resource);
      if (name.startsWith('.')) {
        name = name.substring(1);
      }
      //value will be filled later
      result[name] = undefined;
    }
  }
  return result;
}
function getEnvEntryValue(entry) {
  if (entry['env-entry-type'] === undefined) {
    throw new Error('env-entry-type missing, incorrect entry ' + JSON.stringify(entry));
  }
  if (entry['env-entry-name'] === undefined) {
    throw new Error('env-entry-name missing, incorrect entry ' + JSON.stringify(entry));
  }

  const type = entry['env-entry-type'].toString().trim();
  const name = entry['env-entry-name'].toString().trim();
  const rawValue =
    entry['env-entry-value'] !== undefined ? entry['env-entry-value'].toString().trim() : null;
  if (type.length === 0) {
    throw new Error('env-entry-type zero length, incorrect entry ' + JSON.stringify(entry));
  }
  if (name.length === 0) {
    throw new Error('env-entry-name missing, incorrect entry ' + JSON.stringify(entry));
  }
  const value = parseValue(type, rawValue);
  return { type, name, value };
}
function getResourceEntryValue(resource) {
  let type = null;
  if (resource['resource-env-ref-type']) {
    type = resource['resource-env-ref-type'].toString().trim();
  }
  if (resource['resource-env-ref-name'] === undefined) {
    throw new Error(
      'incorrect resource: resource-env-ref-name required ' + JSON.stringify(resource)
    );
  }

  const name = resource['resource-env-ref-name'].toString().trim();

  if (name.length === 0) {
    throw new Error('incorrect resource: resource-env-ref-name empty ' + JSON.stringify(resource));
  }
  return { type, name };
}

module.exports = { parseWebXml };
