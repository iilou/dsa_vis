import {Link} from 'react-router-dom';

import MoveableView from "../../helper/GraphView/MoveableView.js"
import SurroundingBorder from '../../helper/GraphView/SurroundingBorder.js';
import Header from '../Header.js';
import {Node, Edge} from "../../helper/Graph/Prims.js"

import Graph from "../../helper/Graph/Graph.js";
import {QueueView, QueueMirror} from "../../helper/GraphView/QueueView.js";

import React, { useState, useEffect } from 'react';

import "./Search.css";

function Search() {

    const [nodes, setNodes] = React.useState([]);
    const [edges, setEdges] = React.useState([]);
    const [editable, setEditable] = React.useState(true);
    // const [start, setStart] = React.useState(false);

    const [mousePos, setMousePos] = React.useState({x: 0, y: 0});

    const [mouseDown, setMouseDown] = React.useState([false, false, false]);
    const [mouseOrigin, setMouseOrigin] = React.useState([{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]);

    const [originClicked, setOriginClicked] = React.useState([false, false, false]);
    const [viewPosOrigin, setViewPosOrigin] = React.useState([{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]);

    const [edgeNodeClicked, setEdgeNodeClicked] = React.useState(-1);

    const [viewPos, setViewPos] = React.useState({x: 0, y: 0});

    const [viewDiv, setViewDiv] = React.useState(null);
    const [viewDivRect, setViewDivRect] = React.useState(null);

    // const [keyDown, setKeyDown] = React.useState({});
    const [renamingNode, setRenamingNode] = React.useState(-1);
    const [renamingEdge, setRenamingEdge] = React.useState(-1);

    const [gridLines, setGridLines] = React.useState([]);

    const [algorithm, setAlgorithm] = React.useState("bfs");

    const [graph, setGraph] = React.useState(new Graph());

    const [nodeQueue, setNodeQueue] = React.useState([]);
    const [edgeQueue, setEdgeQueue] = React.useState([]);

    const [nodeSize, setNodeSize] = React.useState(20);
    

    // start
    useEffect(() => {
        console.log("useEffect");

        populate();

        setViewDiv(document.getElementsByClassName("moveable_view")[0]);
        setViewDivRect(document.getElementsByClassName("moveable_view")[0].getBoundingClientRect());

        updateGridLines(0, 0, document.getElementsByClassName("moveable_view")[0].getBoundingClientRect());

        // setStart(true);
    }, []);


    function clearView(){
        setEdges([]);

        let newNodes = [];
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].isStart) newNodes.push(nodes[i]);
        }
        newNodes[0].dist = null;
        newNodes[0].state = 0;
        newNodes[0].edges = {};

        Node.id_counter = 1;
        Node.id_map = {0: true};

        setNodes(newNodes);
    }

    function populate(){

        Node.id_counter = 0;
        Node.id_map = {};
        
        let lattice_cols = 6;
        let lattice_rows = 6;
        let lattice_x_spacing = 160;
        let lattice_y_spacing = 80;
        let lattice_x_offset = 50;
        let lattice_x_odd_offset = 100;
        let lattice_y_offset = 50;
        let lattice_y_odd_offset = -20;

        let lattice_nodes = Array(lattice_rows).fill(null).map(() => Array(lattice_cols).fill(null));
        let lattice_edges = [];

        for(let i = 0; i < lattice_rows; i++){
            let is_odd = i%2 == 1;
            for(let j = 0; j < lattice_cols; j++){
                lattice_nodes[i][j] = new Node(lattice_x_offset + j*lattice_x_spacing + (is_odd?lattice_x_odd_offset:0), lattice_y_offset + i*lattice_y_spacing + (is_odd?lattice_y_odd_offset:0), nodeSize);
            }
        }

        // add edges
        for(let i = 0; i < lattice_rows-2; i++){ // vertical edges
            for(let j = 0; j < lattice_cols; j++){
                lattice_edges.push(lattice_nodes[i][j].addEdge(lattice_nodes[i+2][j], true, true));
            }
        }
        for(let i = 0; i < lattice_rows-1; i++){ // cross edges
            let is_odd = i%2 == 1;
            for(let j = 0; j < lattice_cols; j++){
                let n1 = lattice_nodes[i][j];
                let jleft = j+(is_odd?0:-1);
                let jright = j+(is_odd?1:0);
                if(jleft >= 0) lattice_edges.push(n1.addEdge(lattice_nodes[i+1][jleft], true, true));
                if(jright < lattice_cols) lattice_edges.push(n1.addEdge(lattice_nodes[i+1][jright], true, true));
            }
        }
        for(let i = 0; i < lattice_rows; i++){ // horizontal edges
            for(let j = 0; j < lattice_cols - 1; j++){
                lattice_edges.push(lattice_nodes[i][j].addEdge(lattice_nodes[i][j+1], true, true));
            }
        }

        lattice_nodes[0][0].isStart = true;

        setNodes(lattice_nodes.flat().filter((node) => node != null));
        setEdges(lattice_edges);
    }

    function updateMouseStatus(e, isDown){
        let md = mouseDown;
        let mo = mouseOrigin;

        md[e.button] = isDown;
        mo[e.button] = {x: e.clientX, y: e.clientY};

        if(e.clientX >= viewDivRect.left && e.clientX <= viewDivRect.right && e.clientY >= viewDivRect.top && e.clientY <= viewDivRect.bottom){
            let o = originClicked;
            let vpo = viewPosOrigin;

            o[e.button] = isDown;
            vpo[e.button] = {x: viewPos.x, y: viewPos.y};

            setOriginClicked(o);
            setViewPosOrigin(vpo);
        }

        setMouseDown(md);
        setMouseOrigin(mo);
    }

    function updateGridLines(viewX, viewY, vdr= viewDivRect){
        let gl = [];

        let dx = 50;
        let dy = 50;
        let gridWidth = 1;

        for(let i = dx-(viewX%dx); i < vdr.width; i += dx){
            gl.push({x: i-gridWidth, y: 0, width: gridWidth, height: vdr.height - 10});
        }

        for(let i = dy-(viewY%dy); i < vdr.height; i += dy){
            gl.push({x: 0, y: i-gridWidth, width: vdr.width - 10, height: gridWidth});
        }

        setGridLines(gl);
    }

    function updateViewPos(x, y){
        setViewPos({x: x, y: y});
        updateGridLines(x, y);
    }

    function moveStartNode(){
        let newNodes = nodes.slice();
        for(let i = newNodes.length-1; i >= 0; i--){
            if(nodes[i].state == 1){
                nodes[i].state = 2;
                break;
            }
        }
        setNodes(newNodes);
    }

    function moveEndNode(){
        let newNodes = nodes.slice();
        for(let i = 0; i < newNodes.length; i++){
            if(nodes[i].state == 2){
                nodes[i].originalPos = {x: nodes[i].x, y: nodes[i].y};
                nodes[i].state = 0;
            }
        }
        setNodes(newNodes);
    }

    function handleMouseDown(e, real=true){
        if(!editable && e.button !== 1) return;

        if(real && (e.button === 1 || e.button === 2)){
            console.log("prevent");     
            e.preventDefault();
        }

        updateMouseStatus(e, true);

        // left click -> move node + select node
        if(e.button == 0){
            moveStartNode();
        }

        // right click -> add edge
        if(e.button == 2){
            for(let i = 0; i < nodes.length; i++){ 
                if(nodes[i].state == 1){ 
                    nodes[i].state = 3; 
                    setEdgeNodeClicked(i);
                    break;
                } 
            }
        }
    }

    function handleMouseUp(e, real=true){
        if(!editable && e.button !== 1) return;

        if(real && (e.button === 1 || e.button === 2)){
            e.preventDefault();
        }

        updateMouseStatus(e, false);

        // left click -> deselect all
        if(e.button == 0) {
            moveEndNode();
        }

        // right click -> add edge
        if(e.button == 2 && edgeNodeClicked != -1){
            let j = -1;

            for(let i = 0; i < nodes.length; i++){
                if(nodes[i].state == 4){
                    j = i;
                    nodes[i].state = 0;
                }
            }

            if(j != -1){
                let e = nodes[edgeNodeClicked].addEdge(nodes[j], true);
                if(e != null){
                    setEdges([...edges, e]);
                }
            }

            nodes[edgeNodeClicked].state = 0;
            setEdgeNodeClicked(-1);
        }
    }

    function handleMouseMove(e){

        e.preventDefault();
        setMousePos({x: e.clientX, y: e.clientY});

        if(editable) for(let i = 0; i < nodes.length; i++){ nodes[i].checkMouseHover(e.clientX + viewPos.x - viewDivRect.left, e.clientY + viewPos.y - viewDivRect.top); }
        if(editable) for(let i = 0; i < edges.length; i++){ edges[i].checkMouseHover(e.clientX + viewPos.x - viewDivRect.left, e.clientY + viewPos.y - viewDivRect.top); }

        // if middle mouse button is moved
        if(mouseDown[1] && originClicked[1]){
            updateViewPos(Math.max(0, (viewPosOrigin[1].x + (mouseOrigin[1].x - e.clientX))), Math.max(0, (viewPosOrigin[1].y + (mouseOrigin[1].y - e.clientY)) ));
            console.log(viewPos);
        }

        // if left mouse button is moved
        if(mouseDown[0] && originClicked[0] && editable){
            for(let i = 0; i < nodes.length; i++){ 
                if(nodes[i].state == 2){ 
                    nodes[i].setPos({x: e.clientX - mouseOrigin[0].x + nodes[i].originalPos.x, y: e.clientY - mouseOrigin[0].y + nodes[i].originalPos.y});
                }
            }
            for(let i = 0; i < edges.length; i++){ edges[i].resetMidpointDist(); }
        }

        // if right mouse button is moved
        if(mouseDown[2] && originClicked[2] && edgeNodeClicked != -1 && editable){
            let maintain = true;
            let switchInd = -1;
            for(let i = 0; i < nodes.length; i++){
                if(nodes[i].checkMouseClick(e.clientX + viewPos.x - viewDivRect.left, e.clientY + viewPos.y - viewDivRect.top) && i != edgeNodeClicked){
                    switchInd = i;
                }
                else{
                    if(nodes[i].state == 4){
                        nodes[i].state = 0;
                        maintain = false;
                    }
                }
            }

            if(maintain && switchInd != -1){
                nodes[switchInd].state = 4;
            }
        }
    }

    function handleKeyDown(e){

        if(!editable && e.key !== "h") return;

        // Escape -> deselect all
        if(e.key === "Escape"){
            for(let i = 0; i < nodes.length; i++){ if(nodes[i].state == 2){nodes[i].state = 0; } }
        }

        // Control -> select multiple nodes
        if(e.key === "Shift"){
            console.log(e.key);
            for(let i = 0; i < nodes.length; i++){ if(nodes[i].state == 1){ nodes[i].state = 2; } }
        }

        // Control -> deselect
        if(e.key === "Control"){
            console.log(e.key);
            for(let i = 0; i < nodes.length; i++){ if(nodes[i].state == 2){ nodes[i].state = 1; } }
        }

        // Add node
        if(e.key === "a"){
            console.log(e.key);
            let n = new Node(mousePos.x + viewPos.x - viewDivRect.left, mousePos.y + viewPos.y - viewDivRect.top, nodeSize);
            setNodes([...nodes, n]);
        }

        // Delete node / edge
        if((e.key === "x" || e.key === "Delete") && mouseDown[0] === false && mouseDown[2] === false && renamingNode == -1){
            console.log(e.key);
            let found = false;
            for(let i = 0; i < nodes.length; i++){
                if(nodes[i].state == 1 && !nodes[i].isStart){
                    delete Node.id_map[nodes[i].id];

                    let newNodes = nodes.filter((node, index) => index !== i);

                    let max_id = 0;
                    for(let i = 0; i < newNodes.length; i++){
                        if(newNodes[i].id > max_id){
                            max_id = newNodes[i].id;
                        }
                    }
                    Node.id_counter = max_id + 1;

                    setNodes(newNodes);
                    setEdges(edges.filter((edge) => edge.node1 != nodes[i] && edge.node2 != nodes[i]));
                    found = true;
                    break;
                }
            }
            if(!found) for(let i = 0; i < edges.length; i++){
                if(edges[i].state == 1){
                    if(edges[i].node2.id in edges[i].node1.edges){
                        delete edges[i].node1.edges[edges[i].node2.id];
                    } else console.log("Error: Edge not found in node");
                    if(edges[i].node1.id in edges[i].node2.edges){
                        delete edges[i].node2.edges[edges[i].node1.id];
                    } else console.log("Error: Edge not found in node");
                    setEdges(edges.filter((edge, index) => index !== i));
                    break;
                }
            }

        }

        // [0-9] -> edit mode -> add digit
        if(!isNaN(parseInt(e.key))){ 
            if(renamingNode != -1){
                if(nodes[renamingNode].displayID >= 10000){
                    return;
                }
                let newNodes = nodes.slice();
                newNodes[renamingNode].displayID *= 10;
                newNodes[renamingNode].displayID += parseInt(e.key);
                setNodes(newNodes);
            } else if (renamingEdge != -1){
                if(edges[renamingEdge].displayWeight >= 1000000){
                    return;
                }
                let newEdges = edges.slice();
                newEdges[renamingEdge].displayWeight *= 10;
                newEdges[renamingEdge].displayWeight += parseInt(e.key);
                setEdges(newEdges);
            }
        }

        // backspace + b -> edit mode -> delete last digit
        if(e.key === "Backspace" || e.key === "b"){
            if(renamingNode != -1){
                let newNodes = nodes.slice();
                newNodes[renamingNode].displayID = Math.floor(nodes[renamingNode].displayID / 10);
                setNodes(newNodes);
            } else if (renamingEdge != -1){
                let newEdges = edges.slice();
                newEdges[renamingEdge].displayWeight = Math.floor(edges[renamingEdge].displayWeight / 10);
                setEdges(newEdges);
            }
        }

        // e -> edit mode start
        if(e.key === "e" && renamingNode == -1 && renamingEdge == -1){
            let found = false;
            for(let i = 0; i < nodes.length; i++){ 
                if(nodes[i].state == 1){ 
                    let newNodes = nodes.slice();
                    newNodes[i].state = 5; 
                    newNodes[i].displayID = 0;
                    setRenamingNode(i);
                    setNodes(newNodes);
                    found = true;
                    break;
                }
            }
            if(!found) for(let i = 0; i < edges.length; i++){
                if(edges[i].state == 1){
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
        if(e.key === "Tab"){
            e.preventDefault();
            if(renamingNode != -1){ // node
                if(nodes[renamingNode].displayID in Node.id_map){ return; }

                let newNodes = nodes.slice();
                let nextInd = (renamingNode+1)%(newNodes.length);
                newNodes[renamingNode].setID(newNodes[renamingNode].displayID, edges);
                newNodes[renamingNode].state = 0;
                newNodes[nextInd].state = 5;
                newNodes[nextInd].displayID = 0;
                setNodes(newNodes);
                setRenamingNode(nextInd);
            } else if (renamingEdge != -1){ // edge
                let newEdges = edges.slice();
                newEdges[renamingEdge].weight = Math.max(0, newEdges[renamingEdge].weight);
                newEdges[renamingEdge].state = 0;
                newEdges[(renamingEdge+1)%(newEdges.length)].state = 3;
                newEdges[(renamingEdge+1)%(newEdges.length)].displayWeight = 0;
                setEdges(newEdges);
                setRenamingEdge((renamingEdge+1)%(newEdges.length));
            }
        }

        // q -> edit mode -> leave
        if(e.key === "q"){
            if(renamingNode != -1){
                let newNodes = nodes.slice();
                newNodes[renamingNode].displayID = newNodes[renamingNode].id;
                newNodes[renamingNode].state = 0;
                setNodes(newNodes);
                setRenamingNode(-1);
                console.log(nodes, edges);
            } else if (renamingEdge != -1){
                let newEdges = edges.slice();
                newEdges[renamingEdge].displayWeight = newEdges[renamingEdge].weight;
                newEdges[renamingEdge].state = 0;
                setEdges(newEdges);
                setRenamingEdge(-1);
            }
        }

        if(e.key == "g" && !mouseDown[0]){
            handleMouseDown({button: 0, clientX: mousePos.x, clientY: mousePos.y}, false);
        }

        if(e.key == "h" && !mouseDown[1]){
            handleMouseDown({button: 1, clientX: mousePos.x, clientY: mousePos.y}, false);
        }

        if(e.key == "j" && !mouseDown[2]){
            handleMouseDown({button: 2, clientX: mousePos.x, clientY: mousePos.y}, false);
        }
    }

    function handleKeyUp(e){
        if(!editable && e.key !== "h") return;

        if(e.key == "g"){
            handleMouseUp({button: 0, clientX: mousePos.x, clientY: mousePos.y}, false);
        }

        if(e.key == "h"){
            handleMouseUp({button: 1, clientX: mousePos.x, clientY: mousePos.y}, false);
        }

        if(e.key == "j"){
            handleMouseUp({button: 2, clientX: mousePos.x, clientY: mousePos.y}, false);
        }
    }

    function algorithmStepInit(){ return {nodes: nodes.slice(), edges: edges.slice(), nodeQueue: [], edgeQueue: [], graph: graph}; }
    function algorithmStepEnd(r) { setNodes(r.nodes); setEdges(r.edges); setNodeQueue(r.nodeQueue); setEdgeQueue(r.edgeQueue); setGraph(r.graph); }


    function handleAlgorithmStart(alg = algorithm){
        setEditable(false);

        let r = algorithmStepInit();

        for(let i = 0; i < r.nodes.length; i++){
            r.nodes[i].state = 0;
            r.nodes[i].dist = null;
        }

        for(let i = 0; i < r.edges.length; i++){
            r.edges[i].state = 0;
        }

        r.graph.construct(r.nodes, r.edges, alg);
        r.graph.render(r.nodes, r.edges, r.nodeQueue, r.edgeQueue);

        algorithmStepEnd(r);
    }

    function onNext(){ let r = algorithmStepInit(); r.graph.next(); r.graph.render(r.nodes, r.edges, r.nodeQueue, r.edgeQueue); algorithmStepEnd(r); }

    function onBack(){ let r = algorithmStepInit(); r.graph.back(); r.graph.render(r.nodes, r.edges, r.nodeQueue, r.edgeQueue); algorithmStepEnd(r); }

    function onReset(){ let r = algorithmStepInit(); r.graph.currentState = 0; r.graph.render(r.nodes, r.edges, r.nodeQueue, r.edgeQueue); algorithmStepEnd(r); }

    function handleEditClick(){
        if(editable) return;

        setEditable(true);

        let r = algorithmStepInit();

        for(let i = 0; i < r.nodes.length; i++){
            r.nodes[i].state = 0;
            r.nodes[i].dist = null;
        }

        for(let i = 0; i < r.edges.length; i++){
            r.edges[i].state = 0;
            r.edges[i].weighted = true;
        }

        r.graph.clear();

        algorithmStepEnd(r);
    }

    function handleAlgorithmChange(alg){

        let newEdges = edges.slice();

        if(alg === "bfs" || alg === "dfs"){
            for(let i = 0; i < newEdges.length; i++){
                newEdges[i].weighted = false;
            }
        } else {
            for(let i = 0; i < newEdges.length; i++){
                newEdges[i].weighted = true;
            }
        }

        setEdges(newEdges);
        setAlgorithm(alg);
        handleAlgorithmStart(alg);
    }

    return (
        <div className="search" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0" onContextMenu={(e) => {e.preventDefault()}}>
            <Header title="DSA Visualization | Graph Theory"/>
            <div className="searchMenu">
                <button className={`searchMenuItem ${editable?"searchMenuItemActive":""}`} onClick={handleEditClick}>Edit</button>
                <button className={`searchMenuItem ${!editable?"searchMenuItemInActive":""}`} onClick={clearView}>Clear</button>
                <button className={`searchMenuItem ${!editable?"searchMenuItemInActive":""}`} onClick={populate}>Populate</button>

                <div style={{width:"50px"}}></div>

                <button className={`searchMenuItem${editable?" searchMenuItemInActive":""}`} onClick={onBack}>Back</button>
                <button className={`searchMenuItem${editable?" searchMenuItemInActive":""}`} onClick={onNext}>Next</button>
                <button className={`searchMenuItem${editable?" searchMenuItemInActive":""}`} onClick={onReset}>Reset</button>

                <div style={{width:"50px"}}></div>

                <button className={`searchMenuItem ${(!editable && algorithm==="bfs") ? "searchMenuItemActive" : ""}`} onClick={() => {handleAlgorithmChange("bfs")}}>BFS</button>
                <button className={`searchMenuItem ${(!editable && algorithm==="dijkstra") ? "searchMenuItemActive" : ""}`} onClick={() => {handleAlgorithmChange("dijkstra")}}>Dijkstra's</button>
                <button className={`searchMenuItem ${(!editable && algorithm==="kruskall") ? "searchMenuItemActive" : ""}`} onClick={() => {handleAlgorithmChange("kruskall")}}>Kruskall's</button>
                <button className={`searchMenuItem ${(!editable && algorithm==="prim") ? "searchMenuItemActive" : ""}`} onClick={() => {handleAlgorithmChange("prim")}}>Prim's</button>
            </div>
            <div className="searchGraph">
                <QueueMirror/>
                <MoveableView nodes={nodes} edges={edges} viewPos={viewPos} gridLines={gridLines} editable={editable} />
                <QueueView nodeQueue={nodeQueue} edgeQueue={edgeQueue} nodes={nodes} edges={edges} />
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

export default Search;