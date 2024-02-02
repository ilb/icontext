const { parseWebXml } = require('../src/webxml.js');
const fs = require('fs');
const path = require('path');

const contextPath = path.resolve('test/web.xml');

test('parses context.xml', async () => {
  const expected = {
    'apps.testapp.ws': undefined,
    'apps.testapp.db': undefined,
    'apps.testapp.db_PASSWORD': null,
    'apps.testapp.db_user': 'testapp',
    DATABASE_URL: expect.anything(),
    DATABASE_URL_MSSQL: expect.anything(),
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': null
  };
  const webxml = fs.readFileSync(contextPath);
  const values = parseWebXml(webxml);
  expect(values).toStrictEqual(expected);
});
