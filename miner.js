const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const express = require('express');
const app = express();
const cors = require('cors');
const port = argv.port || 3000;

const Miner = require('./app/Models/Miner');
const miner = new Miner(argv.miner || 'Miner 1');

app.use(cors());
app.use(express.json());

app.get('/start', (req, res) => {
  if ( miner.start() ) {
    res.send({ status: 'success', mining: miner.mining });
  } else {
    res.send({ status: 'error', message: 'The blockchain is invalid!', mining: miner.mining });
  }
});

app.get('/stop', (req, res) => {
  miner.stop();
  res.send({ status: 'success', mining: miner.mining });
});

app.get('/mining', (req, res) => {
  res.send({ status: 'success', mining: miner.mining });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
