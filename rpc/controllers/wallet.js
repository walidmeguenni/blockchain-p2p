const { wallet } = require("../../core/wallet");

exports.create = (req, res) => {
  const account = wallet.create(req.body.password);
  res.status(202).json({ wallet: account });
};

exports.getAccounts = (req, res) => {
  const accounts = wallet.getWallet();
  res.status(202).json({ accounts: accounts });
};

exports.getBalance = (req, res) => {
  const balance = Wmcoin.getBalance(req.body.body.address);
  res.status(202).json({ balance: balance });
};
