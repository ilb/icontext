const { buildContextSync } = require('./src/context');

const context = buildContextSync();
Object.assign(process.env, context);
