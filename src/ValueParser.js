function parseValue(type, rawValue) {
  let value = null;
  if (rawValue !== null) {
    switch (type) {
      case 'java.lang.String':
      case 'javax.jms.Queue':
        value = rawValue;
        break;
      case 'java.lang.Boolean':
        if (['true', 'false'].indexOf(rawValue) === -1) {
          throw new Error(`value = ${rawValue} for Boolean invalid`);
        }
        value = rawValue === 'true';
        break;
      case 'java.lang.Integer':
      case 'java.lang.Float':
        value = Number(rawValue);
        break;
      default:
        throw new Error(
          `Type ${type} unsupported. Suppported types: java.lang.String, java.lang.Boolean, java.lang.Integer, java.lang.Float`
        );
    }
  }
  return value;
}

module.exports = { parseValue };
