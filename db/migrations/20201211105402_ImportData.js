const fs = require('fs');
const path = require('path');

exports.up = async function up(knex) {
  // eslint-disable-next-line no-console
  console.warn(
    "You might need to increase 'max_allowed_packet' in mysql's config for this migration to work.",
  );

  await knex.raw(
    fs.readFileSync(path.join(__dirname, '../insert-data.sql')).toString(),
  );
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
