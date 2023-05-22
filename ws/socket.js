const WebSocket = require("ws");
const Block = require("../core/Block");
const neighbors = require("../core/Neighbors");
const { Blockchain, Wmcoin } = require("../core/main");
const { sendMessage, produceMessage, connect } = require("../services");
const { Node, Peer } = require("../core/Peer");

exports.startWebSocketServer = (server) => {
  const ws = new WebSocket.Server({ server });
  ws.on("connection", (socket, req) => {
    socket.on("message", (message) => {
      const senderIp = Peer.getAddressPeer(req);
      const { id, type, data } = JSON.parse(message);
      console.log("#");
      console.log("#");
      console.log("#");
      console.log("#");
      console.log(
        `#----------Riceive message from ${senderIp}: Type message received: ${type}`
      );
      // Handle incoming messages from the client
      switch (type) {
        case "TYPE_HANDSHAKE":
          const nodes = data;
          neighbors.push(id, nodes);
          nodes.forEach((node) => connect(node));
          break;
        case "NEW_BLOCK":
          // Parse the new block object from the message payload
          console.log(data);
          const [newBlock, newDiff] = data;
          // Verify that the block is valid

          if (
            !Block.isValidNewBlock(
              newBlock,
              Wmcoin.getLastBlock(),
              Wmcoin.difficulty
            )
          ) {
            console.log("Received an invalid new block from peer");
            return;
          }
          // Add the new block to your blockchain

          Wmcoin.chain.push(newBlock);
          // sendMessage the new block message to all other peers
          // Wmcoin.difficulty = newDiff;
          sendMessage(
            produceMessage(Node.id, "NEW_BLOCK", [
              Wmcoin.getLastBlock(),
              Wmcoin.difficulty,
            ])
          );
          console.log(`Received and added a new block from peer ${senderIp}`);
          break;
        case "CREATE_NEW_TRANSACTION":
          // Handle new transaction message
          const transaction = Wmcoin.addTransaction(data);
          break;
        case "GET_CHAIN":
          // Handle request for blockchain
          const chain = Wmcoin.chain;
          sendMessage(produceMessage(Node.id, "REPALCE_TYPE_CHAIN", chain));
          break;
        case "REPALCE_TYPE_CHAIN":
          const newChain = data;
          if (
            Blockchain.isValidChain(newChain) &&
            newChain.length >= Wmcoin.chain.length
          ) {
            Wmcoin.chain = newChain;
            sendMessage(produceMessage(Node.id, "CHAIN", Wmcoin.chain));
          }
          break;
        case "CHAIN":
          const receivedChain = data;
          if (
            Blockchain.isValidChain(receivedChain) &&
            receivedChain.length > Wmcoin.chain.length
          ) {
            console.log(
              "Received blockchain is valid. Replacing current blockchain with received blockchain."
            );
            Wmcoin.chain = newChain;
          }
          break;
        default:
          console.log(`Unknown message type: ${type}`);
      }
    });

    // Handle WebSocket errors
    socket.on("error", (err) => {
      console.error(`WebSocket error: ${err}`);
    });

    // Handle WebSocket disconnects
    socket.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
};
