const {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
} = require('./defaults.js');
const LDAPFactory = require('@ilb/node_ldap');
const createDebug = require('debug');
const { readContext } = require('./WebContextReader.js');
const { execJsFile, assignNotExisting, valueResolver, removeDot } = require('./utils.js');

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
  async getResourceResolver() {
    if (!this.ldapFactory.isConfigured()) {
      return () => '!LDAP not configured!';
    }
    const ldapResource = await this.ldapFactory.getLDAPResource();
    const ldapPrefix = process.env.LDAPPREFIX || '';
    debug('ldapPrefix = %s', ldapPrefix);

    async function resourceResolver(name) {
      if (ldapPrefix && name.startsWith('.')) {
        name = ldapPrefix + name;
      }
      const value = await ldapResource.lookup(name);
      debug('ldapResource.lookup(%s) = %s', name, value);
      // console.log({ name, value });
      return value;
    }

    return resourceResolver;
  }

  /**
   * Method builds context with values read =require( web.xml and context.xml
   * context.xml values have higher priority
   * @returns {undefined}
   */
  async buildContext(options = {}) {
    const resourceResolver = await this.getResourceResolver();
    const ldapContext = readContext(this.webXmlPath, this.contextXmlPath);
    await valueResolver(ldapContext, resourceResolver);
    debug('ldapContext = %o', ldapContext);
    this.ldapFactory.close();
    const context = options.keepDot ? ldapContext : removeDot(ldapContext);
    debug('context = %o', context);
    return context;
  }
}

module.exports = ContextFactory;
