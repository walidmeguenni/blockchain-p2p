const app = require("../rpc/app");
const http = require("http");
const { startApp } = require("../ws/connect");
const { startWebSocketServer } = require("../ws/socket");
const { shape } = require("../services");
const { PORT } = require("../env");

startApp();


app.set("port", PORT);

const server = http.createServer(app);

startWebSocketServer(server);

server.listen(PORT, () => {
  console.log(shape);
  console.log(
    `#----------Node Listening On Port http://localhost:${PORT}`
  );
  console.log("#");
  console.log("#");
  console.log("#");
  console.log("#");
});
