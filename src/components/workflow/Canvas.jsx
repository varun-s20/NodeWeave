import React, { useRef, useState } from "react";
import Node from "./Node";
import "./Canvas.css";
import Connections from "./Connections";

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
  const [connections, setConnections] = useState([
    { id: 1, source: 1, target: 2 },
  ]);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const [connecting, setConnecting] = useState(null);

  const [draggableNodeId, setDraggableNodeId] = useState(null);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const getMouseCords = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData("nodeType");
    if (!nodeType) return;

    const coords = getMouseCords(e);
    const newNode = {
      id: Date.now().toString(),
      type: nodeType,
      position: { x: coords.x - pan.x, y: coords.y - pan.y },
      data: { description: "New node" },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggableNodeId(id);
    setLastMousePosition(getMouseCords(e));
  };

  const handleMouseMove = (e) => {
    const coords = getMouseCords(e);
    const dx = coords.x - lastMousePosition.x;
    const dy = coords.y - lastMousePosition.y;

    if (isPanning) {
      setPan((prev) => {
        return {
          x: prev.x + dx,
          y: prev.y + dy,
        };
      });
    }  else if (draggableNodeId) {
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
    } else if (connecting) {
      setConnecting((prev) => {
        return {
          ...prev,
          currX: coords.x,
          currY: coords.y,
        };
      });
    }

    setLastMousePosition(coords);
  };

  const handleMouseUp = () => {
    if (connecting) {
      const el = document.elementFromPoint(connecting.currX, connecting.currY);
      if (el && el.classList.contains("port-input")) {
      }
      setConnecting(null);
    }

    setIsPanning(false);
    setDraggableNodeId(null);
  };

  const handleCanvasMouseDown = (e) => {
    setIsPanning(true);
    setLastMousePosition(getMouseCords(e));
  };

  const handlePortMouseDown = (e, nodeId, type) => {
    e.stopPropagation();

    if (type !== "output") return;

    const coords = getMouseCords(e);
    setConnecting({
      source: nodeId,
      startX: coords.x,
      startY: coords.y,
      currX: coords.x,
      currY: coords.y,
    });
  };

  const handleInputPortMouseUp = (e, nodeId) => {
    if (connecting) {
      const newConnection = {
        id: `c-${Date.now()}`,
        source: connecting.source,
        target: nodeId,
      };
      setConnections([...connections, newConnection]);
      setConnecting(null);
    }
  };

  const getPortPosition = (nodeId, type) => {
    const node = nodes.find((node) => node.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const yOffset = 45;

    if (type === "output") {
      return {
        x: node.position.x + 240,
        y: node.position.y + yOffset,
      };
    } else {
      return {
        x: node.position.x,
        y: node.position.y + yOffset,
      };
    }
  };

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      <div
        className="canvas-content"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <svg className="connections-layer">
          {connections.map((connection) => {
            const start = getPortPosition(connection.source, "output");
            const end = getPortPosition(connection.target, "input");

            return <Connections key={connection.id} start={start} end={end} />;
          })}
          {connecting && (
            <Connections
              start={{
                x: getPortPosition(connecting.source, "output").x,
                y: getPortPosition(connecting.source, "output").y,
              }}
              end={{
                x: connecting.currX - pan.x,
                y: connecting.currY - pan.y,
              }}
              animated 
            />
          )}
        </svg>

        {nodes.map((node) => {
          return (
            <div
              key={node.id}
              onMouseUp={(e) => {
                if (e.target.classList.contains("port-input")) {
                  handleInputPortMouseUp(e, node.id);
                }
              }}
            >
              <Node
                node={node}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onPortMouseDown={handlePortMouseDown}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Canvas;
