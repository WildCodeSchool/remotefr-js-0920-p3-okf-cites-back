module.exports.up = async function up(knex) {
  await knex.schema
    .createTable('species', (table) => {
      table.increments();
      table.string('kingdom');
      table.string('phylum');
      table.string('class');
      table.string('order');
      table.string('family');
      table.string('genus');
      table.string('species');
      table.string('subspecies');
      table.specificType(
        'name',
        "VARCHAR(510) AS (CONCAT(genus, ' ', species))",
      );
      table.string('common_name');
      table.string('author');
      table.string('listing');
      table.enum('cites', ['I', 'II', 'I/II', 'III']);
      table.string('wikidata_id');
      table.string('image_url', 2000);
    })
    .createTable('country', (table) => {
      table.increments();
      table.string('name');
      table.string('iso_code');
    })
    .createTable('species_country', (table) => {
      table.integer('species_id').unsigned().references('species.id');
      table.integer('country_id').unsigned().references('country.id');

      table.boolean('uncertain').notNullable().defaultTo(false);
      table
        .enum('type', [
          'native',
          'introduced',
          'reintroduced',
          'extinct',
          'uncertain',
        ])
        .notNullable();
    });
};

module.exports.down = async function down(knex) {
  await knex.schema
    .dropTable('species_country')
    .dropTable('country')
    .dropTable('species');
};
