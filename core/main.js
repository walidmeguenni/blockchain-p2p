const Block = require("./Block");
const Transaction = require("./Transaction");
const Database = require("./Database");
const { Node } = require("./Peer");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
require("dotenv").config();

class Blockchain {
  constructor(PeerId) {
    this.transactions = [];
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1;
    this.blockTime = 30000;
    this.reward = 12;
    this.confermidtransactions = [];
    this.database = new Database(PeerId);
    this.contracts = [];
    this.transactionBroadcastCounts = [];
    this.blockBroadcastCount = [];
  }

  createGenesisBlock() {
    const transactionGenesis = [
      {
        from: "",
        to: "04aa488ae7207dbce8ac84e61c358befcc384cd5d1ce5d921c866a63a222b11c3a5c00918848331556dac8df162de1261f595da5d52e51c4aa1e1862b0adefc7e6",
        amount: 10000,
        gas: 0,
        signature: "",
      },
    ];
    return new Block(0, Date.now(), transactionGenesis);
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
    this.database.storeBlock(block.index, block);
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
    if (Transaction.isValid(transaction, this)) {
      this.transactions.push(transaction);
      return true;
    }
    return false;
  }

  mineBlock(rewardAddress, privateKey) {
    let gas = 0;
    if (this.transactions.length > 10) {
      const txns = this.transactions.splice(0, 10);
      txns.forEach((transaction) => {
        gas += transaction.gas;
      });
      const rewardTransaction = new Transaction(
        "00000000000000000000",
        rewardAddress,
        this.reward + gas
      );
      const keyPair = ec.keyFromPrivate(privateKey);
      rewardTransaction.sign(keyPair);
      const blockTransactions = [rewardTransaction, ...txns];
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
          balance -= parseInt(transaction.amount);
          balance -= parseInt(transaction.gas);
        }

        if (transaction.to === address) {
          balance += parseInt(transaction.amount);
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

  countTransactionBroadcast(signature) {
    const index = this.transactionBroadcastCounts.findIndex(
      (item) => item.signature === signature
    );
    if (index !== -1) {
      this.transactionBroadcastCounts[index].numberbroadcast++;
    } else {
      this.transactionBroadcastCounts.push({
        signature: signature,
        numberbroadcast: 1,
      });
    }
  }

  countBlockBroadcast(hash) {
    const index = this.blockBroadcastCount.findIndex(
      (item) => item.hash === hash
    );
    if (index !== -1) {
      this.blockBroadcastCount[index].numberbroadcast++;
    } else {
      this.blockBroadcastCount.push({
        hash: hash,
        numberbroadcast: 1,
      });
    }
  }
}

const Wmcoin = new Blockchain(Node.id);
module.exports = { Blockchain, Wmcoin };
