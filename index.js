const express = require('express');
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
});
const dumpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
});

app.use('/api/species', regularLimiter, speciesRouter);
app.use('/api/dump', dumpLimiter, dumpRouter);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${port}`);
  }

  cron.schedule('0 */12 * * *', syncWithWikidata);
});
