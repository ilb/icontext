import { parseContextXml } from '../src/ContextXmlReader.cjs';
import * as path from 'path';
import * as fs from 'fs';

test('parses context.xml', async () => {
  const contextPath = path.resolve('test/context.xml');

  const expected = {
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    '.apps.testapp2.db': 'postgresql://localhost/testapp',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'apps.testapp.db_PASSWORD': 'db_password_here'
  };
  const contextXml = fs.readFileSync(contextPath);
  const values = parseContextXml(contextXml);
  expect(values).toStrictEqual(expected);
});
