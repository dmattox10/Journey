// src/components/player/Scene.jsx
import React, { useEffect, useRef, useState } from "react";

function isVideoSrc(src) {
  return /\.(mp4|webm|ogv|ogg|mov)$/i.test(src);
}

export function Scene({ node, layout = "landscape", onEnded = () => {} }) {
  const media = node.media && node.media[layout];
  const src = media && media.src;
  const [muted] = useState(true); // autoplay policy: muted to allow autoplay
  const videoRef = useRef(null);

  // if a video, attach onended fallback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleEnded = () => onEnded();
    v.addEventListener("ended", handleEnded);
    return () => v.removeEventListener("ended", handleEnded);
  }, [onEnded, src]);

  const containerStyle = node.childrenContainers && node.childrenContainers[0]
    ? (layout === "portrait"
        ? node.childrenContainers[0].cssPortrait
        : node.childrenContainers[0].cssLandscape)
    : "";

  const containerStyle2 = node.childrenContainers && node.childrenContainers[1]
    ? (layout === "portrait"
        ? node.childrenContainers[1].cssPortrait
        : node.childrenContainers[1].cssLandscape)
    : "";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Background media */}
      {src ? (
        isVideoSrc(src) ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted={muted}
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )
      ) : (
        <div className="small-muted" style={{ padding: 20 }}>
          No media selected
        </div>
      )}

      {/* overlay containers (children slots) */}
      <div
        className="child-slot-1"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: "50%",
          bottom: 0,
          pointerEvents: "auto",
          // accept raw css string if present
          ...(containerStyle ? parseInlineCss(containerStyle) : {}),
        }}
      />

      <div
        className="child-slot-2"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: "50%",
          bottom: 0,
          pointerEvents: "auto",
          ...(containerStyle2 ? parseInlineCss(containerStyle2) : {}),
        }}
      />

      {/* text overlay (center) */}
      {node.text && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "8%",
            zIndex: 20,
            background: "rgba(0,0,0,0.45)",
            padding: "12px 18px",
            borderRadius: 10,
            maxWidth: "90%",
            color: "white",
          }}
        >
          {node.text}
        </div>
      )}
    </div>
  );
}

// helper to convert a simple CSS string to style object
function parseInlineCss(cssString) {
  // Very small parser: expects "prop: value; prop2: value2;"
  const out = {};
  if (!cssString) return out;
  const rules = cssString.split(";").map((r) => r.trim()).filter(Boolean);
  rules.forEach((r) => {
    const [k, ...v] = r.split(":");
    if (!k || !v) return;
    const key = k.trim().replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    out[key] = v.join(":").trim();
  });
  return out;
}