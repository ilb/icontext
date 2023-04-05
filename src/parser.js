const PARSERS = {
  'java.lang.String': (value) => value,
  'javax.jms.Queue': (value) => value,
  'java.lang.Boolean': parseBoolean,
  'java.lang.Integer': (value) => Number(value),
  'java.lang.Float': (value) => Number(value)
};

function parseBoolean(value) {
  if (['true', 'false'].indexOf(value) === -1) {
    throw new Error(`value = ${value} for Boolean invalid`);
  }
  return value === 'true';
}
function parseValue(type, value) {
  if (PARSERS[type]) {
    return PARSERS[type](value);
  }
  throw new Error(`Type ${type} unsupported. Suppported types: ${Object.keys(PARSERS)}`);
}

module.exports = { parseValue };
