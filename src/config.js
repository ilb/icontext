const { buildContextSync } = require('./context-sync.js');
const { execJsFile, assignNotExisting } = require('./utils.js');

const context = buildContextSync();
assignNotExisting(process.env, context);
execJsFile(this.envJsPath);
