import * as path from 'path';
import * as fs from 'fs';
import WebXmlReader from './WebXmlReader';
import ContextXmlReader from './ContextXmlReader';
import LDAPFactory from '@ilb/node_ldap';
import createDebug from 'debug';

const debug = createDebug('node_context');

class ContextFactory {
  constructor({ webXmlPath, contextXmlPath, ldapFactory }) {
    this.systemContextBase = '/etc/nodejs/context';
    this.webXmlPath = webXmlPath || path.resolve(process.cwd(), 'conf/web.xml');
    this.contextXmlPath = contextXmlPath || this.getDefaultContextXmlPath();
    this.ldapFactory = ldapFactory || new LDAPFactory();
  }
  getDefaultContextXmlPath() {
    let contextXmlPath = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
    if (!fs.existsSync(contextXmlPath)) {
      const userName = process.env.USERNAME || process.env.USER;
      const appName = path.basename(process.cwd());
      contextXmlPath = `${this.systemContextBase}/${userName}/${appName}.xml`;
      if (!fs.existsSync(contextXmlPath)) {
        contextXmlPath = null;
      }
    }
    return contextXmlPath;
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
  async buildContext() {
    const context = {};
    const resourceResolver = await this.getResourceResolver();

    if (this.webXmlPath && fs.existsSync(this.webXmlPath)) {
      const webxml = fs.readFileSync(this.webXmlPath, 'utf8');
      const wxr = new WebXmlReader(webxml, resourceResolver);
      const values = await wxr.getValues();
      // console.log({ values });
      Object.assign(context, values);
    }

    if (this.contextXmlPath && fs.existsSync(this.contextXmlPath)) {
      const contextXml = fs.readFileSync(this.contextXmlPath, 'utf8');
      const cxr = new ContextXmlReader(contextXml);
      const values = await cxr.getValues();
      ContextFactory.assignExisting(context, values);
    }

    this.ldapFactory.close();

    return context;
  }

  static assignExisting(target, source) {
    for (var prop in source) {
      if (source.hasOwnProperty(prop) && target.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
  }
}

export default ContextFactory;
