const createDebug = require('debug');
const debug = createDebug('node_context');

async function getResourceResolver(ldapFactory) {
  if (!ldapFactory.isConfigured()) {
    return () => '!LDAP not configured!';
  }
  const ldapResource = await ldapFactory.getLDAPResource();
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
 * resolve all undefined values with resolver function
 * @param {*} values
 * @param {*} resourceResolver
 * @returns
 */
async function valueResolver(values, resourceResolver) {
  for (const prop in values) {
    if (values[prop] === undefined) {
      values[prop] = await resourceResolver(prop);
    }
  }
  return values;
}

/**
 * resolve values using LDAP
 * @param {*} values
 * @param {*} ldapFactory
 */
async function ldapResolver(values, ldapFactory) {
  const resourceResolver = await getResourceResolver(ldapFactory);
  await valueResolver(values, resourceResolver);
  return values;
}

module.exports = { getResourceResolver, valueResolver, ldapResolver };
