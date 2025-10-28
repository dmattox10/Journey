// src/components/builder/nodes/CollectorNode.jsx
import React from "react";

export function CollectorNode({ data }) {
  return (
    <div className="node-card">
      <strong>{data.label || "Collector"}</strong>
      <div className="small-muted" style={{ marginTop: 6 }}>
        {data.field || "field"}
      </div>
    </div>
  );
}