// src/components/builder/nodes/ActionNode.jsx
import React from "react";

export function ActionNode({ data }) {
  return (
    <div className="node-card">
      <strong>{data.label || "Action"}</strong>
      <div className="small-muted" style={{ marginTop: 6 }}>
        {data.text ? data.text.slice(0, 60) : "No details"}
      </div>
    </div>
  );
}