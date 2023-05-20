const WebSocket = require("ws");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
require("dotenv").config();

const { getAddress } = require("../utils/getAddress");
const { getPeerId } = require("../utils/getPeerId");
const { listPeersNeighbors } = require("../ws/socket");

let openedPeers = [];
let connectedPeers = [];
let MY_ADDRESS = getAddress();
const id = getPeerId(MY_ADDRESS);
exports.connect = async (address) => {
  if (connectedPeers.includes(address) || address === MY_ADDRESS) {
    return; // already connected
  }

  try {
    const socket = new WebSocket(address);

    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve);
      socket.addEventListener("error", reject);
      socket.addEventListener("close", reject);
    });

    // Send handshake message
    const message = {
      id: id,
      type: "TYPE_HANDSHAKE",
      data: [MY_ADDRESS, ...connectedPeers],
    };
    socket.send(JSON.stringify(message));

    // Send Request chain
    const requestChain = { id: id, type: "GET_CHAIN" };
    socket.send(JSON.stringify(requestChain));
    // Store socket and add to list of connected peers
    const peer = { address, socket };
    openedPeers.push(peer);
    connectedPeers.push(address);
    // Handle socket closing
    socket.addEventListener("close", () => {
      openedPeers.splice(openedPeers.indexOf(peer), 1);
      connectedPeers.splice(connectedPeers.indexOf(address), 1);
    });
  } catch (error) {
    console.log("#");
    console.log("#");
    console.log("#");
    console.log("#");
    console.error(`Failed to connect to peer at ${address}: ${error}`);
  }
};

exports.produceMessage = (type, data) => {
  return { id: id, type, data };
};

exports.sendMessage = (id, message) => {
  switch (process.env.METHOD_OF_SEND_MESSAGE) {
    case "broadcast":
      broadcast(message, openedPeers);
      break;
    case "gossip":
      gossipProtocol(message);
      break;
    case "olsr":
      olsrProtocol(id, message);
      break;
    default:
      console.log("Invalid method of sending message");
      break;
  }
};

const broadcast = (message, peers) => {
  peers.forEach((node) => {
    node.socket.send(JSON.stringify(message));
  });
};
function getRandomSubset(size = 30) {
  const shuffled = openedPeers.sort(() => 0.5 - Math.random());
  const nbrPeers = Math.ceil((openedPeers.length * size) / 100);
  return shuffled.slice(0, nbrPeers);
}
const gossipProtocol = (message, numRounds = 5) => {
  for (let index = 0; index < numRounds; index++) {
    const gossipPeers = getRandomSubset();
    // Send the message to the selected peers
    broadcast(message, gossipPeers);
  }
};

const olsrProtocol = (id, message) => {
  const olsrPeers = getOlsrPeers(id);
  // Send the message to the selected peers
  broadcast(message, olsrPeers);
};

const getOlsrPeers = (id) => {
  let olsrPeers = [];
  let targetedPeers = [];
  listPeersNeighbors.map((peer) => {
    if (peer.id !== id) {
      const result = peer.neighbors.find((id) => id === peer.id);
      targetedPeers.push(result.address);
    }
  });
  if (targetedPeers.length !== 0) {
    openedPeers.map((item) => {
      const status = targetedPeers.some(
        (value) => item.address !== value.peers
      );
      if (!status) {
        olsrPeers.push(item);
      }
    });
  }
  return olsrPeers;
};

exports.signTranasction = (from, privateKey) => {
  const keyPair = ec.keyFromPrivate(privateKey);
  if (keyPair.getPublic("hex") === from) {
    return keyPair
      .sign(SHA256(from + "" + amount + gas), "base64")
      .toDER("hex");
  }
  return false;
};

exports.shape = `
#          W       W       w  M         M   C C C C C
#           W     W W     w   M M     M M  C 
#            W   W   W   w    M  M   M  M  C
#             W W     W w     M   M M   M  C
#              W       W      M    M    M   C C C C C
#`;
