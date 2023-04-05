const LDAPFactory = require('@ilb/node_ldap');
const { getDefaultWebXmlPath, getDefaultContextXmlPath } = require('./defaults.js');
const { readContext } = require('./contextreader.js');

const createDebug = require('debug');
const { ldapResolver } = require('./resolver.js');
const debug = createDebug('node_context');

class ContextFactory {
  constructor({ webXmlPath, contextXmlPath, ldapFactory } = {}) {
    this.webXmlPath = webXmlPath || getDefaultWebXmlPath();
    this.contextXmlPath = contextXmlPath || getDefaultContextXmlPath();
    this.ldapFactory = ldapFactory || new LDAPFactory();
  }

  /**
   * Method populates process.env
   * @returns {undefined}pop
   */
  async build(options = {}) {
    const context = await this.buildContext(options);
    assignNotExisting(process.env, context);
    return context;
  }

  /**
   * Method builds context with values read =require( web.xml and context.xml
   * context.xml values have higher priority
   * @returns {undefined}
   */
  async buildContext() {
    const context = readContext(this.webXmlPath, this.contextXmlPath);
    debug('merged context', context);
    await ldapResolver(context, this.ldapFactory);
    debug('ldap context', context);
    valueResolver(context);
    debug('resolved context', context);
    return removeDot(context);
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
/**
 * copies all properties from source which does NOT exists in target
 * @param {*} target
 * @param {*} source
 */
function assignNotExisting(target, source) {
  for (const prop in source) {
    if (target[prop] === undefined) {
      target[prop] = source[prop];
    }
  }
}
function removeDot(source) {
  const target = {};
  for (const prop in source) {
    target[prop.startsWith('.') ? prop.substring(1) : prop] = source[prop];
  }
  return target;
}
module.exports = ContextFactory;
