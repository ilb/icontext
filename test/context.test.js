const { buildContext, buildContextSync } = require('../src/context');
const path = require('path');

test('buildContext', async () => {
  process.env.CONTEXT_WEBXML = path.resolve('test/web2.xml');
  process.env.CONTEXT_CONTEXTXML = path.resolve('test/context.xml');
  const context = await buildContext();
  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp.fix': null
  };
  expect(context).toStrictEqual(expected);
});

test('buildContextSync', async () => {
  process.env.CONTEXT_WEBXML = path.resolve('test/web2.xml');
  process.env.CONTEXT_CONTEXTXML = path.resolve('test/context.xml');
  const context = buildContextSync();
  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp.fix': null
  };
  expect(context).toStrictEqual(expected);
});
