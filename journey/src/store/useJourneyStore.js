import { create } from "zustand"
import { nanoid } from "nanoid"
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow"

export const useJourneyStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedId: null,

  addBlock: (typeKey, position = { x: 250, y: 100 }) => {
  const id = nanoid();
  const node = {
    id,
    type: typeKey,
    position,
    data: {
      label: `${typeKey.toUpperCase()} ${id.slice(0, 4)}`,
      text: "",
      media: {
        portrait: { src: "", length: null },
        landscape: { src: "", length: null }
      },
      childrenContainers: [
        { name: "left", cssPortrait: "", cssLandscape: "" },
        { name: "right", cssPortrait: "", cssLandscape: "" }
      ],
      options: [], // for choice
      collector: null, // for collector
      nextId: null, // default linear next
    },
  };
  set(state => ({ nodes: [...state.nodes, node] }));
},
addCssChild: (parentId, layout) => {
  set(state => {
    const parent = state.nodes.find(n => n.id === parentId);
    if (!parent) return state;

    // prevent duplicate child of same layout
    const existing = state.nodes.find(
      n => n.type === "cssChild" && n.data.parentId === parentId && n.data.layout === layout
    );
    if (existing) return state;

    // offset position for clarity
    const offsetX = layout === "horizontal" ? 200 : 0;
    const offsetY = layout === "vertical" ? 150 : 0;

    const id = nanoid();
    const newNode = {
      id,
      type: "cssChild",
      position: {
        x: parent.position.x + offsetX,
        y: parent.position.y + offsetY,
      },
      data: {
        label: `CSS ${layout === "vertical" ? "V" : "H"} Child`,
        layout,
        parentId,
        cssPortrait: "",
        cssLandscape: "",
      },
    };

    const newEdge = {
  id: `e-${parentId}-${id}`,
  source: parentId,
  sourceHandle: layout === "vertical" ? "cssV" : "cssH",
  target: id,
  targetHandle: "top", // child always has a top handle
  type: "smoothstep",
};

    return {
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge],
    };
  });
},
  removeNode: (id) =>
    set(state => ({
      nodes: state.nodes.filter(n => n.id !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  reset: () => set({ nodes: [], edges: [], selectedId: null }),

  onNodesChange: (changes) =>
    set(state => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set(state => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (params) =>
    set(state => ({ edges: addEdge(params, state.edges) })),

  selectNode: (id) => set({ selectedId: id }),

  updateNodeData: (id, updates) =>
    set(state => ({
      nodes: state.nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    })),
}))