// src/components/player/Collector.jsx
import React, { useState } from "react";

export function Collector({ node, layout = "landscape", onSubmit }) {
  const media = node.media && node.media[layout];
  const src = media && media.src;
  const fields = (node.collector && node.collector.fields) || [{ key: "msg", label: "Message" }];

  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach((f) => (initial[f.key] = ""));
    return initial;
  });

  const change = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="small-muted">No media</div>}

      <div style={{ position: "absolute", zIndex: 20, left: "50%", transform: "translateX(-50%)", bottom: "10%", background: "rgba(0,0,0,0.45)", padding: 16, borderRadius: 8 }}>
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>{f.label}</label>
            <input value={values[f.key]} onChange={(e) => change(f.key, e.target.value)} style={{ minWidth: 240 }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => onSubmit(values)}>Send</button>
        </div>
      </div>
    </div>
  );
}