require('dotenv').config();

const DB = require('./app/Database/Database');
const db = new DB();

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});

const jayson = require('jayson');
const server = new jayson.Server({
  addBlock: function(args, callback) {
    const status = addBlock(args[0]) ? 'success' : 'error';
    callback(null, { status });
  }
});

function addBlock(block) {
  if ( db.blockchain.lastBlock().height !== block.height - 1 ) {
    console.log(`Rejecting block ${block.height} which was mined by ${block.miner}`);
    return false;
  }

  console.log(`Adding block ${block.height} which was mined by ${block.miner}`);
  db.blockchain.addBlock(block);
  db.commit();

  pusher.trigger(process.env.PUSHER_APP_CHANNEL, "block-mined", { block, stats: db.stats() });

  return true;
}

server.http().listen(3030, () => {
  console.log(`Listening on port 3030!`);
});
