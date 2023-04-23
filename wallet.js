const EC = require("elliptic").ec;

class Wallet {
  constructor() {
    this.accounts = [];
    this.ec = new EC("secp256k1");
  }

  create() {
    const keyPair = this.ec.genKeyPair();
    const publicKey = keyPair.getPublic().encode("hex");
    const privateKey = keyPair.getPrivate("hex");
    this.accounts.push({
      publicKey: publicKey,
      privateKey: privateKey,
    });
    return {
      publicKey: publicKey,
      privateKey: privateKey,
    };
  }

  getWallet() {
    return this.accounts;
  }
}
const wallet = new Wallet();
module.exports = { Wallet, wallet };
