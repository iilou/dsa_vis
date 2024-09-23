class Node {
  constructor(x, y, r, id = null) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.state = 0;
    this.edges = {};

    // this.dist = Math.random() > 0.5 ? null : Math.floor(Math.random() * 100);
    this.dist = null;

    this.originalPos = { x: x, y: y };

    if (id == null) this.id = Node.generateID();
    else this.id = id;
    this.displayID = this.id;

    this.isStart = false;
  }

  static id_counter = 0;
  static id_map = {};
  static generateID() {
    let id = Node.id_counter;
    Node.id_counter++;
    Node.id_map[id] = true;
    return id;
  }

  move(x, y) {
    this.x = x;
    this.y = y;

    this.originalPos = { x: x, y: y };
  }

  setID(id, edgeList) {
    if (id in Node.id_map) {
      alert("ID already exists");
      return null;
    }
    delete Node.id_map[this.id];
    let oldID = this.id;
    this.id = id;
    this.displayID = id;
    Node.id_map[id] = true;

    for (let i = 0; i < edgeList.length; i++) {
      if (edgeList[i].node1.id === id) {
        delete edgeList[i].node2.edges[oldID];
        edgeList[i].node2.edges[id] = edgeList[i];

        console.log(edgeList[i].node1.id, edgeList[i].node2.id);
      } else if (edgeList[i].node2.id === id) {
        delete edgeList[i].node1.edges[oldID];
        edgeList[i].node1.edges[id] = edgeList[i];
        console.log(edgeList[i].node1.id, edgeList[i].node2.id);
      }
    }
  }

  checkMouseHover(x, y) {
    if (this.state <= 1) {
      this.state =
        (x - this.x) ** 2 + (y - this.y) ** 2 <= (this.r + 5) ** 2 ? 1 : 0;
    }
  }

  checkMouseClick(x, y) {
    // allow for a little bit of leeway
    return (x - this.x) ** 2 + (y - this.y) ** 2 <= (this.r + 5) ** 2;
  }

  setPos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }

  resetPos() {
    this.x = this.originalPos.x;
    this.y = this.originalPos.y;
  }

  addEdge(node, weighted, ignoreWarning = false, ignoreCheck = false) {
    if (node.id in this.edges && !ignoreCheck) {
      // alert("Edge already exists");
      if (!ignoreWarning) console.log("Edge already exists");
      return null;
    }
    return new Edge(this, node, weighted);
  }

  reset() {
    this.state = 0;
    this.dist = null;
  }
}

class Edge {
  constructor(node1, node2, weighted = false) {
    this.node1 = node1;
    this.node2 = node2;
    this.midPoint = 0;
    this.dist = 0;

    node1.edges[node2.id] = this;
    node2.edges[node1.id] = this;

    this.state = 0;

    this.weight = Math.floor(Math.random() * 100);
    this.displayWeight = this.weight;
    this.weighted = weighted;
    // this.weight = null;

    this.resetMidpointDist();
  }

  resetMidpointDist() {
    this.midPoint = {
      x: (this.node1.x + this.node2.x) / 2,
      y: (this.node1.y + this.node2.y) / 2,
    };
    this.dist = Math.sqrt(
      (this.node1.x - this.node2.x) ** 2 + (this.node1.y - this.node2.y) ** 2
    );

    if (this.node1.x > this.node2.x) {
      let temp = this.node1;
      this.node1 = this.node2;
      this.node2 = temp;
    }
  }

  /* ----------------------------------------- helper ----------------------------------------- */
  sqr(x) {
    return x * x;
  }
  dist2(v, w) {
    return this.sqr(v.x - w.x) + this.sqr(v.y - w.y);
  }
  dist_to_segment_squared(p, v, w) {
    let l2 = this.dist2(v, w);
    if (l2 === 0) return this.dist2(p, v);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return this.dist2(p, {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y),
    });
  }
  /* -----------------------------------------        ----------------------------------------- */

  /** Dist from point{x:, y:} to edge segment */
  dist_from_point(point) {
    // line stops at the end points
    return Math.sqrt(
      this.dist_to_segment_squared(point, this.node1, this.node2)
    );
  }

  checkMouseHover(x, y) {
    if (this.state <= 1) {
      this.state = this.dist_from_point({ x: x, y: y }) <= 18 ? 1 : 0;
    }
  }

  checkMouseClick(x, y) {
    return this.dist_from_point({ x: x, y: y }) <= 8;
  }

  other(node) {
    return node.id === this.node1.id ? this.node2 : this.node1;
  }
}

export { Node, Edge };
