import React from 'react';
import './SurroundingBorder.css';

export default function SurroundingBorder({ x, y, width, height, zindex}){
    let bw = 10000;
    let bh = 10000;
    return (
        //north, south, east, west
        <>
            <div className="surrounding-border" style={{left: x - bw, top: y - bh, width: 2 * bw, height: bh, zIndex: zindex}}></div>
            <div className="surrounding-border" style={{left: x - bw, top: y + height, width: 2 * bw, height: bh, zIndex: zindex}}></div>
            <div className="surrounding-border" style={{left: x - bw, top: y, width: bw, height: height, zIndex: zindex}}></div>
            <div className="surrounding-border" style={{left: x + width, top: y, width: bw, height: height, zIndex: zindex}}></div>
        </>
    )
}