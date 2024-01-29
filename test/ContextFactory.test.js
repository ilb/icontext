const ContextFactory = require('../src/ContextFactory.js');
const path = require('path');
const LDAPFactory = require('ildap');

process.env.LDAPPREFIX = 'com.iconicompany';

test('buildContextWithoutLdap', async () => {
  const ldapFactory = new LDAPFactory('/nonexistent.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  expect(ldapFactory.isConfigured()).toStrictEqual(false);

  const contextFactory = new ContextFactory({
    webXmlPath,
    contextXmlPath,
    ldapFactory
  });

  const expected = {
    DATABASE_URL: 'testapp:db_password_here@undefined',
    DATABASE_URL_MSSQL: 'undefined;user=testapp;password=db_password_here;encrypt=true;integratedSecurity=false;trustServerCertificate=true',
    'apps.testapp.db': undefined,
    'apps.testapp.db_PASSWORD': 'db_password_here',
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'apps.testapp.db_user': 'testapp',
    'apps.testapp.ws': 'url'
  };
  const context = await contextFactory.buildContext();
  ldapFactory.close();
  expect(context).toStrictEqual(expected);
});

test('buildContext', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const contextFactory = new ContextFactory({
    webXmlPath,
    contextXmlPath,
    ldapFactory
  });
  const context = await contextFactory.buildContext();
  ldapFactory.close();
  const expected = {
    DATABASE_URL: 'mysql://testapp:db_password_here@localhost/testapp',
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp.db_user': 'testapp',
    'apps.testapp.db_PASSWORD': 'db_password_here',
    'apps.testapp.certfile': '/etc/certs/testapp.pem',
    'apps.testapp.cert_PASSWORD': 'cert_pass_here',
    'apps.testapp.ws': 'http://localhost/testapp'
  };
  expect(context).toStrictEqual(expected);
});

test('buildContext2', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web2.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, ldapFactory });
  const context = await contextFactory.buildContext();
  ldapFactory.close();
  const expected = {
    'apps.testapp.db': 'mysql://localhost/testapp',
    'apps.testapp.fix': null
  };
  expect(context).toStrictEqual(expected);
});

test('buildContext3', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web3.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  const contextFactory = new ContextFactory({ webXmlPath, contextXmlPath, ldapFactory });
  await expect(contextFactory.buildContext()).rejects.toThrow('Boolean invalid');
  ldapFactory.close();
});

test('build', async () => {
  const ldapFactory = new LDAPFactory('test/ldap.conf');
  const webXmlPath = path.resolve('test/web.xml');
  const contextXmlPath = path.resolve('test/context.xml');
  process.env['apps.testapp2.db'] = 'postgresql://localhost/testapp2';
  const contextFactory = new ContextFactory({
    webXmlPath,
    contextXmlPath,
    ldapFactory
  });
  await contextFactory.build();
  ldapFactory.close();
  expect(process.env['apps.testapp.db']).toStrictEqual('mysql://localhost/testapp');
  expect(process.env['apps.testapp2.db']).toStrictEqual('postgresql://localhost/testapp2');
  expect(process.env['DATABASE_URL']).toStrictEqual(
    'mysql://testapp:db_password_here@localhost/testapp'
  );
});
