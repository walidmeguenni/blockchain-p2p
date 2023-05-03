const { wallet } = require("../../core/wallet");

exports.create = (req, res) => {
  const account = wallet.create(req.body.password);
  res.status(202).json({ wallet: account });
};

exports.getAccounts = (req, res) => {
  const accounts = wallet.getWallet();
  res.status(202).json({ accounts: accounts });
};
