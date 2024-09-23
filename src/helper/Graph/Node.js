import "./Node.css";

const state_colors = [
  "#4f4f4f",
  "#4f8f4f",
  "#6f4f6f",
  "#afaf2f",
  "#9f9f2f",
  "#af2f2f",
  "#555555",
  "#55bb55",
  "#dd5555",
  "#bbbb55",
  "#5555bb",
  "#9944bb",
];

const state_borders = [
  "none",
  "none",
  "none",
  "none",
  "none",
  "none",
  "0 0 2px 4px inset #444444",
  "0 0 2px 4px inset #338833",
  "0 0 4px 7px inset #bb3333",
  "0 0 2px 4px inset #888833",
  "0 0 2px 4px inset #333388",
  "0 0 2px 4px inset #774499",
];

const fonts = {
  small: {
    r_max: 20,
    fontSize: "12px",
  },
  medium: {
    r_max: 25,
    fontSize: "16px",
  },
  large: {
    r_max: 30,
    fontSize: "20px",
  },
};

export default function NodeDIV({ node, viewPos }) {
  function getFontSize(r) {
    if (r <= fonts.small.r_max) return fonts.small.fontSize;
    if (r <= fonts.medium.r_max) return fonts.medium.fontSize;
    return fonts.large.fontSize;
  }
  return (
    <>
      <div
        className="node"
        style={{
          left: node.x - node.r - viewPos.x,
          top: node.y - node.r - viewPos.y,
          width: 2 * node.r,
          height: 2 * node.r,
          backgroundColor: state_colors[node.state],
          // border: node.isStart ? ()+"px solid #f2d223" : "none"
          // border: node.isStart ? "5px solid #f2d223" : state_borders[node.state]
          boxShadow: node.isStart
            ? "0 0 2px 5px inset #f2d223"
            : state_borders[node.state],
          lineHeight: 2 * node.r + "px",
          fontSize: getFontSize(node.r),
        }}
      >
        {node.displayID}
      </div>
      <div
        className="nodeDist"
        style={{
          top: node.y - node.r - viewPos.y - 17,
          left: node.x - viewPos.x - 26,
          width: 52,
          backgroundColor:
            node.state == 8
              ? "#cc3333"
              : node.dist == -1 || node.dist == 999999
              ? "#aa6666"
              : "#3388a9",
        }}
      >
        {node.dist == null ? "" : node.dist}
      </div>
    </>
  );
}
