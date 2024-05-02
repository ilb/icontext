const createDebug = require('debug');

/**
 * The method hides key arguments from secretKeys
 * @param {string} debugName
 * @param  {...any} args
 * @returns {Array}
 */
async function hiddenDebug(debugName, ...args) {
  const debug = createDebug(debugName)
  const secretKeys = ['_PASSWORD']
  function replacer(key, value) {
    if (secretKeys.some((k) => key.includes(k))) {
      return "*****";
    }
    return value;
  }
  return debug(...(args.map(obj => JSON.parse(JSON.stringify(obj, replacer)))));
};

module.exports = { hiddenDebug }