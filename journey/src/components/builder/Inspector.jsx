// src/components/builder/Inspector.jsx
import { useJourneyStore } from "../../store/useJourneyStore";

export function Inspector() {
  const { nodes, selectedId, updateNodeData, removeNode } = useJourneyStore();
  const node = nodes.find((n) => n.id === selectedId);

  if (!node)
    return <div className="panel small-muted">Select a block to edit.</div>;

  const handleChange = (e) => {
    updateNodeData(node.id, { [e.target.name]: e.target.value });
  };

  function parseInlineCss(cssText) {
  const style = {};
  cssText.split(";").forEach((rule) => {
    const [key, value] = rule.split(":").map((s) => s && s.trim());
    if (key && value) {
      const jsKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      style[jsKey] = value;
    }
  });
  return style;
}

  const handleMediaUpload = (e, orientation) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video");

    if (isVideo) {
      const video = document.createElement("video");
      video.src = url;
      video.onloadedmetadata = () => {
        updateNodeData(node.id, {
          media: {
            ...node.data.media,
            [orientation]: { src: url, length: video.duration },
          },
        });
      };
    } else {
      updateNodeData(node.id, {
        media: {
          ...node.data.media,
          [orientation]: { src: url, length: 5 },
        },
      });
    }
  };

  const renderMediaPreview = (orientation) => {
    const mediaObj = node.data.media?.[orientation];
    if (!mediaObj?.src) return <p className="small-muted">No {orientation} media</p>;

    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaObj.src);

    return (
      <div style={{ marginTop: "0.5em" }}>
        {isVideo ? (
          <video
            src={mediaObj.src}
            style={{ width: "100%", borderRadius: 6 }}
            controls
          />
        ) : (
          <img
            src={mediaObj.src}
            alt={`${orientation} preview`}
            style={{ width: "100%", borderRadius: 6 }}
          />
        )}
        <p className="small-muted">
          Duration: {mediaObj.length ? mediaObj.length.toFixed(1) : 0}s
        </p>
      </div>
    );
  };

  return (
    <div className="panel">
      <h3>{node.data.label}</h3>

      {/* TEXT FIELD */}
      <label>Text</label>
      <textarea
        name="text"
        value={node.data.text || ""}
        onChange={handleChange}
        rows="4"
        style={{ width: "100%", resize: "vertical" }}
      />

      {/* SCENE-SPECIFIC FIELDS */}
      {node.type === "scene" && (
        <>
          <label style={{ marginTop: "1em" }}>Media</label>

          <label>Portrait (vertical) media</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleMediaUpload(e, "portrait")}
          />
          {renderMediaPreview("portrait")}

          <label>Landscape (horizontal) media</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleMediaUpload(e, "landscape")}
          />
          {renderMediaPreview("landscape")}
        </>
      )}
       {node.type === "cssChild" && (
  <>
    <label>Custom CSS for {node.data.layout} layout</label>
    <textarea
      name={node.data.layout === "vertical" ? "cssPortrait" : "cssLandscape"}
      value={node.data.layout === "vertical" ? node.data.cssPortrait : node.data.cssLandscape}
      onChange={(e) =>
        updateNodeData(node.id, {
          [node.data.layout === "vertical" ? "cssPortrait" : "cssLandscape"]: e.target.value,
        })
      }
      rows="6"
      style={{ width: "100%", resize: "vertical", fontFamily: "monospace" }}
    />
    <p className="small-muted mt-1">Live preview:</p>
    <div
      style={{
        minHeight: "100px",
        border: "1px dashed gray",
        ...parseInlineCss(node.data.layout === "vertical" ? node.data.cssPortrait || "" : node.data.cssLandscape || ""),
      }}
    >
      Example block
    </div>
  </>
)}
      <div style={{ marginTop: "8px" }}>
        <button onClick={() => removeNode(node.id)}>🗑 Remove</button>
      </div>
    </div>
  );
}