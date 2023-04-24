const os = require("os");
exports.getAddress = (port) => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const iface = interfaces[name];
    for (const entry of iface) {
      if (entry.family === "IPv4" && !entry.internal) {
        return `ws://${entry.address}:${port}`;
      }
    }
  }
};
