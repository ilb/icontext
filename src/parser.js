const PARSERS = {
  'java.lang.String': (value) => value,
  'java.lang.Boolean': parseBoolean,
  'java.lang.Integer': (value) => Number(value),
  'java.lang.Float': (value) => Number(value),
  'java.net.URL': (value) => (context) => parseUrl(value, context)
};
function parseValue(type, value) {
  if (PARSERS[type]) {
    return PARSERS[type](value);
  }
  throw new Error(`Type ${type} unsupported. Suppported types: ${Object.keys(PARSERS)}`);
}

/**
 * moves login and password after schema
 * url like ${apps.testapp.db_user}:${apps.testapp.db_PASSWORD}@${apps.testapp.db}
 * gets resolved using context to testapp:db_password_here@mysql://localhost/testapp
 * then translated to valid url mysql://testapp:db_password_here@localhost/testapp
 * @param {*} value pseudo-url with login/pass before schema
 * @returns valid url
 */
function parseUrl(value, context) {
  value = value.replace(/\$\{(.+?)\}/g, (match, tag) => context[tag.trim()]);

  const bs = value.indexOf('@');
  const es = value.indexOf('://');
  if (bs > -1 && es > bs) {
    const begSchema = bs + 1;
    const endSchema = es + 3;
    value =
      value.substring(begSchema, endSchema) +
      value.substring(0, begSchema) +
      value.substring(endSchema);
  }
  return value;
}
function parseBoolean(value) {
  if (['true', 'false'].indexOf(value) === -1) {
    throw new Error(`value = ${value} for Boolean invalid`);
  }
  return value === 'true';
}

module.exports = { parseValue };
