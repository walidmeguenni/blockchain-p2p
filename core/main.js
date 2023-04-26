const { Block } = require("./Block");
const { Transaction } = require("./Transaction");
const { SHA256 } = require("../utils/sha256");

const EC = require("elliptic").ec,
  ec = new EC("secp256k1");

const MINT_PRIVATE_ADDRESS =
  "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

class Blockchain {
  constructor() {
    const initalCoinRelease = new Transaction(
      MINT_PUBLIC_ADDRESS,
      "04719af634ece3e9bf00bfd7c58163b2caf2b8acd1a437a3e99a093c8dd7b1485c20d8a4c9f6621557f1d583e0fcff99f3234dd1bb365596d1d67909c270c16d64",
      100000000
    );
    this.transactions = [];
    this.chain = [new Block("", [initalCoinRelease])];
    this.difficulty = 1;
    this.blockTime = 30000;
    this.reward = 297;
  }
  getBlocks() {
    return this.chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    block.prevHash = this.getLastBlock().hash;
    block.hash = Block.getHash(block);
    block.mine(this.difficulty);
    this.chain.push(Object.freeze(block));

    this.difficulty +=
      Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime
        ? 1
        : -1;
  }

  addTransaction(transaction) {
    if (Transaction.isValid(transaction)) {
      this.transactions.push(transaction);
      return true;
    }
    return false;
  }

  mineTransactions(rewardAddress) {
    let gas = 0;

    this.transactions.forEach((transaction) => {
      gas += transaction.gas;
    });

    const rewardTransaction = new Transaction(
      MINT_PUBLIC_ADDRESS,
      rewardAddress,
      this.reward + gas
    );
    rewardTransaction.sign(MINT_KEY_PAIR);

    const blockTransactions = [rewardTransaction, ...this.transactions];

    if (this.transactions.length !== 0)
      this.addBlock(new Block(Date.now().toString(), blockTransactions));

    this.transactions.splice(0, blockTransactions.length - 1);
  }

  getBalance(address) {
    let balance = 0;

    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.from === address) {
          balance -= transaction.amount;
          balance -= transaction.gas;
        }

        if (transaction.to === address) {
          balance += transaction.amount;
        }
      });
    });

    return balance;
  }

  static isValidChain(chain) {
    let prevBlock = chain[0];
  
    for (let i = 1; i < chain.length; i++) {
      const currBlock = chain[i];
      if (!Block.isValidNewBlock(currBlock, prevBlock)) {
        return false;
      }
      prevBlock = currBlock;
    }
    return true;
  }
  
}

const Wmcoin = new Blockchain();

export { Blockchain, Wmcoin };
