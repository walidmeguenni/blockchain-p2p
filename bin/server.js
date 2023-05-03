const app = require("../rpc/app");
const http = require("http");
const { startApp } = require("../ws/connect");
const { startWebSocketServer } = require("../ws/main");
require("dotenv").config();
startApp();
// create a new WebSocket server and attach it to the Express.js server
const PORT = process.env.PORT;
// create a new WebSocket server and attach it to the Express.js server

app.set("port", PORT);

const server = http.createServer(app);

startWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
