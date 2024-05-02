const { hiddenDebug } = require('./helpers/DebugHelper');

async function getResourceResolver(ldapFactory) {
  const ldapResource = await ldapFactory.getLDAPResource();
  const ldapPrefix = process.env.LDAPPREFIX;
  hiddenDebug('icontext', 'ldapPrefix = %s', ldapPrefix);

  async function resourceResolver(name) {
    if (ldapPrefix) {
      name = ldapPrefix + '.' + name;
    }
    const value = await ldapResource.lookup(name);
    hiddenDebug('icontext', 'ldapResource.lookup(%s) = %s', name, value);
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
    // cleanup unresolved (null values), becose dotenvExpand fails on null values
    if (values[prop] === null) {
      delete values[prop];
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
  if (ldapFactory.isConfigured()) {
    const resourceResolver = await getResourceResolver(ldapFactory);
    await valueResolver(values, resourceResolver);
  }
  return values;
}

module.exports = { ldapResolver };
