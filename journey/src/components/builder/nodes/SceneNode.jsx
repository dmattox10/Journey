// src/components/builder/nodes/SceneNode.jsx
import React from "react";
import { Handle, Position } from "reactflow";
import { useJourneyStore } from "../../../store/useJourneyStore";

export function SceneNode({ id, data }) {
  const { addCssChild } = useJourneyStore();

  return (
    <div
      className="doodle-card node"
      style={{
        padding: "0.5em",
        minWidth: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
      }}
    >
      {/* Input connection */}
      <Handle type="target" position={Position.Top} />

      {/* Header row with +V / label / +H */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "0.25em" }}
      >
        <button
          title="Add vertical CSS child"
          className="text-xs bg-white border rounded px-1"
          onClick={() => addCssChild(id, "vertical")}
        >
          +V
        </button>
        <Handle type="source" position={Position.Left} id="cssV" style={{ opacity: 0, width: 10, height: 10 }} />
<Handle type="source" position={Position.Right} id="cssH" style={{ opacity: 0, width: 10, height: 10 }} />

        <strong>{data.label || "Scene"}</strong>

        <button
          title="Add horizontal CSS child"
          className="text-xs bg-white border rounded px-1"
          onClick={() => addCssChild(id, "horizontal")}
        >
          +H
        </button>
      </div>

      {/* Text content preview */}
      <div
        className="small-muted"
        style={{
          marginTop: 6,
          fontSize: "0.8em",
          lineHeight: "1.2em",
        }}
      >
        {data.text
          ? data.text.slice(0, 60) + (data.text.length > 60 ? "…" : "")
          : "No text"}
      </div>

      {/* Output connection */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}