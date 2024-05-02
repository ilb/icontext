/**
 * The method hides key arguments from secretKeys
 * @param {Function} debug
 * @param  {...any} args
 * @returns {Array}
 */
async function hiddenDebug(debug, ...args) {
  const secretKeys = ['_PASSWORD']
  function replacer(key, value) {
    if (secretKeys.some((k) => key.includes(k))) {
      return "*****";
    };
    return value;
  };
  return debug(...(args.map(obj => JSON.parse(JSON.stringify(obj, replacer)))));
};

module.exports = { hiddenDebug }