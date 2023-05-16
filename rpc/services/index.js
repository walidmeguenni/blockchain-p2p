const WebSocket = require("ws");
const solc = require("solc");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
require("dotenv").config();
const { getAddress } = require("../../utils/getAddress");

let openedPeers = [];
let connectedPeers = [];
let MY_ADDRESS = getAddress();

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

exports.sendMessage = (message) => {
  switch (process.env.METHOD_OF_SEND_MESSAGE) {
    case "broadcast":
      broadcast(message);
      break;
    case "gossip":
      gossipProtocol(message);
      break;
    default:
      console.log("Invalid method of sending message");
      break;
  }
};

const broadcast = (message) => {
  openedPeers.forEach((node) => {
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
    gossipPeers.forEach((node) => {
      node.socket.send(JSON.stringify(message));
    });
  }
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

exports.compileContract = (contractName, contractSource) => {
  const input = {
    language: "Solidity",
    sources: {
      "Contract.sol": {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["Contract.sol"][contractName];

  return {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object,
  };
};
