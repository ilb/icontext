const { buildContext, buildContextSync } = require('./context');
const ContextFactory = require('./ContextFactory');

module.exports = {
  default: ContextFactory,
  buildContext: buildContext,
  buildContextSync: buildContextSync
};
