const syncWithWikidata = require('../db/sync-with-wikidata');

syncWithWikidata().then(() => {
  process.exit(0);
});
