const express = require('express');
const knex = require('../db/knex');
const { getImage } = require('../image-proxy');

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  const speciesQb = knex('species').limit(limit).offset(offset);
  const speciesCountQb = knex('species').count('*', { as: 'count' }).first();

  const [species, { count }] = await Promise.all([speciesQb, speciesCountQb]);

  return res.json({ species, total: count });
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

router.get('/:id/small-image', async (req, res) => {
  const { id } = req.params;

  const imageUrl = (
    await knex('species').where('id', '=', id).select('image_url').first()
  ).image_url;

  res.contentType('image/jpeg');

  res.send(await getImage(imageUrl));
});

module.exports = router;
