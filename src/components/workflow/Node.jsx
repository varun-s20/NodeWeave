import React from "react";
import "./Node.css";

const Node = ({ node, onMouseDown }) => {
  return (
    <div
      className="workflow-node"
      style={{ transform: `translate(${node.position.x}px, ${node.position.y}px)` }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      {node.data.description}
    </div>
  );
};

export default Node;
