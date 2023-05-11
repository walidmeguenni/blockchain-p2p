const Block = require("./Block");
const Transaction = require("./Transaction");
const Database = require("./Database");
const SmartContract = require("./smartContract");
const { getAddress } = require("../utils/getAddress");
const { getPeerId } = require("../utils/getPeerId");
const { signTranasction } = require("../rpc/services");
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
  }

  createGenesisBlock() {
    const transactionGenesis = [
      {
        from: "",
        to: "049f81b7cba82817c116f834b26da50b09e9ba5aa177281010dc7f2928bb13581c66895e8a9c030b81421659b099e5ca67d7df6c1c6df4461703ea62b200953dd3",
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

  deploy(abi, bytecode, from, privateKey, amount = 0, gas = 10) {
    try {
      if (gas < 10) return { satatus: false, message: "insufficient gas ... " };
      const SC = new SmartContract(abi, bytecode);
      this.contracts.push(SC.contract);
      const signature = signTranasction(from, privateKey);
      const data = "0x" + SC.id;
      const transaction = new Transaction(
        from,
        "",
        amount,
        gas,
        signature,
        data
      );
      if (signature && Wmcoin.addTransaction(transaction)) {
        return { status: true, smartID: SC.contract.id };
      } else {
        return { satatus: false, message: "transaction not valid" };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async execute(contractId, methodName, from, privateKey, ...args) {
    try {
      const contract = this.contracts.find((c) => c.id === contractId);
      if (!contract) throw new Error(`Contract ${contractId} not found`);

      const methodAbi = contract.abi.find((m) => m.name === methodName);
      if (!methodAbi)
        throw new Error(
          `Method ${methodName} not found in contract ${contractId}`
        );

      const signatureFunction =
        SmartContract.generateFunctionSignature(methodAbi);
      const signatureArgs = SmartContract.encodeParameters(
        methodAbi.inputs,
        args
      );
      const signature = signTranasction(from, privateKey);
      const data = "0x" + functionSignature + encodedParams;
      const transaction = new Transaction(
        from,
        "",
        amount,
        gas,
        signature,
        data
      );
      if (signature && Wmcoin.addTransaction(transaction)) {
        const returnValue = SmartContract.decodeParameters(
          methodAbi.outputs,
          transaction
        );

        return {
          status: true,
          smartID: SC.contract.id,
          output: returnValue,
        };
      } else {
        return { satatus: false, message: "transaction not valid" };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const MY_ADDRESS = getAddress();
const PEERID = getPeerId(MY_ADDRESS);
const Wmcoin = new Blockchain(PEERID);
module.exports = { Blockchain, Wmcoin };
