import MoveableView from "../../helper/GraphView/MoveableView";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

// import {Node, Edge} from "../../helper/Graph/Prims";
import { TreeNode } from "../../helper/Tree/TreeNode";
import { Edge } from "../../helper/Graph/Prims";

import SurroundingBorder from "../../helper/GraphView/SurroundingBorder";
import Header from "../Header.js";

import "./Tree.css";

function Tree() {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [editable, setEditable] = React.useState(true);

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const [mouseDown, setMouseDown] = React.useState([false, false, false]);
  const [mouseOrigin, setMouseOrigin] = React.useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const [originClicked, setOriginClicked] = React.useState([
    false,
    false,
    false,
  ]);
  const [viewPosOrigin, setViewPosOrigin] = React.useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const [edgeNodeClicked, setEdgeNodeClicked] = React.useState(-1);

  const [viewPos, setViewPos] = React.useState({ x: 0, y: 0 });

  const [viewDiv, setViewDiv] = React.useState(null);
  const [viewDivRect, setViewDivRect] = React.useState(null);

  const [nodeSize, setNodeSize] = React.useState(30);

  const [renamingNode, setRenamingNode] = React.useState(-1);
  const [renamingEdge, setRenamingEdge] = React.useState(-1);

  const [gridLines, setGridLines] = React.useState([]);

  useEffect(() => {
    console.log("useEffect");
    // if(start) return;

    TreeNode.id_counter = 0;
    TreeNode.id_map = {};

    let nd = [
      new TreeNode(400, 100, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(200, 200, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(600, 200, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(100, 300, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(300, 300, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(500, 300, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(700, 300, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(50, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(150, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(250, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(350, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(450, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(550, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(650, 400, nodeSize, Math.floor(Math.random() * 100)),
      new TreeNode(750, 400, nodeSize, Math.floor(Math.random() * 100)),
    ];

    let ed = [
      nd[0].addEdge(nd[1], false),
      nd[0].addEdge(nd[2], false),
      nd[1].addEdge(nd[3], false),
      nd[1].addEdge(nd[4], false),
      nd[2].addEdge(nd[5], false),
      nd[2].addEdge(nd[6], false),
      nd[3].addEdge(nd[7], false),
      nd[3].addEdge(nd[8], false),
      nd[4].addEdge(nd[9], false),
      nd[4].addEdge(nd[10], false),
      nd[5].addEdge(nd[11], false),
      nd[5].addEdge(nd[12], false),
      nd[6].addEdge(nd[13], false),
      nd[6].addEdge(nd[14], false),
    ];

    nd[0].isStart = true;

    setNodes(nd);
    setEdges(ed);

    setViewDiv(document.getElementsByClassName("moveable_view")[0]);
    setViewDivRect(
      document
        .getElementsByClassName("moveable_view")[0]
        .getBoundingClientRect()
    );

    updateGridLines(
      0,
      0,
      document
        .getElementsByClassName("moveable_view")[0]
        .getBoundingClientRect()
    );

    // setStart(true);
  }, []);

  function updateMouseStatus(e, isDown) {
    let md = mouseDown;
    let mo = mouseOrigin;

    md[e.button] = isDown;
    mo[e.button] = { x: e.clientX, y: e.clientY };

    if (
      e.clientX >= viewDivRect.left &&
      e.clientX <= viewDivRect.right &&
      e.clientY >= viewDivRect.top &&
      e.clientY <= viewDivRect.bottom
    ) {
      let o = originClicked;
      let vpo = viewPosOrigin;

      o[e.button] = isDown;
      vpo[e.button] = { x: viewPos.x, y: viewPos.y };

      setOriginClicked(o);
      setViewPosOrigin(vpo);
    }

    setMouseDown(md);
    setMouseOrigin(mo);
  }

  function updateGridLines(viewX, viewY, vdr = viewDivRect) {
    let gl = [];

    let dx = 50;
    let dy = 50;
    let gridWidth = 1;

    for (let i = dx - (viewX % dx); i < vdr.width; i += dx) {
      gl.push({
        x: i - gridWidth,
        y: 0,
        width: gridWidth,
        height: vdr.height - 10,
      });
    }

    for (let i = dy - (viewY % dy); i < vdr.height; i += dy) {
      gl.push({
        x: 0,
        y: i - gridWidth,
        width: vdr.width - 10,
        height: gridWidth,
      });
    }

    setGridLines(gl);
  }

  function updateViewPos(x, y) {
    setViewPos({ x: x, y: y });
    updateGridLines(x, y);
  }

  function moveStartNode() {
    let newNodes = nodes.slice();
    for (let i = newNodes.length - 1; i >= 0; i--) {
      if (nodes[i].state == 1) {
        nodes[i].state = 2;
        break;
      }
    }
    setNodes(newNodes);
  }

  function moveEndNode() {
    let newNodes = nodes.slice();
    for (let i = 0; i < newNodes.length; i++) {
      if (nodes[i].state == 2) {
        nodes[i].originalPos = { x: nodes[i].x, y: nodes[i].y };
        nodes[i].state = 0;
      }
    }
    setNodes(newNodes);
  }

  function handleMouseDown(e, real = true) {
    if (!editable && e.button !== 1) return;

    if (real && (e.button === 1 || e.button === 2)) {
      console.log("prevent");
      e.preventDefault();
    }

    updateMouseStatus(e, true);

    // left click -> move node + select node
    if (e.button == 0) {
      moveStartNode();
    }

    // right click -> add edge
    if (e.button == 2) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].state == 1) {
          nodes[i].state = 3;
          setEdgeNodeClicked(i);
          break;
        }
      }
    }
  }

  function handleMouseUp(e, real = true) {
    if (!editable && e.button !== 1) return;

    if (real && (e.button === 1 || e.button === 2)) {
      e.preventDefault();
    }

    updateMouseStatus(e, false);

    // left click -> deselect all
    if (e.button == 0) {
      moveEndNode();
    }

    // right click -> add edge
    if (e.button == 2 && edgeNodeClicked != -1) {
      let j = -1;

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].state == 4) {
          j = i;
          nodes[i].state = 0;
        }
      }

      if (j != -1) {
        let e = nodes[edgeNodeClicked].addEdge(nodes[j]);
        if (e != null) {
          setEdges([...edges, e]);
        }
      }

      nodes[edgeNodeClicked].state = 0;
      setEdgeNodeClicked(-1);
    }
  }

  function handleMouseMove(e) {
    e.preventDefault();
    setMousePos({ x: e.clientX, y: e.clientY });

    if (editable)
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].checkMouseHover(
          e.clientX + viewPos.x - viewDivRect.left,
          e.clientY + viewPos.y - viewDivRect.top
        );
      }
    if (editable)
      for (let i = 0; i < edges.length; i++) {
        edges[i].checkMouseHover(
          e.clientX + viewPos.x - viewDivRect.left,
          e.clientY + viewPos.y - viewDivRect.top
        );
      }

    // if middle mouse button is moved
    if (mouseDown[1] && originClicked[1]) {
      updateViewPos(
        Math.max(0, viewPosOrigin[1].x + (mouseOrigin[1].x - e.clientX)),
        Math.max(0, viewPosOrigin[1].y + (mouseOrigin[1].y - e.clientY))
      );
      console.log(viewPos);
    }

    let inView =
      e.clientX >= viewDivRect.left &&
      e.clientX <= viewDivRect.right &&
      e.clientY >= viewDivRect.top &&
      e.clientY <= viewDivRect.bottom;

    // if left mouse button is moved
    if (mouseDown[0] && originClicked[0] && editable) {
      if (!inView)
        handleMouseUp(
          { button: 0, clientX: e.clientX, clientY: e.clientY },
          false
        );
      else {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].state == 2) {
            nodes[i].setPos({
              x: e.clientX - mouseOrigin[0].x + nodes[i].originalPos.x,
              y: e.clientY - mouseOrigin[0].y + nodes[i].originalPos.y,
            });
          }
        }
        for (let i = 0; i < edges.length; i++) {
          edges[i].resetMidpointDist();
        }
      }
    }

    // if right mouse button is moved
    if (mouseDown[2] && originClicked[2] && edgeNodeClicked != -1 && editable) {
      if (!inView)
        handleMouseUp(
          { button: 2, clientX: e.clientX, clientY: e.clientY },
          false
        );
      else {
        let maintain = true;
        let switchInd = -1;
        for (let i = 0; i < nodes.length; i++) {
          if (
            nodes[i].checkMouseClick(
              e.clientX + viewPos.x - viewDivRect.left,
              e.clientY + viewPos.y - viewDivRect.top
            ) &&
            i != edgeNodeClicked
          ) {
            switchInd = i;
          } else {
            if (nodes[i].state == 4) {
              nodes[i].state = 0;
              maintain = false;
            }
          }
        }

        if (maintain && switchInd != -1) {
          nodes[switchInd].state = 4;
        }
      }
    }
  }

  function handleKeyDown(e) {
    if (!editable && e.key !== "h") return;

    // Escape -> deselect all
    if (e.key === "Escape") {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].state == 2) {
          nodes[i].state = 0;
        }
      }
    }

    // Control -> select multiple nodes
    if (e.key === "Shift") {
      console.log(e.key);
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].state == 1) {
          nodes[i].state = 2;
        }
      }
    }

    // Control -> deselect
    if (e.key === "Control") {
      console.log(e.key);
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].state == 2) {
          nodes[i].state = 1;
        }
      }
    }

    // Add node
    if (e.key === "a") {
      console.log(e.key);
      let n = new TreeNode(
        mousePos.x + viewPos.x - viewDivRect.left,
        mousePos.y + viewPos.y - viewDivRect.top,
        nodeSize,
        Math.floor(Math.random() * 100)
      );
      setNodes([...nodes, n]);
    }

    // Delete node / edge
    if (
      (e.key === "x" || e.key === "Delete") &&
      mouseDown[0] === false &&
      mouseDown[2] === false &&
      renamingNode == -1
    ) {
      console.log(e.key);
      let found = false;
      for (let i = 0; i < nodes.length; i++) {
        // delete node
        if (nodes[i].state == 1 && !nodes[i].isStart) {
          delete TreeNode.id_map[nodes[i].id];

          let newNodes = nodes.filter((node, index) => index !== i);

          let max_id = 0;
          for (let i = 0; i < newNodes.length; i++) {
            if (newNodes[i].id > max_id) {
              max_id = newNodes[i].id;
            }
          }
          TreeNode.id_counter = max_id + 1;

          setNodes(newNodes);
          setEdges(
            edges.filter(
              (edge) => edge.node1 != nodes[i] && edge.node2 != nodes[i]
            )
          );
          found = true;
          break;
        }
      }
      if (!found)
        for (let i = 0; i < edges.length; i++) {
          // delete edge
          if (edges[i].state == 1) {
            if (edges[i].node2.id in edges[i].node1.edges) {
              // delete edges list
              delete edges[i].node1.edges[edges[i].node2.id];
            } else console.log("Error: Edge not found in node");
            if (edges[i].node1.id in edges[i].node2.edges) {
              delete edges[i].node2.edges[edges[i].node1.id];
            } else console.log("Error: Edge not found in node");

            setEdges(edges.filter((edge, index) => index !== i));
            break;
          }
        }
    }

    // [0-9] -> edit mode -> add digit
    if (!isNaN(parseInt(e.key))) {
      if (renamingNode != -1) {
        if (nodes[renamingNode].displayID >= 10000) {
          return;
        }
        let newNodes = nodes.slice();
        newNodes[renamingNode].displayID *= 10;
        newNodes[renamingNode].displayID += parseInt(e.key);
        setNodes(newNodes);
      } else if (renamingEdge != -1) {
        if (edges[renamingEdge].displayWeight >= 1000000) {
          return;
        }
        let newEdges = edges.slice();
        newEdges[renamingEdge].displayWeight *= 10;
        newEdges[renamingEdge].displayWeight += parseInt(e.key);
        setEdges(newEdges);
      }
    }

    // backspace + b -> edit mode -> delete last digit
    if (e.key === "Backspace" || e.key === "b") {
      if (renamingNode != -1) {
        let newNodes = nodes.slice();
        newNodes[renamingNode].displayID = Math.floor(
          nodes[renamingNode].displayID / 10
        );
        setNodes(newNodes);
      } else if (renamingEdge != -1) {
        let newEdges = edges.slice();
        newEdges[renamingEdge].displayWeight = Math.floor(
          edges[renamingEdge].displayWeight / 10
        );
        setEdges(newEdges);
      }
    }

    // e -> edit mode start
    if (e.key === "e" && renamingNode == -1 && renamingEdge == -1) {
      let found = false;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].state == 1) {
          let newNodes = nodes.slice();
          newNodes[i].state = 5;
          newNodes[i].displayID = 0;
          setRenamingNode(i);
          setNodes(newNodes);
          found = true;
          break;
        }
      }
      if (!found)
        for (let i = 0; i < edges.length; i++) {
          if (edges[i].state == 1) {
            let newEdges = edges.slice();
            newEdges[i].state = 3;
            newEdges[i].displayWeight = 0;
            setRenamingEdge(i);
            setEdges(newEdges);
            break;
          }
        }
    }

    // tab -> edit mode -> next node
    if (e.key === "Tab") {
      e.preventDefault();
      if (renamingNode != -1) {
        // node
        if (nodes[renamingNode].displayID in TreeNode.id_map) {
          return;
        }

        let newNodes = nodes.slice();
        let nextInd = (renamingNode + 1) % newNodes.length;
        // newNodes[renamingNode].setID(newNodes[renamingNode].displayID, edges);
        newNodes[renamingNode].value = newNodes[renamingNode].displayID;
        newNodes[renamingNode].state = 0;
        newNodes[nextInd].state = 5;
        newNodes[nextInd].displayID = 0;
        setNodes(newNodes);
        setRenamingNode(nextInd);
      } else if (renamingEdge != -1) {
        // edge
        let newEdges = edges.slice();
        newEdges[renamingEdge].weight = Math.max(
          0,
          newEdges[renamingEdge].weight
        );
        newEdges[renamingEdge].state = 0;
        newEdges[(renamingEdge + 1) % newEdges.length].state = 3;
        newEdges[(renamingEdge + 1) % newEdges.length].displayWeight = 0;
        setEdges(newEdges);
        setRenamingEdge((renamingEdge + 1) % newEdges.length);
      }
    }

    // q -> edit mode -> leave
    if (e.key === "q") {
      if (renamingNode != -1) {
        let newNodes = nodes.slice();
        newNodes[renamingNode].displayID = newNodes[renamingNode].value;
        newNodes[renamingNode].state = 0;
        setNodes(newNodes);
        setRenamingNode(-1);
        console.log(nodes, edges);
      } else if (renamingEdge != -1) {
        let newEdges = edges.slice();
        newEdges[renamingEdge].displayWeight = newEdges[renamingEdge].weight;
        newEdges[renamingEdge].state = 0;
        setEdges(newEdges);
        setRenamingEdge(-1);
      }
    }

    if (e.key == "g" && !mouseDown[0]) {
      handleMouseDown(
        { button: 0, clientX: mousePos.x, clientY: mousePos.y },
        false
      );
    }

    if (e.key == "h" && !mouseDown[1]) {
      handleMouseDown(
        { button: 1, clientX: mousePos.x, clientY: mousePos.y },
        false
      );
    }

    if (e.key == "j" && !mouseDown[2]) {
      handleMouseDown(
        { button: 2, clientX: mousePos.x, clientY: mousePos.y },
        false
      );
    }
  }

  function handleKeyUp(e) {
    if (!editable && e.key !== "h") return;

    if (e.key == "g") {
      handleMouseUp(
        { button: 0, clientX: mousePos.x, clientY: mousePos.y },
        false
      );
    }

    if (e.key == "h") {
      handleMouseUp(
        { button: 1, clientX: mousePos.x, clientY: mousePos.y },
        false
      );
    }

    if (e.key == "j") {
      handleMouseUp(
        { button: 2, clientX: mousePos.x, clientY: mousePos.y },
        false
      );
    }
  }

  return (
    <div
      className="tree"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Header title="DSA Visualization | Tree Algorithms" />
      <div className="treeMenu">
        <button
          className={`searchMenuItem ${editable ? "searchMenuItemActive" : ""}`}
        >
          Edit
        </button>
        <div style={{ width: "50px" }}></div>

        <button className={`searchMenuItem `}>Min Heap</button>
        <button className={`searchMenuItem`}>Dijkstra's</button>
        <button className={`searchMenuItem`}>Kruskall's</button>
        <button className={`searchMenuItem`}>Prim's</button>
      </div>
      <div className="treeGraph">
        <MoveableView
          nodes={nodes}
          edges={edges}
          viewPos={viewPos}
          gridLines={gridLines}
          editable={editable}
        />
      </div>
      <SurroundingBorder
        x={viewDivRect == null ? 0 : viewDivRect.left}
        y={viewDivRect == null ? 0 : viewDivRect.top}
        width={viewDivRect == null ? 0 : viewDivRect.width}
        height={viewDivRect == null ? 0 : viewDivRect.height}
        zindex={-1}
      />
    </div>
  );
}

export default Tree;
