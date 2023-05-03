const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const Transaction = require("../../core/Transaction");
const { Wmcoin } = require("../../core/main");
const { SHA256 } = require("../../utils/sha256");

const { broadcast, produceMessage } = require("../services");

exports.sendTransaction = (req, res) => {
  const { from, to, amount, gas, privateKey } = req.body;
  const keyPair = ec.keyFromPrivate(privateKey);
  if (keyPair.getPublic("hex") === from) {
    const signature = keyPair
      .sign(SHA256(from + to + amount + gas), "base64")
      .toDER("hex");
    const transaction = new Transaction(from, to, amount, gas, signature);
    const status = Wmcoin.addTransaction(transaction);
    if (status) {
      broadcast(produceMessage("CREATE_NEW_TRANSACTION", transaction));
      res.status(202).json({
        _message: "transaction send",
        transaction: transaction,
        status: true,
      });
    } else {
      res.status(400).send("transaction not valid");
    }
  } else {
    res.status(400).send("keys not match ");
  }
};

exports.getTransactions = (req, res) => {
  const transactions = Wmcoin.transactions;
  res.status(201).json({ Transactions: transactions });
};
