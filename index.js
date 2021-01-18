const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const { port } = require('./config');

const speciesRouter = require('./routes/species.js');

const app = express();

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

app.use('/api/species', speciesRouter);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
