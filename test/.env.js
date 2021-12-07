if (!process.env.DATABASE_URL && process.env['apps.testapp.db']) {
  const databaseUrl = new URL(process.env['apps.testapp.db']);
  if (!databaseUrl.username) {
    databaseUrl.username = 'testapp';
  }
  if (!databaseUrl.password) {
    databaseUrl.password = process.env['apps.testapp.db_PASSWORD'];
  }
  process.env.DATABASE_URL = databaseUrl.toString();
}
