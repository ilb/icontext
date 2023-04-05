const { execJsFile, assignNotExisting } = require('./utils.js');
const { buildContext } = require('./context');
const createDebug = require('debug');
const debug = createDebug('node_context');

class ContextFactory {
  constructor(options) {
    this.options = options;
    debug('options', options);
  }

  /**
   * Method populates process.env
   * @returns {undefined}pop
   */
  async build(options = {}) {
    const context = await this.buildContext(options);
    assignNotExisting(process.env, context);
    execJsFile(this.options.envJsPath);
    return context;
  }

  /**
   * Method builds context with values read =require( web.xml and context.xml
   * context.xml values have higher priority
   * @returns {undefined}
   */
  async buildContext() {
    return buildContext(this.options);
  }
}

module.exports = ContextFactory;
