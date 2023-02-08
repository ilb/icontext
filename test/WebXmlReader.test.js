import WebXmlReader from '../src/WebXmlReader';
import * as fs from 'fs';
import * as path from 'path';

const contextPath = path.resolve('test/web.xml');

test('parses context.xml', async () => {
  const wxr = new WebXmlReader(fs.readFileSync(contextPath));

  const expected = {
    '.apps.testapp.db': 'mysql://localhost/testapp',
    '.apps.testapp2.db': null,
    'apps.testapp.db_PASSWORD': null,
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': null,
    'ru.bystrobank.apps.workflow.ws': undefined
  };
  const values = await wxr.getValues();
  expect(values).toStrictEqual(expected);
});
