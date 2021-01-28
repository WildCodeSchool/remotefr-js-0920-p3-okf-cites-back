/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const knex = require('../db/knex');
const { Semaphore } = require('../utils');

async function main() {
  const speciesPlusData = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        'cites_listings_2021-01-27 09_29_comma_separated.json',
      ),
    ),
  );
  const speciesPlusByName = speciesPlusData.reduce((obj, species) => {
    obj[species['Scientific Name'].toLowerCase()] = {
      id: species.Id,
      cites: species.Listing,
    };
    return obj;
  }, {});

  const speciesWithMissingSpeciesPlusId = await knex('species')
    .whereNull('species+_id')
    .orWhere('cites', '=', '?')
    .select('id', 'name');

  const semaphore = new Semaphore(20);

  await Promise.all(
    speciesWithMissingSpeciesPlusId.map(async (species) => {
      const name = species.name.toLowerCase();

      const speciesPlus = speciesPlusByName[name];
      if (speciesPlus != null) {
        await semaphore.acquire();
        try {
          console.log(`Found species+_id for ${name}`);

          await knex('species')
            .update({
              'species+_id': speciesPlus.id,
              cites: speciesPlus.cites,
            })
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
