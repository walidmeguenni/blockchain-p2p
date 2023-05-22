// File C: synchronization module
class Neighbors {
  constructor() {
    this.table = [];
  }
  push(id, nodes) {
    const index = this.table.findIndex((peer) => peer.id === id);
    if (index !== -1) {
      // If the idPeer already exists, replace the neighbors value

      this.table[index].neighbors = nodes;
    } else {
      // If the idPeer doesn't exist, insert a new entry
      this.table.push({ id: id, neighbors: nodes });
    }
  }

  get() {
    return this.table;
  }
}
const neighbors = new Neighbors();
module.exports = neighbors;
