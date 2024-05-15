const createDebug = require('debug');

/**
 * The method hides key arguments from secretKeys
 * @param {string} debugName
 * @param  {...any} args
 * @returns {Array}
 */
async function debug(debugName, ...args) {
  const debug = createDebug(debugName);
  const secretKeys = ['_PASSWORD'];
  const databaseUrl = ['DATABASE_URL'];
  function replacer(key, value) {
    if (secretKeys.some((k) => key.includes(k))) {
      return "*****";
    }
    if (databaseUrl.some((k) => key.includes(k))) {
      if (typeof value === 'string') {
        return value.replace((value.split(":")[2].split("@")[0]), "*****");
      };
    }
    return value;
  }
  return debug(...(args.map(obj => JSON.parse(JSON.stringify(obj, replacer)))));
};

module.exports = { debug }