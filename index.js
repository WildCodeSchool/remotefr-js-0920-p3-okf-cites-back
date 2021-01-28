const express = require('express');
require('express-async-errors');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const { port } = require('./config');
const syncWithWikidata = require('./db/sync-with-wikidata');

const speciesRouter = require('./routes/species.js');
const dumpRouter = require('./routes/dump.js');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(compression());

const regularLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  skip: (req) => req.path.endsWith('small-image'), // Don't limit /api/species/:id/small-image route
});
const dumpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
});

app.use('/api/species', regularLimiter, speciesRouter);
app.use('/api/dump', dumpLimiter, dumpRouter);

// Error handlers in express are recognized by having 4 parameters
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);

  res.sendStatus(500);
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${port}`);
  }

  cron.schedule('0 0 1 * *', syncWithWikidata);
});
