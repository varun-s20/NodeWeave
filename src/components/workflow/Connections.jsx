import React from "react";

const Connections = ({ start, end, animated }) => {
  const dx = Math.abs(end.x - start.x);
  const curvature = Math.max(dx * 0.6, 120);
  const midY = (start.y + end.y) / 2;

  const path = `
    M ${start.x} ${start.y}
    C
      ${start.x + curvature} ${midY},
      ${end.x - curvature} ${midY},
      ${end.x} ${end.y}
  `;

  return (
    <path
      d={path}
      stroke="var(--primary)"
      strokeWidth={3}
      fill="none"
      strokeDasharray={animated ? "6 6" : "none"}
    >
      {animated && (
        <animate
          attributeName="stroke-dashoffset"
          from="12"
          to="0"
          dur="0.4s"
          repeatCount="indefinite"
        />
      )}
    </path>
  );
};

export default Connections;
