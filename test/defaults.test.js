const defaults = require('../src/defaults.js');
const path = require('path');

test('getDefaultContextXmlPath', async () => {
  process.env.HOME = path.resolve('test/home');
  let expected = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
  expect(defaults.getDefaultContextXmlPath()).toStrictEqual(expected);
  process.env.HOME = path.resolve('nonexistent');
  process.env.USERNAME = 'testuser';
  expected = path.resolve('test/systemcontext/testuser/icontext.xml');
  expect(defaults.getDefaultContextXmlPath(path.resolve('test/systemcontext'))).toStrictEqual(
    expected
  );
});
