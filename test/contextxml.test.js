const { parseContextXml } = require('../src/contextxml.js');
const path = require('path');
const fs = require('fs');
test('parses context.xml', async () => {
  const contextPath = path.resolve('test/context.xml');

  const expected = {
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'apps.testapp.db_PASSWORD': 'db_password_here',
    'apps.testapp.ws': 'url'
  };
  const contextXml = fs.readFileSync(contextPath);
  const values = parseContextXml(contextXml);
  values['apps.testapp.certfile'] = values['apps.testapp.certfile']({});
  values['apps.testapp.cert_PASSWORD'] = values['apps.testapp.cert_PASSWORD']({});
  values['apps.testapp.db_PASSWORD'] = values['apps.testapp.db_PASSWORD']({});
  values['apps.testapp.ws'] = values['apps.testapp.ws']({});
  expect(values).toStrictEqual(expected);
});
