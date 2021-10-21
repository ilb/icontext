import ContextFactory from './ContextFactory';
const contextFactory = new ContextFactory({});
await contextFactory.buildContext();

export default contextFactory;

