const { parseValue } = require('./parser.js');
const { xml2jswrapper } = require('./xml2jswrapper.cjs');

function parseContextXml(src) {
  const sourceConfig = xml2jswrapper(src);
  const parsedConfig = {};
  if (sourceConfig.Context && sourceConfig.Context.Environment) {
    sourceConfig.Context.Environment.forEach((environment) => {
      const val = getEnvironmentValue(environment);

      if (val.name.startsWith('.')) {
        val.name = val.name.substring(1);
      }

      parsedConfig[val.name] = val.value;
    });
  }
  return parsedConfig;
}
function getEnvironmentValue(environment) {
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

  let value = parseValue(type, rawValue);
  const isVar = /\$\{(.+?)\}/g;
  if (type === 'java.lang.String' && !isVar.test(rawValue)) value = value();
  //console.log(rawValue, type, value);
  return { name, value };
}

module.exports = { parseContextXml };
