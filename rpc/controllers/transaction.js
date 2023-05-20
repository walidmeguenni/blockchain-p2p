const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const Transaction = require("../../core/Transaction");
const { Wmcoin } = require("../../core/main");
const { getAddress } = require("../../utils/getAddress");
const { getPeerId } = require("../../utils/getPeerId");
const { SHA256 } = require("../../utils/sha256");

const { sendMessage, produceMessage } = require("../../services");

let MY_ADDRESS = getAddress();
const myId = getPeerId(MY_ADDRESS);

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
      sendMessage(produceMessage(myId, "CREATE_NEW_TRANSACTION", transaction));
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
