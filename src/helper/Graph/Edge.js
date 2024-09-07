import {Node, Edge} from "./Prims.js"
import "./Edge.css"

const state_colors_eg = [
    "#111111", "#3f6f3f", "#6f3f6f", "#af2f2f",

    "#88888877", 
    "#55aa55", 
    "#5555aa", 
    "#bb44d4", 
    "#bbbb55", 
    "#aa5555",
];

const state_borders_eg = [
    "none", "none", "none", "none",

    "none", 
    "0 0 0px 3px #338833", 
    "0 0 0 3px #333388", 
    "0 0 0 3px #bb44d4", 
    "0 0 0 3px #888833", 
    "0 0 2px 3px #993333"
]

const state_borders_eg_thin = [
    "none", "none", "none", "none",
    "none", 
    "0 0 2px 0px #338833", 
    "0 0 2px 0 #333388", 
    "0 0 2px 0 #bb44d4", 
    "0 0 2px 0 #888833", 
    "0 0 5px 1px #993333"
]

export default function EdgeDIV({ edge, viewPos }) {
    return (
        <div className="edge" style={{ 
            left: edge.midPoint.x - (edge.dist / 2) - viewPos.x,
            top: edge.midPoint.y - viewPos.y,
            width: edge.dist,
            height: edge.node1.r > 20 ? 5 : 3,
            transform: `rotate(${Math.atan2(edge.node2.y - edge.node1.y, edge.node2.x - edge.node1.x)}rad)`,
            backgroundColor: state_colors_eg[edge.state],
            // boxShadow: state_borders_eg[edge.state]
            boxShadow: edge.node1.r > 20 ? state_borders_eg[edge.state] : state_borders_eg_thin[edge.state],
            // color: (edge.state == 4 || edge.state == 6 || edge.state == 7 || edge.state == 8) ? "#777777" : "#333333",
            // color: (edge.state == 4) ? "#777777" : "#333333",
            // fontSize: (edge.node1.r >= 20 ? 16:12) * ((edge.state == 4 || edge.state == 6 || edge.state == 7 || edge.state == 8) ? 0.7 : 1) + "px",
            // fontSize: (edge.node1.r > 20 ? 16:12) * (edge.state == 4 ? 0.7 : 1) + "px",

            color: edge.state >= 4 ? state_colors_eg[edge.state] : "#333333",
            fontSize: (edge.node1.r > 20 ? 16:12) * ((edge.state == 4 ? 0.7 : 1)) + "px",
            fontWeight: edge.state > 4 ? "900" : "700",
        }}>
            {edge.weighted ? edge.displayWeight : ""}
        </div>
    )
}