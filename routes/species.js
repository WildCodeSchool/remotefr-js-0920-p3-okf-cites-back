const express = require('express');
const knex = require('../db/knex');

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query, cites, animal } = req.query;
  const plant = req.query.plant === 'true';

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
    .limit(20)
    .where((builder) => {
      if (animal?.length > 0) {
        builder.whereIn('class', animal);
      }

      if (plant) {
        builder.orWhere('kingdom', '=', 'Plantae');
      }
    });

  if (cites?.length > 0) {
    // Add I/II to where if it contains I or II
    if (cites.some((c) => c === 'I' || c === 'II')) cites.push('I/II');

    speciesQb.whereIn('cites', cites);
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
      .whereNotNull('cites')
      .groupBy('cites');

    const countObj = rows.reduce((obj, row) => {
      // eslint-disable-next-line no-param-reassign
      obj[row.cites] = row.count;
      return obj;
    }, {});

    return {
      I: countObj.I + countObj['I/II'],
      II: countObj.II + countObj['I/II'],
      III: countObj.III,
    };
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
