const { buildContext, buildContextSync } = require('./context');
const ContextFactory = require('./ContextFactory');

module.exports = {
  ContextFactory: ContextFactory,
  buildContext: buildContext,
  buildContextSync: buildContextSync
};
