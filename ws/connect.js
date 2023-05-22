const { connect } = require("../services");
const { Node } = require("../core/Peer");

function isTable(data) {
  // Check if data is an array
  if (!Array.isArray(data)) {
    return false;
  }
  return true;
}
exports.startApp = async () => {
  try {
    const peers = await Node.getPeers();
    if (isTable(peers)) {
      console.table(peers);
      await peers.forEach((value) => connect(value.peers));
    } else {
      console.log("#----------There is  no peer available for now, Try later");
    }

    // start the rest of your application here
  } catch (error) {
    console.error("Error:", error);
  }
};
