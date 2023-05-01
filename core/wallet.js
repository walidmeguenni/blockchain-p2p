const EC = require("elliptic").ec;

class Wallet {
  constructor() {
    this.accounts = [];
    this.ec = new EC("secp256k1");
  }

  create(password) {
    const keyPair = this.ec.genKeyPair();
    const publicKey = keyPair.getPublic().encode("hex");
    const privateKey = keyPair.getPrivate("hex");
    this.accounts.push({
      publicKey: publicKey,
      privateKey: privateKey,
      password:password,
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
