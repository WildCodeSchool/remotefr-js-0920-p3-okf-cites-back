const axios = require('axios');
const knex = require('./knex');
const { Semaphore } = require('../utils');

function getSPARQLQuery(entityId) {
  return `SELECT ?species_plus_id ?common_name_fr ?common_name_en ?wikipedia_url ?image_url WHERE {
        BIND(wd:${entityId} AS ?item)
        OPTIONAL {
          ?item wdt:P2040 ?species_plus_id
        }
        OPTIONAL {
          ?item wdt:P1843 ?common_name_fr.
          FILTER((LANG(?common_name_fr)) = "fr")
        }
        OPTIONAL {
          ?item wdt:P1843 ?common_name_en.
          FILTER((LANG(?common_name_en)) = "en")
        }
        OPTIONAL { ?item wdt:P18 ?image_url. }
        OPTIONAL {
          ?wikipedia_url schema:about ?item;
            schema:inLanguage "fr".
          FILTER((SUBSTR(STR(?wikipedia_url), 1 , 25 )) = "https://fr.wikipedia.org/")
        }
        
      }
      LIMIT 1`;
}

async function fetchAndUpdateSpecies(species) {
  const { data } = await axios.get('https://query.wikidata.org/sparql', {
    params: {
      query: getSPARQLQuery(species.wikidata_id),
      format: 'json',
    },
  });

  /* eslint-disable camelcase */
  const species_plus_id = data.results?.bindings?.[0]?.species_plus_id?.value;
  const common_name_fr = data.results?.bindings?.[0]?.common_name_fr?.value;
  const common_name_en = data.results?.bindings?.[0]?.common_name_en?.value;
  const image_url = data.results?.bindings?.[0]?.image_url?.value;
  const wikipedia_url = data.results?.bindings?.[0]?.wikipedia_url?.value;

  const updateData = {
    'species+_id': species_plus_id,
    common_name_fr,
    common_name_en,
    wikipedia_url,
    image_url,
  };
  // Remove null and undefined values
  const updateDataFiltered = Object.fromEntries(
    Object.entries(updateData).filter(([, val]) => val != null),
  );

  // Only update db if non null value is available
  if (Object.keys(updateDataFiltered).length) {
    await knex('species')
      .update(updateDataFiltered)
      .where('id', '=', species.id);
  }
  /* eslint-enable camelcase */
}

async function syncWithWikidata() {
  console.log('Syncing database with wikidata');
  console.time('sync time');

  const speciesWithMissingData = await knex('species')
    .whereNotNull('wikidata_id')
    .where((builder) => {
      builder
        .whereNull('species+_id')
        .orWhereNull('common_name_fr')
        .orWhereNull('common_name_en')
        .orWhereNull('wikipedia_url')
        .orWhereNull('image_url');
    })
    .select(['id', 'wikidata_id']);

  const idsWithError = [];
  const semaphore = new Semaphore(5); // Wikidata is rate limited to 5 queries at a time
  const fetchWithSemaphore = async (species) => {
    await semaphore.acquire();
    try {
      await fetchAndUpdateSpecies(species);
    } catch (err) {
      idsWithError.push(species.id);

      console.error(
        `Error while updating species ${species.id} (${species.wikidata_id})`,
        err,
      );
    } finally {
      semaphore.release();
    }
  };
  await Promise.all(speciesWithMissingData.map(fetchWithSemaphore));

  console.log('Syncing database with wikidata done');
  console.timeEnd('sync time');

  if (idsWithError.length > 0) {
    console.error('Error on species with ids', idsWithError);
  }
}

module.exports = syncWithWikidata;
