import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import Node from "./Node";
import "./Canvas.css";
import Connections from "./Connections";
import { CATEGORY_COLORS, NODE_CATEGORIES } from "./constants";

const Canvas = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem("workflow-nodes");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            type: "Webhook",
            position: { x: 100, y: 100 },
            data: { description: "Receive data from external source." },
          },
          {
            id: 2,
            type: "AI Generate",
            position: { x: 500, y: 200 },
            data: { description: "Generate text using GPT-4 model." },
          },
        ];
  });

  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem("workflow-connections");
    return saved ? JSON.parse(saved) : [{ id: 1, source: 1, target: 2 }];
  });

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [connecting, setConnecting] = useState(null);

  const [draggableNodeId, setDraggableNodeId] = useState(null);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem("workflow-nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("workflow-connections", JSON.stringify(connections));
  }, [connections]);

  useImperativeHandle(ref, () => ({
    addNode: (type) => {
      const x =
        -pan.x +
        (containerRef.current ? containerRef.current.clientWidth / 2 : 400) -
        100;
      const y =
        -pan.y +
        (containerRef.current ? containerRef.current.clientHeight / 2 : 300) -
        50;

      const newNode = {
        id: Date.now().toString(),
        type: type,
        position: { x: x > 0 ? x : 100, y: y > 0 ? y : 100 },
        data: { description: "New node" },
      };
      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
    },
  }));

  const deleteNode = (nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.source !== nodeId && c.target !== nodeId)
    );
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

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
    setSelectedNodeId(newNode.id);
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggableNodeId(id);
    setSelectedNodeId(id);
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
    } else if (draggableNodeId) {
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
    setConnecting(null);
    setIsPanning(false);
    setDraggableNodeId(null);
  };

  const handleCanvasMouseDown = (e) => {
    setIsPanning(true);
    setSelectedNodeId(null);
    setLastMousePosition(getMouseCords(e));
  };

  const handlePortMouseDown = (e, nodeId, type) => {
    e.stopPropagation();
    const coords = getMouseCords(e);
    setConnecting({
      source: nodeId,
      type: type,
      startX: coords.x,
      startY: coords.y,
      currX: coords.x,
      currY: coords.y,
    });
  };

  const handlePortMouseUp = (e, nodeId, type) => {
    if (connecting) {
      if (connecting.source === nodeId) return;
      if (connecting.type === type) return;

      let newConnection;
      if (connecting.type === "output" && type === "input") {
        newConnection = {
          id: `c-${Date.now()}`,
          source: connecting.source,
          target: nodeId,
        };
      } else if (connecting.type === "input" && type === "output") {
        newConnection = {
          id: `c-${Date.now()}`,
          source: nodeId,
          target: connecting.source,
        };
      }

      if (newConnection) {
        setConnections([...connections, newConnection]);
      }
      setConnecting(null);
    }
  };

  const getPortPosition = (nodeId, type) => {
    const node = nodes.find((node) => node.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const yOffset = 50;

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
                x: connecting.startX,
                y: connecting.startY,
              }}
              end={{
                x: connecting.currX,
                y: connecting.currY,
              }}
              animated
            />
          )}
        </svg>

        {connecting && (
          <svg
            className="connections-layer"
            style={{ pointerEvents: "none", zIndex: 100 }}
          >
            <Connections
              start={{
                x: connecting.startX - pan.x,
                y: connecting.startY - pan.y,
              }}
              end={{
                x: connecting.currX - pan.x,
                y: connecting.currY - pan.y,
              }}
              animated
            />
          </svg>
        )}

        {nodes.map((node) => {
          const category = NODE_CATEGORIES[node.type] || "Default";
          const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Default;
          return (
            <div
              key={node.id}
              onMouseUp={(e) => {
                const port = e.target.closest(".node-port");
                if (port) {
                  const isInput = port.classList.contains("port-input");
                  const isOutput = port.classList.contains("port-output");
                  if (isInput) handlePortMouseUp(e, node.id, "input");
                  if (isOutput) handlePortMouseUp(e, node.id, "output");
                }
              }}
            >
              <Node
                node={node}
                selected={selectedNodeId === node.id}
                color={color}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onPortMouseDown={handlePortMouseDown}
                onDelete={() => deleteNode(node.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Canvas;
