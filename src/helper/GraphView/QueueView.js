import QueueViewItem from "./QueueViewItem.js";

import "./Queue.css";

function QueueView({ nodeQueue, edgeQueue, nodes, edges }) {
  return (
    <div className="queueView">
      <div className="queueTitle"> Queue </div>
      {nodeQueue.map((node, index) => {
        // if (index >= 10) return null;
        return (
          <QueueViewItem
            index={index + 1}
            node={nodes[node]}
            edge={edges[edgeQueue[index]]}
          />
        );
      })}
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#565656",
          borderRadius: "0px 0px 5px 5px",
          textAlign: "center",
          color: "white",
          fontSize: "12px",
          fontWeight: "900",
        }}
      >
        {nodeQueue.length > 10 ? "..." : null}
      </div>
    </div>
  );
}

function QueueMirror() {
  return <div className="queueMirror"></div>;
}

export { QueueView, QueueMirror };
