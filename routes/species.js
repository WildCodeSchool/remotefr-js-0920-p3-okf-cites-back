const express = require('express');
const knex = require('../db/knex');

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query, cites, animal } = req.query;
  const plant = req.query.plant === 'true';

  const qb = knex('species')
    .select('*')
    .limit(20)
    .where((builder) =>
      builder
        .where('name', 'like', `%${query}%`)
        .orWhere('common_name', 'like', `%${query}%`),
    )
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

    qb.whereIn('cites', cites);
  }

  res.json(await qb);
});

module.exports = router;
