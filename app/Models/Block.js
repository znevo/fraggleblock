const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

class Block {
  constructor(data = {}) {
    this.previousHash = data.previousHash || null;
    this.hash = data.hash || null;
    this.height = data.height || 0;
    this.timestamp = data.timestamp || Date.now();
    this.nonce = data.nonce || 0;
    this.miner = data.miner || null;
  }

  toHash() {
    const msg = this.timestamp + '' + this.nonce + '' + this.miner;
    this.hash = toHex(sha256(utf8ToBytes(msg)));
    return this.hash;
  }
}

module.exports = Block;
