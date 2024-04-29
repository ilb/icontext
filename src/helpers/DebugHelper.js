/**
 * The method hides key arguments from secretKeys
 * @param  {...any} args
 * @returns {Array}
 */
async function hiding(...args) {
  const secretKeys = ['_PASSWORD']
  function replacer(key, value) {
    if (secretKeys.some((k) => key.includes(k))) {
      return "*****";
    };
    return value;
  };
  return args.map(obj => JSON.parse(JSON.stringify(obj, replacer)));
};

module.exports = { hiding }