import React from "react";
import "./Sidebar.css";
import { GripVertical, Plus } from "lucide-react";
import { CATEGORY_COLORS } from "./constants";

const Sidebar = ({ onAddNode }) => {
  const categories = [
    { name: "Triggers", items: ["Webhooks", "Schedule"] },
    {
      name: "Actions",
      items: ["Send Email", "Database Query", "Chat Completion"],
    },
    { name: "Conditions", items: ["If-Else", "Switch"] },
    { name: "Loops", items: ["For Loop", "While Loop"] },
    { name: "Variables", items: ["Set Variable", "Get Variable"] },
  ];

  return (
    <aside className="builder-sidebar">
      <div className="sidebar-action-section">
        <button className="add-node-btn" onClick={onAddNode}>
          <Plus size={20} />
          <span>Add Node</span>
        </button>
      </div>

      <div className="sidebar-categories">
        {categories.map((category, index) => (
          <div key={index} className="category-group">
            <h3
              className="category-title"
              style={{
                color:
                  CATEGORY_COLORS[category.name] || CATEGORY_COLORS.Default,
              }}
            >
              {category.name}
            </h3>
            <div className="category-items">
              {category.items.map((item, idx) => (
                <div
                  key={idx}
                  className="node-item-preview"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("nodeType", item);
                  }}
                  style={{
                    borderLeft: `3px solid ${
                      CATEGORY_COLORS[category.name] || CATEGORY_COLORS.Default
                    }`,
                  }}
                >
                  <GripVertical size={16} className="drag-handle" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
