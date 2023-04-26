const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class Blockchain {
  constructor() {
    this.transactions = [];
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1;
    this.blockTime = 30000;
    this.reward = 12;
    this.confermidtransactions = [];
  }

  createGenesisBlock() {
    return new Block();
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
    this.redetermineDifficulty();
  }

  redetermineDifficulty() {
    const lastBlockTime =
      parseInt(this.getLastBlock().timestamp) +
      this.blockTime * this.difficulty;
    const actualBlockTime = Date.now();
    if (actualBlockTime < lastBlockTime) {
      this.difficulty++;
    } else {
      this.difficulty--;
    }
  }

  addTransaction(transaction) {
    if (Transaction.isValid(transaction)) {
      this.transactions.push(transaction);
      return true;
    }
    return false;
  }

  mineBlock(rewardAddress, praviteKey) {
    let gas = 0;
    if (this.transactions.length > 10) {
      const txns = this.transactions.splice(0, 10);
      txns.forEach((transaction) => {
        gas += transaction.gas;
      });
      const rewardTransaction = new Transaction(
        null,
        rewardAddress,
        this.reward + gas
      );
      rewardTransaction.sign(praviteKey);
      const blockTransactions = [rewardTransaction, ...this.transactions];
      this.addBlock(
        new Block(this.chain.length, Date.now().toString(), blockTransactions)
      );
      this.confermidtransactions.push(txns);
      return true; // successfully mined transactions
    } else {
      return false; // not enough transactions to mine
    }
  }

  getBalance(address) {
    let balance = 0;

    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
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
