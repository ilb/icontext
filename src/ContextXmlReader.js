import PropertyReader from './PropertyReader.js';
import ValueParser from './ValueParser.js';
import xml2js from 'xml2js-es6-promise';

class ContextXmlReader extends PropertyReader {
  constructor(src) {
    super();
    this.src = src;
    this.values = null;
  }

  static async parse(src) {
    //var xml2js = require('xml2js-es6-promise');

    const sourceConfig = await xml2js(src);
    const parsedConfig = {};
    if (sourceConfig.Context && sourceConfig.Context.Environment) {
      sourceConfig.Context.Environment.forEach((environment) => {
        const val = ContextXmlReader.getEnvironmentValue(environment);
        parsedConfig[val.name] = val.value;
      });
    }
    return parsedConfig;
  }
  static getEnvironmentValue(environment) {
    if (environment.$.name === undefined) {
      throw new Error('incorrect Environment entry: name required ' + JSON.stringify(environment));
    }
    if (environment.$.type === undefined) {
      throw new Error('incorrect Environment entry: type required ' + JSON.stringify(environment));
    }
    if (environment.$.value === undefined) {
      throw new Error('incorrect Environment entry: value required ' + JSON.stringify(environment));
    }

    const type = environment.$.type.toString().trim();
    const name = environment.$.name.toString().trim();
    const rawValue = environment.$.value.toString().trim();

    if (name.length === 0) {
      throw new Error('incorrect Environment entry: name empty ' + JSON.stringify(environment));
    }

    if (type.length === 0) {
      throw new Error('incorrect Environment entry: type empty ' + JSON.stringify(environment));
    }

    if (rawValue.length === 0) {
      throw new Error('incorrect Environment entry: value empty ' + JSON.stringify(environment));
    }

    const value = ValueParser.parseValue(type, rawValue);
    //console.log(rawValue, type, value);
    return { name, value };
  }

  async getValues() {
    if (this.values === null) {
      this.values = ContextXmlReader.parse(this.src);
    }
    return this.values;
  }
}

export default ContextXmlReader;
