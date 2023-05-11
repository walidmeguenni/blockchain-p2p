const crypto = require("crypto");
const abi = require("ethereumjs-abi");
const { SHA256 } = require("../utils/sha256");
class SmartContract {
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
  static generateFunctionSignature(methodAbi) {
    const signature = SHA256(methodAbi).toString();
    return signature;
  }
  static encodeParameters(inputs, args) {
    const types = inputs.map((input) => input.type);
    const encoded = abi.rawEncode(types, args).toString("hex");
    return encoded;
  }
  static decodeParameters(outputs, data) {
    const types = outputs.map((output) => output.type);
    const decodedParams = abi.rawDecode(types, data);
    const outputObject = {};
    decodedParams.forEach((param, i) => {
      const paramName = outputs[i].name || i;
      outputObject[paramName] = abi.decodeParameter(types[i], param);
    });
    return outputObject;
  }
}

module.exports = SmartContract;
