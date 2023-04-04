const {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
} = require('./defaults.js');
const { readContext } = require('./WebContextReader.js');
const { execJsFile, assignNotExisting } = require('./utils.js');
const { ldapResolver } = require('./ldap.js');

async function main() {
  const webXmlPath = getDefaultWebXmlPath();
  const contextXmlPath = getDefaultContextXmlPath();
  const envJsPath = getDefaultEnvJsPath();
  const context = readContext(webXmlPath, contextXmlPath);
  await ldapResolver(context);

  assignNotExisting(process.env, context);
  execJsFile(envJsPath);
}

main().then();
