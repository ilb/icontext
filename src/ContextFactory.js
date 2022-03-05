import * as path from 'path';
import * as fs from 'fs';
import WebXmlReader from './WebXmlReader.js';
import ContextXmlReader from './ContextXmlReader.js';
import LDAPFactory from '@ilb/node_ldap';
import createDebug from 'debug';

const debug = createDebug('node_context');

/**
 * copies all properties from source which exists in target
 * @param {*} target
 * @param {*} source
 */
function assignExisting(target, source) {
  for (const prop in source) {
    if (target[prop] !== undefined) {
      target[prop] = source[prop];
    }
  }
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
    this.systemContextBase = '/etc/nodejs/context';
    this.webXmlPath = webXmlPath || path.resolve(process.cwd(), 'conf/web.xml');
    this.contextXmlPath = contextXmlPath || this.getDefaultContextXmlPath();
    this.envJsPath = envJsPath || this.getDefaultEnvJsPath();
    this.ldapFactory = ldapFactory || new LDAPFactory();
    debug('webXmlPath = %s, contextXmlPath = %s', this.webXmlPath, this.contextXmlPath);
  }
  getDefaultContextXmlPath() {
    let contextXmlPath = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
    let contextXmlPathExists = fs.existsSync(contextXmlPath);
    debug('contextXmlPath = %s, exists = %o', contextXmlPath, contextXmlPathExists);
    if (!contextXmlPathExists) {
      const userName = process.env.USERNAME || process.env.USER;
      const workDir = path.basename(process.cwd());
      contextXmlPath = `${this.systemContextBase}/${userName}/${workDir}.xml`;
      contextXmlPathExists = fs.existsSync(contextXmlPath);
      debug('contextXmlPath = %s, exists = %o', contextXmlPath, contextXmlPathExists);
      if (!contextXmlPathExists) {
        contextXmlPath = null;
      }
    }
    return contextXmlPath;
  }
  getDefaultEnvJsPath() {
    let envJsPath = path.resolve(process.cwd(), '.env.mjs');
    let envJsPathExists = fs.existsSync(envJsPath);
    debug('envJsPath = %s, exists = %o', envJsPath, envJsPathExists);
    if (!envJsPathExists) {
      envJsPath = path.resolve(process.cwd(), '.env.js');
      envJsPathExists = fs.existsSync(envJsPath);
      debug('envJsPath = %s, exists = %o', envJsPath, envJsPathExists);
      if (!envJsPathExists) {
        envJsPath = null;
      }
    }
    return envJsPath;
  }

  /**
   * Method populates process.env
   * @returns {undefined}pop
   */
  async build(options = {}) {
    const context = await this.buildContext(options);
    if (options.overwrite) {
      Object.assign(process.env, context);
    } else {
      assignNotExisting(process.env, context);
    }
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
    const ldapContext = {};
    const resourceResolver = await this.getResourceResolver();

    if (this.webXmlPath && fs.existsSync(this.webXmlPath)) {
      const webxml = fs.readFileSync(this.webXmlPath, 'utf8');
      const wxr = new WebXmlReader(webxml, resourceResolver);
      const values = await wxr.getValues();
      debug('WebXmlReader = %o', values);
      Object.assign(ldapContext, values);
    }

    if (this.contextXmlPath && fs.existsSync(this.contextXmlPath)) {
      const contextXml = fs.readFileSync(this.contextXmlPath, 'utf8');
      const cxr = new ContextXmlReader(contextXml);
      const values = await cxr.getValues();
      debug('ContextXmlReader = %o', values);
      assignExisting(ldapContext, values);
    }
    debug('ldapContext = %o', ldapContext);
    this.ldapFactory.close();
    const context = options.keepDot ? ldapContext : removeDot(ldapContext);
    debug('context = %o', context);
    return context;
  }
  async adoptEnv() {
    //if (this.envJsPath && fs.existsSync(this.envJsPath)) {
    //  await import(this.envJsPath);
    //}
  }
}

export default ContextFactory;
