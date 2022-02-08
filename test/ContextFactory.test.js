import ContextFactory from '../src/ContextFactory';
import path from 'path';
import LDAPFactory from '@ilb/node_ldap';

process.env.LDAPPREFIX = 'ru.bystrobank';

test('buildContext', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const envJsPath = path.resolve('test/.env.js');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, envJsPath, ldapFactory });
  const context = await contextFactory.buildContext();
  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp2.db': 'postgresql://localhost/testapp',
    'apps.testapp.db_PASSWORD': 'db_password_here',
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'ru.bystrobank.apps.workflow.ws': 'https://devel.net.ilb.ru/workflow-web/web'
  };
  expect(context).toStrictEqual(expected);
});

test('buildContext2', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web2.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, ldapFactory });
  const context = await contextFactory.buildContext();
  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp'
  };
  expect(context).toStrictEqual(expected);
});
test('buildContextKeepDot', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, ldapFactory });
  const context = await contextFactory.buildContext({ keepDot: true });
  const expected = {
    '.apps.testapp.db': 'mysql://localhost/testapp',
    '.apps.testapp2.db': 'postgresql://localhost/testapp',
    'apps.testapp.db_PASSWORD': 'db_password_here',
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'ru.bystrobank.apps.workflow.ws': 'https://devel.net.ilb.ru/workflow-web/web'
  };
  expect(context).toStrictEqual(expected);
});

test('buildContextWithoutLdap', async () => {
  delete process.env.LDAP_URL;
  const ldapFactory = new LDAPFactory('/nonexistent.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');

  const contextFactory = new ContextFactory({
    webXmlPath,
    contextXmlPath,
    ldapFactory
  });

  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp2.db': 'postgresql://localhost/testapp',
    'apps.testapp.db_PASSWORD': 'db_password_here',
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'ru.bystrobank.apps.workflow.ws': '!LDAP not configured!'
  };

  const context = await contextFactory.buildContext();
  expect(context).toStrictEqual(expected);
});

test('build', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  process.env['apps.testapp2.db'] = 'postgresql://localhost/testapp2';
  const envJsPath = path.resolve('test/.env.js');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, envJsPath, ldapFactory });
  await contextFactory.build();
  expect(process.env['apps.testapp.db']).toStrictEqual('mysql://localhost/testapp');
  expect(process.env['apps.testapp2.db']).toStrictEqual('postgresql://localhost/testapp2');
  expect(process.env['DATABASE_URL']).toStrictEqual(
    'mysql://testapp:db_password_here@localhost/testapp'
  );
});

test('getDefaultContextXmlPath', async () => {
  const contextFactory = new ContextFactory({});
  process.env.HOME = path.resolve('test/home');
  let expected = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
  expect(contextFactory.getDefaultContextXmlPath()).toStrictEqual(expected);
  process.env.HOME = path.resolve('nonexistent');
  contextFactory.systemContextBase = path.resolve('test/systemcontext');
  process.env.USERNAME = 'testuser';
  expected = path.resolve('test/systemcontext/testuser/node_context.xml');
  expect(contextFactory.getDefaultContextXmlPath()).toStrictEqual(expected);
});
