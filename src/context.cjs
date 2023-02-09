const {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
} = require('./defaults.cjs');
const { readContext } = require('./WebContextReader.cjs');
const { execJsFile, assignNotExisting } = require('./utils.cjs');

const webXmlPath = getDefaultWebXmlPath();
const contextXmlPath = getDefaultContextXmlPath();
const envJsPath = getDefaultEnvJsPath();
const context = readContext(webXmlPath, contextXmlPath);
assignNotExisting(process.env, context);
execJsFile(envJsPath);

//TODO: LDAP cjs version
