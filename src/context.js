const { getDefaultWebXmlPath, getDefaultContextXmlPath } = require('./defaults.js');
const { readContext } = require('./contextreader.js');
const { ldapResolver } = require('./ldap.js');
const { removeDot } = require('./utils.js');
const createDebug = require('debug');
const debug = createDebug('node_context');

const LDAPFactory = require('@ilb/node_ldap');

async function buildContext({ webXmlPath, contextXmlPath, ldapFactory } = {}) {
  if (!ldapFactory) {
    ldapFactory = new LDAPFactory();
  }

  webXmlPath = webXmlPath || getDefaultWebXmlPath();
  contextXmlPath = contextXmlPath || getDefaultContextXmlPath();
  const context = readContext(webXmlPath, contextXmlPath);
  await ldapResolver(context, ldapFactory);
  ldapFactory.close();
  debug('context = %o', context);
  return removeDot(context);
}

module.exports = { buildContext };
