import * as fs from 'fs';
import {
  getDefaultWebXmlPath,
  getDefaultContextXmlPath,
  getDefaultEnvJsPath
} from './defaults.cjs';
import LDAPFactory from '@ilb/node_ldap';
import createDebug from 'debug';
import { readContext } from './WebContextReader.cjs';

const debug = createDebug('node_context');

/**
 * resolve all undefined values with resolver function
 * @param {*} values
 * @param {*} resourceResolver
 * @returns
 */
async function resolveEnv(values, resourceResolver) {
  for (const prop in values) {
    if (values[prop] === undefined) {
      values[prop] = await resourceResolver(prop);
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
    await this.adoptEnv();
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
   * Method builds context with values read from web.xml and context.xml
   * context.xml values have higher priority
   * @returns {undefined}
   */
  async buildContext(options = {}) {
    const resourceResolver = await this.getResourceResolver();
    const ldapContext = readContext(this.webXmlPath, this.contextXmlPath);
    await resolveEnv(ldapContext, resourceResolver);
    debug('ldapContext = %o', ldapContext);
    this.ldapFactory.close();
    const context = options.keepDot ? ldapContext : removeDot(ldapContext);
    debug('context = %o', context);
    return context;
  }

  async adoptEnv() {
    if (this.envJsPath && fs.existsSync(this.envJsPath)) {
      //  await import(this.envJsPath);
      const envJs = fs.readFileSync(this.envJsPath, 'utf8');
      eval(envJs);
    }
  }
}

export default ContextFactory;
