const app = require("../api/app");
const WebSocket = require("ws");

const { getAddress } = require("../utils/getAddress");
const { getPeerId } = require("../utils/getPeerId");

// create a new WebSocket server and attach it to the Express.js server
const PORT = 3001;
const MY_ADDRESS = getAddress(PORT);
const PEERID = getPeerId(MY_ADDRESS);

app.set("port", PORT);
const server = app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

const ws = new WebSocket.Server({ server });
module.exports =  {ws , MY_ADDRESS};
