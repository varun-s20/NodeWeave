import React, { useState } from "react";
import "./Node.css";
import { MoreHorizontal, GripHorizontal, Trash2 } from "lucide-react";

const Node = ({
  node,
  onMouseDown,
  onPortMouseDown,
  selected,
  color,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`workflow-node ${selected ? "selected" : ""}`}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
        "--node-color": color,
      }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <div className="node-header" style={{ backgroundColor: color }}>
        <div className="node-header-icon">
          <div className="icon-circle" />
        </div>
        <span className="node-title">{node.data.type}</span>
        <div className="node-actions">
          <button
            className="node-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreHorizontal size={16} color="white" />
          </button>

          {showMenu && (
            <div className="node-menu-dropdown">
              <button
                className="node-menu-item delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
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
      >
        <div className="port-dot" />
      </div>
      <div
        className="node-port port-output"
        onMouseDown={(e) => {
          e.stopPropagation();
          onPortMouseDown(e, node.id, "output");
        }}
        style={{ borderColor: color }}
      >
        <div className="port-dot" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
};

export default Node;
