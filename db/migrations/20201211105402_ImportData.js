const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

exports.up = async function up(knex) {
  const gzipSql = fs.readFileSync(
    path.join(__dirname, '../insert-data.sql.gz'),
  );
  const sql = zlib.gunzipSync(gzipSql).toString();
  await knex.raw(sql);
};

exports.down = async function down(knex) {
  try {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    await knex('species').truncate();
    await knex('species_country').truncate();
    await knex('country').truncate();
  } finally {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  }
};
