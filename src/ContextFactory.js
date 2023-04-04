const {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
} = require('./defaults.js');
const LDAPFactory = require('@ilb/node_ldap');
const { readContext } = require('./WebContextReader.js');
const { execJsFile, assignNotExisting, removeDot } = require('./utils.js');
const { ldapResolver } = require('./ldap.js');
const createDebug = require('debug');
const debug = createDebug('node_context');

class ContextFactory {
  constructor({ webXmlPath, contextXmlPath, envJsPath, ldapFactory }) {
    this.webXmlPath = webXmlPath || getDefaultWebXmlPath();
    this.contextXmlPath = contextXmlPath || getDefaultContextXmlPath();
    this.envJsPath = envJsPath || getDefaultEnvJsPath();
    this.ldapFactory = ldapFactory || new LDAPFactory();
    debug('webXmlPath = %s, contextXmlPath = %s', this.webXmlPath, this.contextXmlPath);
  }

  /**
   * Method populates process.env
   * @returns {undefined}pop
   */
  async build(options = {}) {
    const context = await this.buildContext(options);
    assignNotExisting(process.env, context);
    execJsFile(this.envJsPath);
    return context;
  }

  /**
   * Method builds context with values read =require( web.xml and context.xml
   * context.xml values have higher priority
   * @returns {undefined}
   */
  async buildContext(options = {}) {
    const ldapContext = readContext(this.webXmlPath, this.contextXmlPath);
    await ldapResolver(ldapContext, this.ldapFactory);
    debug('ldapContext = %o', ldapContext);
    this.ldapFactory.close();
    const context = options.keepDot ? ldapContext : removeDot(ldapContext);
    debug('context = %o', context);
    return context;
  }
}

module.exports = ContextFactory;
