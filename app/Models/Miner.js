const Block = require('../Models/Block');
const TARGET_DIFFICULTY = BigInt("0x0000" + "F".repeat(60));

const DB = require('../Database/Database');
const db = new DB();

const jayson = require('jayson');

class Miner {
  constructor(name) {
    this.name = name;
    this.mining = false;
    this.fullnode = jayson.Client.http({ port: 3030 });
  }

  start() {
    console.log('Fetch current blockchain from storage...');
    db.restore();

    console.log('Attempting to start miner...');

    console.log('Verifying the blockchain...');
    if ( ! this.verifyChain() ) {
      this.stop();
      return false;
    }

    console.log('Starting the miner...');
    this.mining = true;
    this.interval = setInterval(this.mine.bind(this), 1000);
    return true;
  }

  stop() {
    console.log('Stopping the miner...');

    this.mining = false;
    clearInterval(this.interval);
  }

  mine() {
    const block = new Block({
      height: db.blockchain.blockHeight(),
      previousHash: db.blockchain.lastBlock().hash,
      miner: this.name,
    });

    while(BigInt('0x' + block.toHash()) >= TARGET_DIFFICULTY) {
      block.nonce++;
    }

    console.log(`Mined block with a hash of ${block.hash} at nonce ${block.nonce}`);
    console.log(`Submitting block to full node`);

    var that = this;
    this.fullnode.request('addBlock', [block], function(err, response) {
      if(err) throw err;

      if ( response.result.status == 'success' ) {
        console.log(`Block accepted!`);
        // db.blockchain.addBlock(block);

        // to prevent an unfair advantage we will not start mining on top of our new block
        // we will keep attempting to mine the same block until it is explicitly rejected
        // forcing us to restore and validate the latest blockchain from the fullnode/filesystem
      } else {
        console.log(`Block rejected! Let's get the latest chain!`);
        db.restore();
      }
    });

    // adding blocks and writing the blockchain to disk are now the responsibility of the fullnode
    // db.blockchain.addBlock(block);
    // db.commit();
  }

  verifyChain() {
    let i;
    for (i = 1; i < db.blockchain.blockHeight(); i++ ) {
      if ( db.blockchain.blocks[i].previousHash !== db.blockchain.blocks[i-1].toHash() ) {
        console.log(`Verification failed at block ${i} of ${db.blockchain.blockHeight()} blocks. The blockchain is invalid!`);
        return false;
      }
    }

    console.log(`Verified ${i} blocks. The blockchain is valid!`);
    return true;
  }
}

module.exports = Miner;
