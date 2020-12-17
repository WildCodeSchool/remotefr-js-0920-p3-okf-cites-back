const express = require('express');
const cors = require('cors');
const { port } = require('./config');

const explorerRouter = require('./routes/explore.js');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Express server is up and running!'));

app.use('/explore', explorerRouter);

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
