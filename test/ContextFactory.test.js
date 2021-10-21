import ContextFactory from '../src/ContextFactory';
import * as path from 'path';
// import * as fs from 'fs';
import LDAPFactory from '@ilb/node_ldap';

process.env.LDAPPREFIX = 'ru.bystrobank';

test('buildContext', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, ldapFactory });
  const context = await contextFactory.buildContext();
  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp.db_PASSWORD': null,
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'ru.bystrobank.apps.workflow.ws': 'https://devel.net.ilb.ru/workflow-web/web'
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
    'apps.testapp.db_PASSWORD': null,
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'ru.bystrobank.apps.workflow.ws': 'https://devel.net.ilb.ru/workflow-web/web'
  };
  expect(context).toStrictEqual(expected);
});

test('buildContextWithoutLdap', async () => {
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
    'apps.testapp.db_PASSWORD': null,
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'ru.bystrobank.apps.workflow.ws': '!LDAP not configured!'
  };

  const context = await contextFactory.buildContext();
  expect(context).toStrictEqual(expected);
});

test('getDefaultContextXmlPath', async () => {
  const contextFactory = new ContextFactory({});
  process.env.HOME = path.resolve('test/home');
  let expected = path.resolve(path.join(process.env.HOME, '.config/context.xml'));
  expect(contextFactory.getDefaultContextXmlPath()).toStrictEqual(expected);
  process.env.HOME = path.resolve('nonexistent');
  contextFactory.systemContextBase = path.resolve('test/systemcontext');
  process.env.USERNAME = 'testuser';
  expected = path.resolve('test/systemcontext/testuser/testuser.xml');
  expect(contextFactory.getDefaultContextXmlPath()).toStrictEqual(expected);
});
