const os = require("os");
const crypto = require("crypto");
const WebSocket = require("ws");
const { PORT, SEED_NODE_ADDRESS } = require("../env");

class Peer {
  constructor() {
    this.address = this.setAddress();
    this.id = this.generateId();
    this.openedPeers = [];
    this.connectedPeers = [];
    this.olsrPeers = [];
    this.gossipPeers = [];
  }

  setAddress() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
      const iface = interfaces[name];
      for (const entry of iface) {
        if (entry.family === "IPv4" && !entry.internal) {
          return `ws://${entry.address}:${PORT}`;
        }
      }
    }
  }

  generateId() {
    if (!this.address) {
      throw new Error("Address is required.");
    }
    return crypto
      .createHash("md5")
      .update(this.address)
      .digest("hex")
      .toString();
  }

  getPeers = () => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(SEED_NODE_ADDRESS);

      ws.addEventListener("open", () => {
        console.log(
          `#----------Connected To Seed Node ${SEED_NODE_ADDRESS}`
        );
        const message = {
          id: this.id,
          port: PORT,
          type: "CONNECT_TO_NETWORK",
        };
        ws.send(JSON.stringify(message));
      });

      ws.addEventListener("message", (event) => {
        console.log("#");
        console.log("#");
        console.log("#");
        console.log("#");
        console.log("#----------Received Data From Seed Node");
        console.log("#");
        console.log("#");
        console.log("#");
        console.log("#");
        resolve(JSON.parse(event.data));
      });

      ws.addEventListener("error", (error) => {
        console.error("Error connecting to server:", error);
        reject(error);
      });

      ws.addEventListener("close", () => {
        console.log("Disconnected from server");
      });
    });
  };

  getPeersNumbers = () => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(SEED_NODE_ADDRESS);

      ws.addEventListener("open", () => {
        console.log(
          `#----------Connected To Seed Node ${SEED_NODE_ADDRESS}`
        );
        const message = {
          type: "GET_PEERS_NUMBER",
        };
        ws.send(JSON.stringify(message));
      });

      ws.addEventListener("message", (event) => {
        console.log("#");
        console.log("#");
        console.log("#");
        console.log("#");
        console.log("#----------Received Data From Seed Node");
        console.log("#");
        console.log("#");
        console.log("#");
        console.log("#");
        resolve(JSON.parse(event.data));
      });

      ws.addEventListener("error", (error) => {
        console.error("Error connecting to server:", error);
        reject(error);
      });

      ws.addEventListener("close", () => {
        console.log("Disconnected from server");
      });
    });
  };

  static getAddressPeer = (req) => {
    return (
      req.headers["x-forwarded-for"] || req.connection.remoteAddress
    ).replace(/^::ffff:/, "");
  };
}

const Node = new Peer();
module.exports = { Node, Peer };
