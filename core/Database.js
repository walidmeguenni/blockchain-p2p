const {Level} = require('level');

class Database {
  constructor(dbPath) {
    this.db = new Level(dbPath, { valueEncoding: 'json' });
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
