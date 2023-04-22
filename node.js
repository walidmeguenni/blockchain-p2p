const express = require("express");
const WebSocket = require("ws");
const events = require("events");
const bodyParser = require("body-parser");
const EC = require("elliptic").ec;
const crypto = require("crypto"),
  SHA256 = (message) =>
    crypto.createHash("sha256").update(message).digest("hex");

const { Transaction, Wmcion } = require("./Blockchain");
const { wallet } = require("./utils/wallet");

let mining = false;
let miningInterval;
const app = express();
app.use(bodyParser.json());
const eventEmitter = new events.EventEmitter();
const ec = new EC("secp256k1");

// create a new WebSocket server and attach it to the Express.js server
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

const ws = new WebSocket.Server({ server });

// Handle WebSocket connections
ws.on("connection", (socket, req) => {
  console.log("A new WebSocket connection was established");

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Handle incoming messages from the client
    const data = JSON.parse(message);
   
    switch (data.type) {
      case "NEW_BLOCK":
        // Handle new block message
        break;
      case "CREATE_NEW_TRANSACTION":
        // Handle new transaction message
        break;
      case "GET_CHAIN":
        // Handle request for blockchain
        break;
      default:
        console.log(`Unknown message type: ${data.type}`);
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
// ------------------------Functions Helper---------------------------//
function produceMessage(type, data) {
  return { type, data };
}

function sendMessage(message) {
  opened.forEach((node) => {
    node.socket.send(JSON.stringify(message));
  });
}

// Handler function for "startMining" event
const startMiningHandler = (walletAddress) => {
  if (!mining) {
    console.log("Mining started");
    mining = true;
    miningInterval = setInterval(async () => {
      // Add your mining logic here
      Wmcion.mineTransactions(walletAddress);
      console.log("Mining...");
    }, 1000);
  }
};

// Handler function for "stopMining" event
const stopMiningHandler = () => {
  if (mining) {
    console.log("Mining stopped");
    mining = false;
    clearInterval(miningInterval);
  }
};

// Attach event handlers to event emitter
eventEmitter.on("startMining", startMiningHandler);
eventEmitter.on("stopMining", stopMiningHandler);

// API endpoint to add a new transaction

app.post("/transaction/send", (req, res) => {
  const { from, to, amount, gas, privateKey } = req.body;
  const keyPair = ec.keyFromPrivate(privateKey);
  if (keyPair.getPublic("hex") === from) {
    const signature = keyPair
      .sign(SHA256(from + to + amount + gas), "base64")
      .toDER("hex");

    const transaction = new Transaction(from, to, amount, gas, signature);
    const status =Wmcion.addTransaction(transaction);
    if (status) {
      //sendMessage(produceMessage("CREATE_NEW_TRANSACTION", transaction));
      res
        .status(202)
        .json({ _message: "transaction send", transaction: transaction });
        
    } else {
       res.status(400).send("transaction not valid");
    }
  } else {
    res.status(400).send("keys not match ");
  }
});

app.get("/transaction/all",(req,res)=>{
  const transactions = Wmcion.transactions;
  res.status(201).json({ Transactions: transactions });
})
app.get("/blocks", (req, res) => {
  const blocks = Wmcion.getBlocks();
  res.status(201).json({ Blockchain: blocks });
});

app.get("/balance", (req, res) => {
  const balance = Wmcion.getBalance(req.address);
  res.status(202).json({ balance: balance });
});

app.get("/wallet/create", (req, res) => {
  const account = wallet.create();
  res.status(202).json({ wallet: account });
});

app.get("/wallet/accounts", (req, res) => {
  const accounts = wallet.getWallet();
  res.status(202).json({ accounts: accounts });
});

// Route to start mining
app.post("/Mine/start", (req, res) => {
  const walletAddress = req.body.walletAddress;
  eventEmitter.emit("startMining", walletAddress);
  res.send("Mining started");
});

// Route to stop mining
app.get("/mine/stop", (req, res) => {
  eventEmitter.emit("stopMining");
  res.send("Mining stopped");
});
