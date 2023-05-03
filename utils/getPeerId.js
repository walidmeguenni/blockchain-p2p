const crypto = require("crypto");

exports.getPeerId = (address) => {
  if (!address) {
    throw new Error("Address is required.");
  }
  return crypto.createHash("md5").update(address).digest("hex").toString();
};
