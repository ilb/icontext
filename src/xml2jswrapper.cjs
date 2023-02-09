const parseString = require('xml2js').parseString;
/**
 * static wrapper for xml2js
 * @param {*} xml source xml
 * @returns result json
 */
function xml2jswrapper(xml) {
  let result = null;
  parseString(xml, function (err, res) {
    if (err) {
      throw new Error(err);
    }
    result = res;
  });
  return result;
}

module.exports = { xml2jswrapper };
