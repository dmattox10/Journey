// src/components/ui/ThemeToggle.jsx
import React from "react"
import { toggleTheme } from "../../theme"

export function ThemeToggle() {
  const handle = () => toggleTheme()
  return (
    <button onClick={handle} aria-label="Toggle theme" style={{ padding: 6 }}>
      🌗
    </button>
  )
}