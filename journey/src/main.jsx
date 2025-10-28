import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import 'doodle.css/doodle.css'   // official stylesheet from the package
import './css/doodle-dark.css'      // our dark-mode overrides (create this file)
import { App } from './App.jsx'
import { initTheme } from "./theme"

initTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
