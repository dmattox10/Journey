import { Handle, Position } from "reactflow";

export function CssChildNode({ data }) {
  return (
    <div className="node doodle-card" style={{ padding: "0.5em" }}>
      <Handle type="target" position={Position.Top} id="top" />
      <h4>{data.label}</h4>
      <div className="text-xs text-gray-500">Custom CSS ({data.layout})</div>
    </div>
  );
}