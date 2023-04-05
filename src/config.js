const { contextSync } = require('./context-sync.js');
const { execJsFile, assignNotExisting } = require('./utils.js');

const context = contextSync();
assignNotExisting(process.env, context);
execJsFile(this.envJsPath);
console.log(context);
