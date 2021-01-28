/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const knex = require('../db/knex');
const { Semaphore } = require('../utils');

async function main() {
  const speciesPlus = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        'cites_listings_2021-01-27 09_29_comma_separated.json',
      ),
    ),
  );
  const speciesPlusIdByName = speciesPlus.reduce((obj, species) => {
    obj[species['Scientific Name'].toLowerCase()] = species.Id;
    return obj;
  }, {});

  const speciesWithMissingSpeciesPlusId = await knex('species')
    .whereNull('species+_id')
    .select('id', 'name', 'subspecies');

  const semaphore = new Semaphore(20);

  await Promise.all(
    speciesWithMissingSpeciesPlusId.map(async (species) => {
      let name = species.name.toLowerCase();
      if (species.subspecies != null) {
        name += ` ${species.subspecies}`.toLowerCase();
      }

      const speciesPlusId = speciesPlusIdByName[name];
      if (speciesPlusId != null) {
        await semaphore.acquire();
        try {
          console.log(`Found species+_id for ${name}`);

          await knex('species')
            .update({ 'species+_id': speciesPlusId })
            .where('id', '=', species.id);
        } finally {
          await semaphore.release();
        }
      }
    }),
  );

  process.exit(0);
}
main();
