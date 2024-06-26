const LDAPFactory = require('ildap');
const { getDefaultWebXmlPath, getDefaultContextXmlPath } = require('./defaults.js');
const { readContext } = require('./contextreader.js');

const { ldapResolver } = require('./resolver.js');
const { debug } = require('./helpers/DebugHelper.js');

class ContextFactory {
  constructor({ webXmlPath, contextXmlPath, ldapFactory } = {}) {
    this.webXmlPath = webXmlPath || getDefaultWebXmlPath();
    this.contextXmlPath = contextXmlPath || getDefaultContextXmlPath();
    this.ldapFactory = ldapFactory || new LDAPFactory();
    debug('icontext', 'webXmlPath:', this.webXmlPath, 'contextXmlPath:', this.contextXmlPath);
  }

  /**
   * Method populates process.env
   * @returns {undefined}pop
   */
  async build() {
    const context = await this.buildContext();
    Object.assign(process.env, context);
    return context;
  }

  /**
   * Method builds context with values read =require( web.xml and context.xml
   * context.xml values have higher priority
   * @returns {undefined}
   */
  async buildContext() {
    const context = readContext(this.webXmlPath, this.contextXmlPath);
    debug('icontext', 'merged context', context);
    await ldapResolver(context, this.ldapFactory);
    debug('icontext', 'ldap context', context);
    valueResolver(context);
    debug('icontext', 'resolved context', context);
    return context;
  }
  close() {
    this.ldapFactory.close();
  }
}

/**
 * resolve all undefined values with resolver function
 * @param {*} values
 * @param {*} resourceResolver
 * @returns
 */
async function valueResolver(values) {
  for (const prop in values) {
    if (typeof values[prop] == 'function') {
      const fn = values[prop];
      values[prop] = fn(values);
    }
  }
  return values;
}

module.exports = ContextFactory;
