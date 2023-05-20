const { connect } = require("../services");
const { getPeers } = require("../utils/getPeers");
require("dotenv").config();
exports.startApp = async () => {
  try {
    const peers = await getPeers(process.env.PORT);
    console.table(peers)
    await peers.forEach((value) => connect(value.peers));
    // start the rest of your application here
  } catch (error) {
    console.error("Error:", error);
  }
};
