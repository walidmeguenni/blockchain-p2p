const WebSocket = require("ws");

let openedPeers = [];
let connectedPeers = [];

exports.connect = async (address, MY_ADDRESS) => {
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
      type: "TYPE_HANDSHAKE",
      data: [MY_ADDRESS, ...connectedPeers],
    };
    socket.send(JSON.stringify(message));

    // Send Request chain
    const requestChain = { type: "GET_CHAIN" };
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
    console.error(`Failed to connect to peer at ${address}: ${error}`);
  }
};

exports.produceMessage = (type, data) => {
  return { type, data };
};
exports.broadcast = (message) => {
  openedPeers.forEach((node) => {
    node.socket.send(JSON.stringify(message));
  });
};
