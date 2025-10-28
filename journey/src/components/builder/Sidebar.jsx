// src/components/builder/Sidebar.jsx
import React from "react";
import { useJourneyStore } from "../../store/useJourneyStore";
import { ThemeToggle } from "../ui/Themetoggle";

export function Sidebar() {
  const addBlock = useJourneyStore((s) => s.addBlock);

  const templates = [
    { type: "scene", label: "Scene" },
    { type: "choice", label: "Choice" },
    { type: "collector", label: "Collector" },
    { type: "action", label: "Action" },
  ];

  const onDragStart = (event, type) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="sidebar panel">
        <ThemeToggle />
      <h3>Blocks</h3>

      <div style={{ display: "grid", gap: 8 }}>
        {templates.map((t) => (
          <div key={t.type}>
            <button
              draggable
              onDragStart={(e) => onDragStart(e, t.type)}
              onClick={() => addBlock(t.type)}
              aria-label={`Add ${t.label}`}
            >
              + {t.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}