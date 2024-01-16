const { parseValue } = require('../src/parser.js');

test('parseValue', async () => {
  expect(parseValue('java.lang.String', 'string')({})).toStrictEqual('string');
  const contextString = {};
  contextString['apps.testapp.db_user'] = 'testapp';
  contextString['apps.testapp.db_PASSWORD'] = 'db_password_here';
  contextString['apps.testapp.db'] = 'sqlserver://localhost;database=db_name';
  expect(
    parseValue(
      'java.lang.String',
      '${apps.testapp.db};user=${apps.testapp.db_user};password=${apps.testapp.db_PASSWORD};encrypt=true;integratedSecurity=false;trustServerCertificate=true'
    )(contextString)
  ).toStrictEqual('sqlserver://localhost;database=db_name;user=testapp;password=db_password_here;encrypt=true;integratedSecurity=false;trustServerCertificate=true');
  expect(parseValue('java.lang.Boolean', 'true')).toStrictEqual(true);
  expect(parseValue('java.lang.Boolean', 'false')).toStrictEqual(false);
  expect(() => parseValue('java.lang.Boolean', 'ttt')).toThrow('invalid');
  expect(parseValue('java.lang.Integer', '10')).toStrictEqual(10);
  expect(parseValue('java.lang.Float', '10')).toStrictEqual(10);
  const context = {};
  context['apps.testapp.db_user'] = 'testapp';
  context['apps.testapp.db_PASSWORD'] = 'db_password_here';
  context['apps.testapp.db'] = 'mysql://localhost/testapp';
  expect(
    parseValue(
      'java.net.URL',
      '${apps.testapp.db_user}:${apps.testapp.db_PASSWORD}@${apps.testapp.db}'
    )(context)
  ).toStrictEqual('mysql://testapp:db_password_here@localhost/testapp');
});
