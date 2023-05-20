const WebSocket = require("ws");
const { hasAvilablePeers, getAddressPeer } = require("./services");

const senders = [];

let filteredAddresses;
let portsender;
let address;

const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", (ws, req) => {
  const senderIp = getAddressPeer(req);
  console.log(`Connected to node: ${senderIp}`);

  ws.on("message", async (message) => {
    console.log(`Received data from node ${senderIp}: ${message}`);

    portsender = message;
    address = `ws://${senderIp}:${message}`;
    const ipExists = senders.some((sender) => sender === address);

    if (hasAvilablePeers(senders)) {
      if (!ipExists) {
        if (senders.length >= 3) {
          ws.send(JSON.stringify(senders.slice(-3)));
        } else {
          ws.send(JSON.stringify(senders));
        }
        senders.push(address);
      } else {
        filteredAddresses = senders.filter(
          (addressIp) => addressIp !== address
        );
        if (filteredAddresses.length !== 0) {
          if (filteredAddresses.length >= 3) {
            ws.send(JSON.stringify(filteredAddresses.slice(-3)));
          } else {
            ws.send(JSON.stringify(filteredAddresses));
          }
        } else {
          ws.send("There is  no peer available for now, Try later ");
        }
      }
    } else {
      ws.send("There is  no peer available for now, Try later ");
    }

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
