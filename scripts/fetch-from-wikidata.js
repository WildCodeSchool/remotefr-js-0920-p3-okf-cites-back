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
        const url = `https://query.wikidata.org/sparql?query=SELECT%20%3Fcommon_name%20%3Fimage_url%20WHERE%20%7B%0A%20%20OPTIONAL%20%7B%20wd%3A${wikidataId}%20wdt%3AP1843%20%3Fcommon_name.%20%7D%0A%20%20OPTIONAL%20%7B%20wd%3A${wikidataId}%20wdt%3AP18%20%3Fimage_url.%20%7D%0A%20%20FILTER((LANG(%3Fcommon_name))%20%3D%20%22fr%22)%0A%7D%20LIMIT%201&format=json`;
        const res = (await axios.get(url)).data;

        const commonName = res.results?.bindings?.[0]?.common_name?.value;
        const imageUrl = res.results?.bindings?.[0]?.image_url?.value;

        await knex('species')
          .update({
            wikidata_id: wikidataId,
            common_name: commonName,
            image_url: imageUrl,
          })
          .where('id', '=', species.id);
      }

      semaphore.release();
    }

    await Promise.all(allSpecies.map(fetchWikidata));
  });
