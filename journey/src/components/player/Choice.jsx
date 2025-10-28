// src/components/player/Choice.jsx
import React from "react";

function isVideoSrc(src) {
  return /\.(mp4|webm|ogv|ogg|mov)$/i.test(src);
}

export function Choice({ node, layout = "landscape", onChoose }) {
  const media = node.media && node.media[layout];
  const src = media && media.src;

  const options = node.options || [];
  const defaultOptions = options.filter((o) => o.isDefault);

  // If more than one default, we warn and ignore auto behavior (Sequence handles it)
  if (defaultOptions.length > 1) {
    console.warn(`Choice ${node.id} has multiple default options — ignoring auto-default.`);
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {src ? (
        isVideoSrc(src) ? (
          <video src={src} autoPlay muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )
      ) : (
        <div className="small-muted" style={{ padding: 20 }}>
          No media selected for this choice.
        </div>
      )}

      <div style={{
        position: "absolute",
        zIndex: 20,
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "10%",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onChoose(opt.nextId)} style={{ minWidth: 200 }}>
            {opt.text} {opt.isDefault ? " (default)" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}