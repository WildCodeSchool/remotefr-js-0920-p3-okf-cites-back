const express = require('express');
const knex = require('../db/knex');

const router = express.Router();

router.get('/search', async (req, res) => {
  const movieSearch = req.query.search;

  const result = await knex('species')
    .select('*')
    .where('name', 'like', `%${movieSearch}%`)
    .orWhere('name', 'like', `%${movieSearch}%`)
    .limit(20);
  res.json(result);
});

module.exports = router;
