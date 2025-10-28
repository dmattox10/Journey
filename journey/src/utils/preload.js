// src/utils/preload.js
export function preloadMediaForBlock(block, layout) {
  if (!block || !block.media) return;
  const m = block.media[layout];
  if (!m || !m.src) return;

  const src = m.src;
  if (isVideoSrc(src)) {
    const v = document.createElement("video");
    v.preload = "auto";
    v.src = src;
    // optional: attach handlers
    v.onloadedmetadata = () => { /* cached */ };
  } else {
    const i = new Image();
    i.src = src;
  }
}

function isVideoSrc(src) {
  return /\.(mp4|webm|ogv|ogg|mov|mkv)$/i.test(src);
}