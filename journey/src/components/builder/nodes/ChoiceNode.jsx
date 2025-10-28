// src/components/builder/nodes/ChoiceNode.jsx
import React from "react";

export function ChoiceNode({ data }) {
  return (
    <div className="node-card" style={{ minWidth: 160 }}>
      <strong>{data.label || "Choice"}</strong>
      <div className="small-muted" style={{ marginTop: 6 }}>
        {Array.isArray(data.options) ? `${data.options.length} options` : "No options"}
      </div>
    </div>
  );
}