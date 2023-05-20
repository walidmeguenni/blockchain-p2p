const { connect } = require("../services");
const { getPeers } = require("../utils/getPeers");
require("dotenv").config();
exports.startApp = async () => {
  try {
    const PEERS = await getPeers(process.env.PORT);
    console.log("PEERS:", PEERS);
    await PEERS.forEach((peer) => connect(peer));
    // start the rest of your application here
  } catch (error) {
    console.error("Error:", error);
  }
};
