const WebSocket = require("ws");
const { Blockchain, Wmcoin } = require("../core/main");
const Block = require("../core/Block");

const { connect, broadcast, produceMessage } = require("../rpc/services");

exports.startWebSocketServer = (server) => {
  const ws = new WebSocket.Server({ server });
  ws.on("connection", (socket, req) => {
    console.log("A new WebSocket connection was established");
    socket.on("message", (message) => {
      //console.log(`Received message: ${message}`);
      const senderIp = (
        req.headers["x-forwarded-for"] || req.connection.remoteAddress
      ).replace(/^::ffff:/, "");
      console.log(`{Riceive message from ${senderIp} }`);
      const { type, data } = JSON.parse(message);
      console.log(type);
      // Handle incoming messages from the client
      switch (type) {
        case "TYPE_HANDSHAKE":
          const nodes = data;
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
          // Broadcast the new block message to all other peers
          // Wmcoin.difficulty = newDiff;
          broadcast(
            produceMessage("NEW_BLOCK", [
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
          broadcast(produceMessage("REPALCE_TYPE_CHAIN", chain));
          break;
        case "REPALCE_TYPE_CHAIN":
          const newChain = data;
          if (
            Blockchain.isValidChain(newChain) &&
            newChain.length >= Wmcoin.chain.length
          ) {
            Wmcoin.chain = newChain;
            //broadcast("CHAIN", Wmcoin.chain);
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
