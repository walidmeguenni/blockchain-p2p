const { connect } = require("./api/services");
const { getPeers } = require("./utils/getPeers");
async function startApp() {
  try {
    const PEERS = await getPeers("3001");
    console.log("PEERS:", PEERS);
    await PEERS.forEach((peer) => connect(peer));
    // start the rest of your application here
  } catch (error) {
    console.error("Error:", error);
  }
}
startApp();
