const WebSocket = require("ws");

const senders = ["ws://192.168.8.103:3002"];
const wss = new WebSocket.Server({ port: 4000 });
let portsender;
let address;
wss.on("connection", (ws, req) => {
  const senderIp = (
    req.headers["x-forwarded-for"] || req.connection.remoteAddress
  ).replace(/^::ffff:/, "");
  console.log(`Connected to node: ${senderIp}`);

  ws.on("message", async (message) => {
    console.log(`Received data from node ${senderIp}: ${message}`);
    portsender = message;
    if (senders.length === 0) {
      console.log("There is  no peer available for now");
    } else {
      ws.send(JSON.stringify(senders));
    }
    address = `ws://${senderIp}:${message}`;
    const ipExists = senders.some((sender) => sender === address);
    if (!ipExists) {
      senders.push(address);
    }

    let filteredAddresses = senders.filter(
      (addressIp) => addressIp !== address
    );

    ws.send(JSON.stringify(filteredAddresses));
    console.log(senders);
    filteredAddresses = [];
  });

  ws.on("error", (err) => {
    console.error(`Error connecting to node: ${senderIp}: ${err}`);
  });

  // Handle disconnects
  ws.on("close", () => {
    senders.splice(senders.indexOf(address), 1);
    console.log(`Disconnected from node : ${senderIp}:${portsender}`);
    portsender = "";
  });
});

wss.on("listening", () => {
  const address = wss.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});
