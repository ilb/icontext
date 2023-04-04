const fs = require('fs');

function execJsFile(envJsPath) {
  if (envJsPath && fs.existsSync(envJsPath)) {
    //  await import(this.envJsPath);
    const envJs = fs.readFileSync(envJsPath, 'utf8');
    eval(envJs);
  }
}

/**
 * copies all properties from source which does NOT exists in target
 * @param {*} target
 * @param {*} source
 */
function assignNotExisting(target, source) {
  for (const prop in source) {
    if (target[prop] === undefined) {
      target[prop] = source[prop];
    }
  }
}
function removeDot(source) {
  const target = {};
  for (const prop in source) {
    target[prop.startsWith('.') ? prop.substring(1) : prop] = source[prop];
  }
  return target;
}
module.exports = { execJsFile, assignNotExisting, removeDot };
