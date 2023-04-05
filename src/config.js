const { buildContextSync } = require('./context');

const context = buildContextSync();
Object.assign(process.env, context);
