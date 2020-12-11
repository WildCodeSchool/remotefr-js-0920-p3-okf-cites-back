const path = require('path');
const config = require('../config');

module.exports = {
  client: 'mysql2',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, './migrations/'),
  },
};
