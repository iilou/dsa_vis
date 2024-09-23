// import {Node, Edge} from "../../helper/Prims.js"

import "./Queue.css";

const state_colors = [
  "#4f4f4f",
  "#4f8f4f",
  "#6f4f6f",
  "#afaf2f",
  "#9f9f2f",
  "#af2f2f",
  "#555555",
  "#55bb55",
  "#bb5555",
  "#bbbb55",
  "#5555bb",
  "#aa9944",
];

export default function QueueView({ index, node, edge }) {
  return (
    <div className="queueViewItem">
      <div
        className="queueViewItemInd"
        style={{
          backgroundColor:
            index == 1
              ? "#ddcc33"
              : index == 2
              ? "#b0b0b0"
              : index == 3
              ? "#CD7F32"
              : "#787878",
          boxShadow:
            index == 1
              ? "0px 0px 3px 2px #ddcc33"
              : index == 2
              ? "0px 0px 3px 2px #b0b0b0"
              : index == 3
              ? "0px 0px 3px 2px #CD7F32"
              : "0px 0px 3px 2px #787878",
          border:
            index == 1
              ? "2px solid #bb9922"
              : index == 2
              ? "2px solid #888888"
              : index == 3
              ? "2px solid #aa7722"
              : "2px solid #555555",
        }}
      >
        {index}
      </div>
      <div
        className="queueViewItemNode"
        style={{ backgroundColor: state_colors[node.state] }}
      >
        {node.id}
      </div>
      <div className="queueViewItemEdge">
        {edge == null ? -1 : edge.weighted ? edge.weight : ""}
      </div>
      <div
        className="queueViewItemNode"
        style={{
          backgroundColor:
            state_colors[edge == null ? node.state : edge.other(node).state],
        }}
      >
        {edge == null ? node.id : edge.other(node).id}
      </div>
    </div>
  );
}
