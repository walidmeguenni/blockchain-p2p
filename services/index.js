const WebSocket = require("ws");
const EC = require("elliptic").ec;
require("dotenv").config();

const neighbors = require("../core/Neighbors");
const { Node } = require("../core/Peer");

let openedPeers = [];
let connectedPeers = [];

const ec = new EC("secp256k1");

exports.connect = async (address) => {
  if (connectedPeers.includes(address) || address === Node.address) {
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
      id: Node.id,
      type: "TYPE_HANDSHAKE",
      data: [Node.address, ...connectedPeers],
    };
    socket.send(JSON.stringify(message));

    // Send Request chain
    const requestChain = { id: Node.id, type: "GET_CHAIN" };
    socket.send(JSON.stringify(requestChain));
    // Store socket and add to list of connected peers
    const peer = { address, socket };
    openedPeers.push(peer);
    connectedPeers.push(address);
    console.log("#");
    console.log("#");
    console.log("#");
    console.log("#");
    console.log(`#----------New peer add to the List of Peers:${address}`);
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
    console.error(
      `#----------Failed to connect to peer at ${address}: ${error}----------#`
    );
  }
};

exports.produceMessage = (id, type, data) => {
  return { id, type, data };
};

exports.sendMessage = (message) => {
  switch (process.env.METHOD_OF_SEND_MESSAGE) {
    case "broadcast":
      broadcast(message, openedPeers);
      break;
    case "gossip":
      gossipProtocol(message);
      break;
    case "olsr":
      olsrProtocol(message);
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

const olsrProtocol = (message) => {
  const { id } = message;
  const olsrPeers = getOlsrPeers(id);
  // Send the message to the selected peers
  broadcast(message, olsrPeers);
};

const getOlsrPeers = (id) => {
  let olsrPeers = [];
  let targetedPeers = [];
  let listPeersNeighbors = neighbors.get();
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
