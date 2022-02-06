const Block = require('../Models/Block');

class Blockchain {
  constructor() {
    this.blocks = [];
  }

  addBlock(block) {
    this.blocks.push(block);
  }

  lastBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  blockHeight() {
    return this.blocks.length;
  }
}

module.exports = Blockchain;
