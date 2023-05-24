const { Node } = require("../../core/Peer");
const { Wmcoin } = require("../../core/main");

exports.getStatistic = async (req, res) => {
  const statistic = [];
  const nbrBlock = Wmcoin.chain.length;
  const nbrTxns = Wmcoin.transactions.length;
  const nbrMsg = nbrBlock === 1 ? nbrTxns + 1 : nbrTxns + nbrBlock * 11 - 9;
  const nbrTotalePeers = await Node.getPeersNumbers();
  const nbrPeerGossip = Node.gossipPeers.length;
  const nbrPeerOlsr = Node.olsrPeers.length;
  const nbrBroacastMsg = Math.pow(nbrTotalePeers, nbrMsg) * 2;
  const nbrGossipMsg = Math.pow(nbrPeerGossip, nbrMsg) * 10;
  const nbrOlsrMsg = Math.pow(nbrPeerOlsr, nbrMsg) * 2;
  if ((nbrBlock === 0 && nbrTxns === 0) || nbrTotalePeers === 0) {
    statistic.push({
      protocol: "Broadcast",
      dataPoints: [
        { nbrMsg: 0, messageCount: 0 },
        { nbrMsg: 0, messageCount: 0 },
      ],
    });
    statistic.push({
      protocol: "Gossip",
      dataPoints: [
        { nbrMsg: 0, messageCount: 0 },
        { nbrMsg: 0, messageCount: 0 },
      ],
    });
    statistic.push({
      protocol: "Olsr",
      dataPoints: [
        { nbrMsg: 0, messageCount: 0 },
        { nbrMsg: 0, messageCount: 0 },
      ],
    });
  } else {
    statistic.push({
      protocol: "Broadcast",
      dataPoints: [
        { nbrMsg: 0, messageCount: 0 },
        { nbrMsg: nbrMsg, messageCount: nbrBroacastMsg },
      ],
    });
    statistic.push({
      protocol: "Gossip",
      dataPoints: [
        { nbrMsg: 0, messageCount: 0 },
        { nbrMsg: nbrMsg, messageCount: nbrGossipMsg },
      ],
    });
    statistic.push({
      protocol: "Olsr",
      dataPoints: [
        { nbrMsg: 0, messageCount: 0 },
        { nbrMsg: nbrMsg, messageCount: nbrOlsrMsg },
      ],
    });
  }

  res.status(201).json({ statistic });
};
