import PropertyReader from './PropertyReader.js';
import { parseValue } from './ValueParser.cjs';
import xml2js from './xml2js.cjs';

class WebXmlReader extends PropertyReader {
  constructor(src, resourceResolver) {
    super();
    this.src = src;
    this.values = null;
    if (resourceResolver && typeof resourceResolver !== 'function') {
      throw new Error('resourceResolver should be function');
    }
    this.resourceResolver = resourceResolver;
  }
  static async parse(src, resourceResolver) {
    const config = xml2js(src);

    if (!config['web-app']) {
      throw new Error(`web.xml should contain web-app node`);
    }
    const result = {};
    if (config['web-app']['env-entry'] !== undefined) {
      config['web-app']['env-entry'].forEach((entry) => {
        const val = WebXmlReader.getEnvEntryValue(entry);
        result[val.name] = val.value;
      });
    }

    if (config['web-app']['resource-env-ref'] && resourceResolver) {
      for (const resource of config['web-app']['resource-env-ref']) {
        const val = WebXmlReader.getResourceEntryValue(resource);
        val.value = await resourceResolver(val.name);
        result[val.name] = val.value;
      }
    }
    return result;
  }
  static getEnvEntryValue(entry) {
    if (entry['env-entry-type'] === undefined) {
      throw new Error('env-entry-type missing, incorrect entry ' + JSON.stringify(entry));
    }
    if (entry['env-entry-name'] === undefined) {
      throw new Error('env-entry-name missing, incorrect entry ' + JSON.stringify(entry));
    }

    const type = entry['env-entry-type'].toString().trim();
    const name = entry['env-entry-name'].toString().trim();
    const rawValue =
      entry['env-entry-value'] !== undefined ? entry['env-entry-value'].toString().trim() : null;
    if (type.length === 0) {
      throw new Error('env-entry-type zero length, incorrect entry ' + JSON.stringify(entry));
    }
    if (name.length === 0) {
      throw new Error('env-entry-name missing, incorrect entry ' + JSON.stringify(entry));
    }
    const value = parseValue(type, rawValue);
    return { type, name, value };
  }
  static getResourceEntryValue(resource) {
    if (resource['resource-env-ref-type'] === undefined) {
      throw new Error(
        'incorrect resource: resource-env-ref-type required ' + JSON.stringify(resource)
      );
    }
    if (resource['resource-env-ref-name'] === undefined) {
      throw new Error(
        'incorrect resource: resource-env-ref-name required ' + JSON.stringify(resource)
      );
    }
    const type = resource['resource-env-ref-type'].toString().trim();
    const name = resource['resource-env-ref-name'].toString().trim();

    if (name.length === 0) {
      throw new Error(
        'incorrect resource: resource-env-ref-name empty ' + JSON.stringify(resource)
      );
    }
    return { type, name };
  }

  async getValues() {
    if (this.values === null) {
      this.values = WebXmlReader.parse(this.src, this.resourceResolver);
    }
    return this.values;
  }
}

export default WebXmlReader;
