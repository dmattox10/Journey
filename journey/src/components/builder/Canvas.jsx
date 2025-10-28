// src/components/builder/Canvas.jsx
import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useJourneyStore } from "../../store/useJourneyStore";
import { nodeTypes } from "./NodeTypes";

export function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addBlock,
    selectNode,
  } = useJourneyStore();

  // get access to instance so we can project coordinates
  const reactFlowInstance = useReactFlow();

  // required so drop works
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Project the screen coords into the flow coordinate system
      const flowPosition = reactFlowInstance.project(position);
      addBlock(type, flowPosition);
    },
    [addBlock, reactFlowInstance]
  );

  return (
    <div
      className="canvas"
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        flex: 1,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg, #222)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

// Wrap Canvas in a provider so useReactFlow() works correctly
export function CanvasWrapper() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}