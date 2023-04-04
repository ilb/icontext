const {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
} = require('./defaults.js');
const { readContext } = require('./WebContextReader.js');
const { execJsFile, assignNotExisting } = require('./utils.js');

const webXmlPath = getDefaultWebXmlPath();
const contextXmlPath = getDefaultContextXmlPath();
const envJsPath = getDefaultEnvJsPath();
const context = readContext(webXmlPath, contextXmlPath);
assignNotExisting(process.env, context);
execJsFile(envJsPath);

//TODO: LDAP cjs version
