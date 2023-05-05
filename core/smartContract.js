const crypto = require("crypto");
class SamartContract {
  constructor(abi, bytecode) {
    this.abi = abi;
    this.bytecode = bytecode;
    this.id = this.generateId(this.abi, this.bytecode);
    this.contract = { id: this.id, abi: this.abi, bytecode: this.bytecode };
  }

  generateId(abi, bytecode) {
    const hash = crypto.createHash("sha256");
    const data = abi + "," + bytecode;
    hash.update(data);
    return hash.digest("hex");
  }
}

module.exports = SamartContract;
