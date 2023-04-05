const { parseValue } = require('../src/parseValue.js');

test('parseValue', () => {
  expect(parseValue('java.lang.String', 'string')).toStrictEqual('string');
  expect(parseValue('java.lang.Queue', 'string')).toStrictEqual('string');
  expect(parseValue('java.lang.Boolean', 'true')).toStrictEqual(true);
  expect(parseValue('java.lang.Boolean', 'false')).toStrictEqual(false);
  expect(parseValue('java.lang.Integer', '10')).toStrictEqual(10);
  expect(parseValue('java.lang.Float', '10')).toStrictEqual(10);
});
