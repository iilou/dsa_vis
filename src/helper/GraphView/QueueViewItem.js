
// import {Node, Edge} from "../../helper/Prims.js"

import "./Queue.css"


const state_colors = [
    "#4f4f4f", "#4f8f4f", "#6f4f6f", "#afaf2f", "#9f9f2f", "#af2f2f",
    "#555555", "#55bb55", "#bb5555", "#bbbb55", "#5555bb", "#aa9944",
];

export default function QueueView({ index, node, edge}){
    return (
        <div className="queueViewItem">
            <div className="queueViewItemInd">{index}</div>
            <div className="queueViewItemNode" style={{ backgroundColor: state_colors[node.state] }}>
                {node.id}
            </div>
            <div className="queueViewItemEdge">{edge==null?-1:(edge.weighted?edge.weight:"")}</div>
            <div className="queueViewItemNode" style={{ backgroundColor: state_colors[edge==null?node.state:edge.other(node).state]}}>{edge==null?node.id:edge.other(node).id}</div>
        </div>
    );
}