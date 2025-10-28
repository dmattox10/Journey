// src/components/builder/nodeTypes.js
import { SceneNode } from "./nodes/SceneNode";
import { ChoiceNode } from "./nodes/ChoiceNode";
import {CollectorNode } from "./nodes/CollectorNode";
import { ActionNode } from "./nodes/ActionNode";
import { CssChildNode } from "./nodes/CssChildNode";

export const nodeTypes = {
  scene: SceneNode,
  choice: ChoiceNode,
  collector: CollectorNode,
  action: ActionNode,
  cssChild: CssChildNode,

};