import { Sequence } from "../player/Sequence"

export function PreviewPane() {
  const sampleBlocks = [
  { type: "scene", text: "Once upon a time, Red set off through the woods.", media: {portrait:{src:"/woods_portrait.jpg", length:5}, landscape:{src:"/woods_landscape.jpg", length:5}} },
  { type: "choice", options: [
      { text: "Take the long path", next: 2 },
      { text: "Cut through the forest", next: 3 },
    ]
  },
  { type: "scene", text: "She took the long way, avoiding danger.", media: {portrait:{src:"/longpath_p.jpg", length:5}, landscape:{src:"/longpath_l.jpg", length:5}} },
  { type: "scene", text: "The wolf was waiting for her in the dark forest.", media: {portrait:{src:"/forest_p.jpg", length:5}, landscape:{src:"/forest_l.jpg", length:5}} },
]

  return (
    <div className="panel" style={{ flex: 1, overflowY: "auto" }}>
      <Sequence blocks={sampleBlocks} />
    </div>
  )
}