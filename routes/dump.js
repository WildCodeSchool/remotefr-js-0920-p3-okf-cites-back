const { spawn } = require('child_process');
const zlib = require('zlib');
const express = require('express');
const config = require('../config');

const router = express.Router();

router.get('/', (req, res) => {
  res.header(
    'Content-Disposition',
    'attachment; filename="memoire-elephant-dump.sql"',
  );
  res.header('Content-Encoding', 'gzip');

  const process = spawn(config.db.mysqldumpCommand, [
    config.db.database,
    'country',
    'species',
    'species_country',
  ]);

  process.on('error', (err) => {
    console.error(err);
    res.sendStatus(500);
  });
  process.stderr.on('data', (err) => {
    console.error(err);
  });

  const gzip = zlib.createGzip();
  process.stdout.pipe(gzip).pipe(res);
  process.on('close', () => {
    res.end();
  });
});

module.exports = router;
