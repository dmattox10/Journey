import { Sidebar } from "./Sidebar"
import { CanvasWrapper }  from "./Canvas"
import { Inspector } from "./Inspector"
import { PreviewPane } from "./PreviewPane"
import "../../css/app.css"

export function JourneyBuilder() {
  return (
    <div className="app-row doodle">
        
         <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <CanvasWrapper />
    </div>
      <div className="rightcol border">
        
        <Inspector />
        
        <PreviewPane />
      </div>
    </div>
  )
}