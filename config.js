const path = require('path');

require('dotenv').config({ path: path.join(__dirname, './.env') });

// Feel free to add your own settings,
// e.g. DB connection settings
module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    mysqldumpCommand: process.env.MYSQLDUMP_COMMAND || 'mysqldump',
  },
};
