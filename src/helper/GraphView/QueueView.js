import QueueViewItem from "./QueueViewItem.js";

import "./Queue.css"

function QueueView({ nodeQueue, edgeQueue, nodes, edges }){
    return (
        <div className="queueView">
            <div className="queueTitle"> Queue </div>
            {nodeQueue.map((node, index) => {
                return <QueueViewItem index={index+1} node={nodes[node]} edge={edges[edgeQueue[index]]} />
            })}
            
        </div>
    );
}

function QueueMirror(){
    return (<div className="queueMirror"></div>)
}

export {QueueView, QueueMirror};