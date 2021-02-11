// Use npm run sync-with-wikidata instead

/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');
const knex = require('../db/knex');

// From https://gist.github.com/Gericop/e33be1f201cf242197d9c4d0a1fa7335
class Semaphore {
  constructor(max) {
    let counter = 0;
    let waiting = [];

    const take = function () {
      if (waiting.length > 0 && counter < max) {
        counter++;
        const promise = waiting.shift();
        promise.resolve();
      }
    };

    this.acquire = function () {
      if (counter < max) {
        counter++;
        return new Promise((resolve) => {
          resolve();
        });
      }
      return new Promise((resolve, err) => {
        waiting.push({ resolve, err });
      });
    };

    this.release = function () {
      counter--;
      take();
    };

    this.purge = function () {
      const unresolved = waiting.length;

      for (let i = 0; i < unresolved; i++) {
        waiting[i].err('Task has been purged.');
      }

      counter = 0;
      waiting = [];

      return unresolved;
    };
  }
}

const nameWikidataIds = {};
fs.createReadStream(path.join(__dirname, './wikidata_id_name.csv'))
  .pipe(csv())
  .on('data', (data) => {
    nameWikidataIds[data.name] = data.id;
  })
  .on('end', async () => {
    const allSpecies = await knex('species')
      .whereNull('wikidata_id')
      .whereNull('subspecies')
      .select({ id: 'id', name: knex.raw('LOWER(name)') });

    const semaphore = new Semaphore(5);
    let count = 0;
    async function fetchWikidata(species) {
      await semaphore.acquire();

      console.log(`${++count}/${allSpecies.length}`);

      const wikidataId = nameWikidataIds[species.name];
      if (wikidataId != null) {
        const url = `https://query.wikidata.org/sparql?query=SELECT%20%3Fcommon_name_fr%20%3Fcommon_name_en%20%3Farticle%20%3Fimage_url%20WHERE%20%7B%0A%20%20BIND(wd%3A${wikidataId}%20AS%20%3Fitem)%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Fitem%20wdt%3AP1843%20%3Fcommon_name_fr.%0A%20%20%20%20FILTER((LANG(%3Fcommon_name_fr))%20%3D%20%22fr%22)%0A%20%20%7D%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Fitem%20wdt%3AP1843%20%3Fcommon_name_en.%0A%20%20%20%20FILTER((LANG(%3Fcommon_name_en))%20%3D%20%22en%22)%0A%20%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fitem%20wdt%3AP18%20%3Fimage_url.%20%7D%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Farticle%20schema%3Aabout%20%3Fitem%3B%0A%20%20%20%20%20%20schema%3AinLanguage%20%22fr%22.%0A%20%20%20%20FILTER((SUBSTR(STR(%3Farticle)%2C%201%20%2C%2025%20))%20%3D%20%22https%3A%2F%2Ffr.wikipedia.org%2F%22)%0A%20%20%7D%0A%20%20%0A%7D%0ALIMIT%201&format=json`;
        const res = (await axios.get(url)).data;

        const common_name_fr =
          res.results?.bindings?.[0]?.common_name_fr?.value;
        const common_name_en =
          res.results?.bindings?.[0]?.common_name_en?.value;
        const image_url = res.results?.bindings?.[0]?.image_url?.value;
        const wikipedia_url = res.results?.bindings?.[0]?.article?.value;

        await knex('species')
          .update({
            wikidata_id: wikidataId,
            common_name_fr,
            common_name_en,
            wikipedia_url,
            image_url,
          })
          .where('id', '=', species.id);
      }

      semaphore.release();
    }

    await Promise.all(allSpecies.map(fetchWikidata));
  });
