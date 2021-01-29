const express = require('express');
const knex = require('../db/knex');

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  const speciesQb = knex('species').limit(limit).offset(offset);
  const speciesCountQb = knex('species').count('*', { as: 'count' }).first();

  const [species, { count }] = await Promise.all([speciesQb, speciesCountQb]);

  return res.json({ species, total: count });
});

router.get('/missing-data', async (req, res) => {
  const { limit = 20 } = req.query;

  const speciesWithMissingData = await knex('species')
    .whereNotNull('wikidata_id')
    .where((builder) => {
      builder
        .whereNull('common_name_fr')
        .orWhereNull('common_name_en')
        .orWhereNull('wikipedia_url')
        .orWhereNull('image_url');
    })
    .limit(limit)
    .orderByRaw('RAND()');

  return res.json(speciesWithMissingData);
});

router.get('/stats', async (req, res) => {
  const baseQb = knex('species').select({
    total: knex.raw('COUNT(*)'),
    cites: knex.raw('CAST(SUM(cites = ?) AS SIGNED)', ['?']), // To stop knex/mysql from replacing the question mark
    image_url: knex.raw('CAST(SUM(ISNULL(image_url)) AS SIGNED)'),
    common_name_fr: knex.raw('CAST(SUM(ISNULL(common_name_fr)) AS SIGNED)'),
    common_name_en: knex.raw('CAST(SUM(ISNULL(common_name_en)) AS SIGNED)'),
    wikidata_id: knex.raw('CAST(SUM(ISNULL(wikidata_id)) AS SIGNED)'),
    wikipedia_url: knex.raw('CAST(SUM(ISNULL(wikipedia_url)) AS SIGNED)'),
  });

  const getStatsByKingdom = async () => {
    const rows = await baseQb.clone().groupBy('kingdom').select('kingdom');

    return rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.kingdom.toLowerCase()] = {
        total: row.total,
        cites: row.cites,
        image_url: row.image_url,
        common_name_fr: row.common_name_fr,
        common_name_en: row.common_name_en,
        wikidata_id: row.wikidata_id,
        wikipedia_url: row.wikipedia_url,
      };
      return obj;
    }, {});
  };

  const getAnimaliaStatsByClass = async () => {
    const rows = await baseQb
      .clone()
      .where('kingdom', '=', 'Animalia')
      .groupBy('class')
      .select('class');

    return rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.class.toLowerCase()] = {
        total: row.total,
        cites: row.cites,
        image_url: row.image_url,
        common_name_fr: row.common_name_fr,
        common_name_en: row.common_name_en,
        wikidata_id: row.wikidata_id,
        wikipedia_url: row.wikipedia_url,
      };
      return obj;
    }, {});
  };

  const getPlantaeStatsByOrder = async () => {
    const rows = await baseQb
      .clone()
      .where('kingdom', '=', 'Plantae')
      .groupBy('order')
      .select('order');

    return rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.order.toLowerCase()] = {
        total: row.total,
        cites: row.cites,
        image_url: row.image_url,
        common_name_fr: row.common_name_fr,
        common_name_en: row.common_name_en,
        wikidata_id: row.wikidata_id,
        wikipedia_url: row.wikipedia_url,
      };
      return obj;
    }, {});
  };

  const [kingdom, animalia, plantae] = await Promise.all([
    getStatsByKingdom(),
    getAnimaliaStatsByClass(),
    getPlantaeStatsByOrder(),
  ]);
  return res.json({ kingdom, animalia, plantae });
});

router.get('/search', async (req, res) => {
  const {
    query = '',
    kingdom = ['Animalia', 'Plantae'],
    class: class_ = [
      'Actinopteri',
      'Amphibia',
      'Anthozoa',
      'Arachnida',
      'Aves',
      'Bivalvia',
      'Coelacanthi',
      'Dipneusti',
      'Elasmobranchii',
      'Gastropoda',
      'Hirudinoidea',
      'Holothuroidea',
      'Hydrozoa',
      'Insecta',
      'Mammalia',
      'Reptilia',
    ],
    cites = ['I', 'II', 'III', 'I/II', '?'],
    limit = 20,
    offset = 0,
  } = req.query;

  // Where by name and common_name
  const nameQb = knex('species').where((builder) =>
    builder
      .where('name', 'like', `%${query}%`)
      .orWhere('common_name', 'like', `%${query}%`),
  );

  // Get species
  const speciesQb = nameQb
    .clone()
    .select('*')
    .limit(limit)
    .offset(offset)
    .where((builder) => {
      if (kingdom.includes('Animalia')) {
        if (class_?.length > 0) {
          // Animalia of class
          builder.whereIn('class', class_);
        } else {
          // All Animalia
          builder.where('kingdom', '=', 'Animalia');
        }
      }

      if (kingdom.includes('Plantae')) {
        builder.orWhere('kingdom', '=', 'Plantae');
      }
    });

  if (cites?.length > 0) {
    speciesQb.where((builder) => {
      builder.whereIn('cites', cites);

      if (cites.includes('?')) {
        builder.orWhereNull('cites');
      }
    });
  }

  const getTotalSpeciesCount = async () =>
    (await knex('species').count('*', { as: 'count' }).first()).count;

  const getByKingdomCount = async () => {
    const rows = await nameQb
      .clone()
      .select('kingdom')
      .count('*', { as: 'count' })
      .whereNotNull('kingdom')
      .groupBy('kingdom');

    return rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.kingdom.toLowerCase()] = row.count;
      return obj;
    }, {});
  };

  const getByClassCount = async () => {
    const rows = await nameQb
      .clone()
      .select('class')
      .count('*', { as: 'count' })
      .whereNotNull('class')
      .groupBy('class');

    return rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.class.toLowerCase()] = row.count;
      return obj;
    }, {});
  };

  const getCitesCount = async () => {
    const rows = await nameQb
      .clone()
      .select('cites')
      .count('*', { as: 'count' })
      .groupBy('cites');

    return rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.cites] = row.count;
      return obj;
    }, {});
  };

  const [
    species,
    totalCount,
    kingdomCount,
    classCount,
    citesCount,
  ] = await Promise.all([
    speciesQb,
    getTotalSpeciesCount(),
    getByKingdomCount(),
    getByClassCount(),
    getCitesCount(),
  ]);

  res.json({
    species,
    counts: {
      total: totalCount,
      class: classCount,
      kingdom: kingdomCount,
      cites: citesCount,
    },
  });
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const speciesQb = knex('species').where('id', '=', id).first();

  const getCountriesByType = async () => {
    const countries = await knex({ sc: 'species_country' })
      .join({ c: 'country' }, 'sc.country_id', '=', 'c.id')
      .where('sc.species_id', '=', id)
      .select(['c.name', 'c.iso_code', 'sc.uncertain', 'sc.type']);

    return countries.reduce((obj, country) => {
      // Push to existing or new array
      // eslint-disable-next-line no-param-reassign
      (obj[country.type] = obj[country.type] ?? []).push({
        name: country.name,
        iso_code: country.iso_code,
        uncertain: country.uncertain === 1,
      });
      return obj;
    }, {});
  };

  const [species, countries] = await Promise.all([
    speciesQb,
    getCountriesByType(),
  ]);

  res.json({ ...species, countries });
});

module.exports = router;
