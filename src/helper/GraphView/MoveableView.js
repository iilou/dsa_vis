import React from "react";

import NodeDIV from "../Graph/Node";
import EdgeDIV from "../Graph/Edge";

import "./MoveableView.css";

export default function MoveableView({
  nodes,
  edges,
  viewPos,
  gridLines,
  editable,
}) {
  return (
    <div
      className="moveable_view"
      style={{ backgroundColor: editable ? "#d0d0d0" : "#f3f3f3" }}
    >
      {gridLines.map((line, index) => {
        return editable ? (
          <div
            key={index}
            className="grid_line"
            style={{
              left: line.x,
              top: line.y,
              width: line.width,
              height: line.height,
            }}
          ></div>
        ) : null;
      })}
      {edges.map((eg, index) => {
        return <EdgeDIV key={index} edge={eg} viewPos={viewPos} />;
      })}
      {nodes.map((nd, index) => {
        return <NodeDIV key={index} node={nd} viewPos={viewPos} />;
      })}
    </div>
  );
}
