import React, { useRef, useState } from "react";
import Node from "./Node";
import "./Canvas.css";

const Canvas = () => {
  const containerRef = useRef(null);

  const [nodes, setNodes] = useState([
    {
      id: 1,
      type: "Webhook",
      position: { x: 100, y: 100 },
      data: { description: "Receive data from external source." },
    },
    {
      id: 2,
      type: "AI Generate",
      position: { x: 200, y: 200 },
      data: { description: "Generate text using GPT-4 model." },
    },
  ]);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const [draggableNodeId, setDraggableNodeId] = useState(null);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const getMouseCords = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggableNodeId(id);
    setLastMousePosition(getMouseCords(e));
  };

  const handleMouseMove = (e) => {
    if (!draggableNodeId) return;

    const coords = getMouseCords(e);
    const dx = coords.x - lastMousePosition.x;
    const dy = coords.y - lastMousePosition.y;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === draggableNodeId
          ? {
              ...node,
              position: { x: node.position.x + dx, y: node.position.y + dy },
            }
          : node
      )
    );

    if (isPanning) {
      setPan((prev) => {
        return {
          x: prev.x + dx,
          y: prev.y + dy,
        };
      });
    }

    setLastMousePosition(coords);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggableNodeId(null);
  };

  const handleCanvasMouseDown = (e) => {
    setIsPanning(true);
    setLastMousePosition(getMouseCords(e));
  };

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className="canvas-content"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {nodes.map((node) => {
          return (
            <Node
              key={node.id}
              node={node}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Canvas;
