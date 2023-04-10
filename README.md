#icontext

# Usage
## Classic ContextFactory

```javascript
import { ContextFactory } from 'icontext';
const contextFactory = new ContextFactory({}); // single instance for application lifetime
await contextFactory.build(); // per request
```

## Sync call on application start

Add to script or `next.config.js`:
*Warining*: uses process.swapwnSync, in all possible cases *prefer async version* instead

```javascript
const { buildSync } = require('icontext');
buildSync();
```

### Using --require
```bash
node -r icontext/config script.js
```

## Migration from @ilb/node_context:
```
npm uninstall @ilb/node_context @ilb/node_ldap
npm install icontext
grep -Rl @ilb/node_context src|xargs sed -i "s^ContextFactory from '@ilb/node_context'^{ ContextFactory } from 'icontext'^"
```