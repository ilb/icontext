import { parseWebXml } from '../src/WebXmlReader.cjs';
import * as fs from 'fs';
import * as path from 'path';

const contextPath = path.resolve('test/web.xml');

test('parses context.xml', async () => {
  const expected = {
    '.apps.testapp.db': 'mysql://localhost/testapp',
    '.apps.testapp2.db': null,
    'apps.testapp.db_PASSWORD': null,
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': null,
    'ru.bystrobank.apps.workflow.ws': undefined
  };
  const webxml = fs.readFileSync(contextPath);
  const values = parseWebXml(webxml);
  expect(values).toStrictEqual(expected);
});
