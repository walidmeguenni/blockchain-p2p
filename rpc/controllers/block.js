const { Wmcoin } = require("../../core/main");

exports.getBlocks = (req, res) => {
  const blocks = Wmcoin.getBlocks();
  res.status(201).json({ Blockchain: blocks });
};

exports.getLastBlock = (req, res) => {
  const blocks = Wmcoin.getLastBlock();
  res.status(201).json({ Blockchain: blocks });
};
