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
        "VARCHAR(510) AS (CONCAT_WS(' ', genus, species, subspecies))",
      );
      table.specificType(
        'common_name',
        'VARCHAR(255) AS (COALESCE(common_name_fr, common_name_en))',
      );
      table.string('common_name_fr');
      table.string('common_name_en');
      table.string('author');
      table.string('listing');
      table.enum('cites', ['I', 'II', 'I/II', 'III', '?']);
      table.integer('species+_id').unique();
      table.string('wikidata_id').unique();
      table.string('wikipedia_url', 2000);
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
