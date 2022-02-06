require('dotenv').config();

const fs = require('fs');

const Blockchain = require('../Models/Blockchain');
const Block = require('../Models/Block');

class DB {
  constructor() {
    this.restore();
  }

  commit() {
    try {
      fs.writeFileSync(process.env.DB_PATH, JSON.stringify(this,null,2));
    } catch (err) {
      console.error(err);
    }
  }

  restore() {
    try {
      let data = fs.readFileSync(process.env.DB_PATH, 'utf8');

      try {
        data = JSON.parse(data);
      } catch {
        // invalid json
      }

      if ( data.blockchain ) {
        this.blockchain = new Blockchain();

        data.blockchain.blocks.forEach((block) => {
          this.blockchain.addBlock(new Block(block));
        });

        // console.log('Restored blockchain!');
        // console.log(this.blockchain);
      } else {
        this.blockchain = new Blockchain();

        const genesis = new Block();
        genesis.toHash();
        this.blockchain.addBlock(genesis);

        this.commit();

        // console.log('Fresh blockchain with genesis block!');
        // console.log(this.blockchain);
      }
    } catch (err) {
      console.error(err)
    }
  }

  stats() {
    return {
      'Miner 1': this.blockchain.blocks.filter((block) => block.miner == 'Miner 1').length,
      'Miner 2': this.blockchain.blocks.filter((block) => block.miner == 'Miner 2').length,
      'Miner 3': this.blockchain.blocks.filter((block) => block.miner == 'Miner 3').length,
    }
  }
}

module.exports = DB;
