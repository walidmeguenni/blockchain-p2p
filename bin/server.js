const app = require("../rpc/app");
const http = require("http");
const { startApp } = require("../ws/connect");
const { startWebSocketServer } = require("../ws/socket");
require("dotenv").config();

startApp();

const PORT = process.env.PORT;

app.set("port", PORT);

const server = http.createServer(app);

startWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
