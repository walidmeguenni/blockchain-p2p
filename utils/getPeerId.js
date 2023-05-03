const crypto = require("crypto");

exports.getPeerId = (address) => {
  return crypto.createHash("md5").update(address).digest("hex");
};
