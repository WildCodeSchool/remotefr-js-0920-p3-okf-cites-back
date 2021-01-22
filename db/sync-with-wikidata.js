const axios = require('axios');
const knex = require('./knex');
const { Semaphore } = require('../utils');

function getSPARQLQuery(entityId) {
  return `SELECT ?common_name_fr ?common_name_en ?wikipedia_url ?image_url WHERE {
        BIND(wd:${entityId} AS ?item)
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
  const common_name_fr = data.results?.bindings?.[0]?.common_name_fr?.value;
  const common_name_en = data.results?.bindings?.[0]?.common_name_en?.value;
  const image_url = data.results?.bindings?.[0]?.image_url?.value;
  const wikipedia_url = data.results?.bindings?.[0]?.wikipedia_url?.value;

  // Only update db if at least one value is not undefined
  // prettier-ignore
  if ([common_name_fr, common_name_en, image_url, wikipedia_url].some((val) => val != null)) {
    await knex('species')
      .update({
        common_name_fr,
        common_name_en,
        wikipedia_url,
        image_url,
      })
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
        .whereNull('common_name_fr')
        .orWhereNull('common_name_en')
        .orWhereNull('wikipedia_url')
        .orWhereNull('image_url');
    })
    .select(['id', 'wikidata_id']);

  const semaphore = new Semaphore(5); // Wikidata is rate limited to 5 queries at a time
  const fetchWithSemaphore = async (species) => {
    await semaphore.acquire();
    try {
      await fetchAndUpdateSpecies(species);
    } catch (err) {
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
}

module.exports = syncWithWikidata;
