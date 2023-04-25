const crypto = require("crypto"),
  SHA256 = (message) =>
    crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec,
  ec = new EC("secp256k1");

const MINT_PRIVATE_ADDRESS =
  "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

class Block {
  constructor(timestamp = Date.now().toString(), data = []) {
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = "";
    this.hash = Block.getHash(this);
    this.nonce = 0;
  }

  static getHash(block) {
    return SHA256(
      block.prevHash +
        block.timestamp +
        JSON.stringify(block.data) +
        block.nonce
    );
  }

  mine(difficulty) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = Block.getHash(this);
    }
  }

  static hasValidTransactions(block, chain) {
    let gas = 0,
      reward = 0;

    block.data.forEach((transaction) => {
      if (transaction.from !== MINT_PUBLIC_ADDRESS) {
        gas += transaction.gas;
      } else {
        reward = transaction.amount;
      }
    });

    return (
      reward - gas === chain.reward &&
      block.data.every((transaction) =>
        Transaction.isValid(transaction, chain)
      ) &&
      block.data.filter(
        (transaction) => transaction.from === MINT_PUBLIC_ADDRESS
      ).length === 1
    );
  }

  static isValidProof(hash, difficulty) {
    const prefix = "0".repeat(difficulty);
    return hash.startsWith(prefix);
  }

  static isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log("invalid index");
      return false;
    } else if (previousBlock.hash !== newBlock.prevHash) {
      console.log("invalid previoushash");
      return false;
    } else if (Block.getHash(newBlock) !== newBlock.hash) {
      console.log("invalid hash");
      return false;
    } else if (!this.isValidProof(newBlock.hash, difficulty)) {
      console.log("invalid proof-of-work");
      return false;
    }
    return true;
  }
}

export { Block };
