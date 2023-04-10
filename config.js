const { buildSync } = require('./src/context');

const context = buildSync();
Object.assign(process.env, context);
