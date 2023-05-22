const os = require("os");
const crypto = require("crypto");
const WebSocket = require("ws");
require("dotenv").config();

class Peer {
  constructor() {
    this.address = this.setAddress();
    this.id = this.generateId();
  }

  setAddress() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
      const iface = interfaces[name];
      for (const entry of iface) {
        if (entry.family === "IPv4" && !entry.internal) {
          return `ws://${entry.address}:${process.env.PORT}`;
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
      const ws = new WebSocket(process.env.SEED_NODE_ADDRESS);

      ws.addEventListener("open", () => {
        console.log(
          `#----------Connected To Seed Node ${process.env.SEED_NODE_ADDRESS}`
        );
        const message = { id: this.id, port: process.env.PORT };
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
