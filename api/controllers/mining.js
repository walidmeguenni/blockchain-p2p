const {
    startMiningHandler,
    stopMiningHandler,
  } = require("../services/mining");
  exports.startMining = (req, res) => {
    const walletAddress = req.body.walletAddress;
    const privateKey = req.body.privateKey;
    if (startMiningHandler(walletAddress, privateKey)) {
      res.status(202).json({ status: true });
    } else {
      res.status(202).json({ status: false });
    }
  };
  
  exports.stopMining = (req, res) => {
    if (stopMiningHandler()) {
      res.status(202).json({ status: false });
    } else {
      res.status(202).json({ message: "" });
    }
  };
  