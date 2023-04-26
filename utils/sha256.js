const crypto = require("crypto");
exports.SHA256 = (message) => {
  return crypto.createHash("sha256").update(message).digest("hex");
};
