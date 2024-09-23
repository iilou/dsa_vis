import { Edge } from "../Graph/Prims.js";

class TreeNode {
  constructor(x, y, r, value) {
    this.id = TreeNode.generateID();
    this.dist = null;

    this.value = value;
    this.displayID = value;

    this.x = x;
    this.y = y;
    this.r = r;
    this.originalPos = { x: x, y: y };

    this.edges = {};

    this.adjNodeId = [];

    this.parentId = null;
    this.childrenId = [];

    this.isStart = false;

    this.state = 0;
  }

  static id_counter = 0;
  static id_map = {};
  static generateID() {
    let id = TreeNode.id_counter;
    TreeNode.id_counter++;
    TreeNode.id_map[id] = true;
    return id;
  }

  setPos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }

  move(x, y) {
    this.x = x;
    this.y = y;

    this.originalPos = { x: x, y: y };
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

  addEdge(node, weighted, ignoreWarning = false, ignoreCheck = false) {
    if (node.id in this.edges && !ignoreCheck) {
      // alert("Edge already exists");
      if (!ignoreWarning) console.log("Edge already exists");
      return null;
    }
    return new Edge(this, node, weighted);
  }
}

export { TreeNode };
