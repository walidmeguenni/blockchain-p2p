const { Level } = require("level");
const fs = require("fs");
const path = require("path");

class Database {
  constructor(peerId) {
    this.dir = path.join(__dirname, "..", "db", peerId);
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
      this.db = new Level(this.dir, { valueEncoding: "json" });
    } else {
      this.db = new Level(this.dir, { valueEncoding: "json" });
    }
  }

  async createDb() {
    return new Promise((resolve, reject) => {
      this.db.open((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async storeBlock(key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getBlock(key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }
}

module.exports = Database;
