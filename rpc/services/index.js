const { sendMessage, produceMessage } = require("../../services");
const { Wmcoin } = require("../../core/main");

let mining = false;
let miningInterval;

exports.startMiningHandler = (walletAddress, privateKey) => {
  if (!mining) {
    console.log("Mining started");
    mining = true;
    miningInterval = setInterval(async () => {
      // Add your mining logic here
      if (Wmcoin.mineBlock(walletAddress, privateKey)) {
        sendMessage(
          produceMessage("NEW_BLOCK", [
            Wmcoin.getLastBlock(),
            Wmcoin.difficulty,
          ])
        );
        console.log("Block mined successfully");
        return true;
      } else {
        return false;
      }
    }, 1000);
  }
};

// ------------------------Handler function for "stopMining" event-------------//
exports.stopMiningHandler = () => {
  if (mining) {
    console.log("Mining stopped");
    mining = false;
    clearInterval(miningInterval);
    mining = false;
    return true;
  } else {
    console.log("mining aleardy stoped");
    return false;
  }
};
