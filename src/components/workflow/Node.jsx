import React from "react";
import "./Node.css";
import { MoreHorizontal } from "lucide-react";

const Node = ({ node, onMouseDown, onPortMouseDown, selected }) => {
  return (
    <div
      className={`workflow-node ${selected ? "selected" : ""}`}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <div className="node-header">
        <div className="node-icon"></div>
        <span className="node-title">{node.data.type}</span>
        <button className="node-menu-btn">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="node-body">
        <p className="node-description">
          {node.data.description || "Configure this step"}
        </p>
      </div>

      <div
        className="node-port port-input"
        onMouseDown={(e) => {
          e.stopPropagation();
          onPortMouseDown(e, node.id, "input");
        }}
      />
      <div
        className="node-port port-output"
        onMouseDown={(e) => {
          e.stopPropagation();
          onPortMouseDown(e, node.id, "output");
        }}
      />
    </div>
  );
};

export default Node;
