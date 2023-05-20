exports.hasAvilablePeers = (listPeers) => {
  if (listPeers.length !== 0) {
    return true;
  } else {
    return false;
  }
};

exports.getAddressPeer = (req) => {
  return (
    req.headers["x-forwarded-for"] || req.connection.remoteAddress
  ).replace(/^::ffff:/, "");
};
