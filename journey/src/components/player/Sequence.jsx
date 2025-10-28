// src/components/player/Sequence.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Scene } from "./Scene";
import { Choice } from "./Choice";
import {Collector} from "./Collector";
import { preloadMediaForBlock } from "../../utils/preload";

/**
 * Sequence
 * props:
 *  - nodes: array of blocks (with id, type, data fields)
 *  - edges: array of { source, target } (optional) OR blocks can contain nextId/option.nextId
 *  - startId: id of starting block (optional; defaults to first node)
 *  - allowAutoSwitchLayout: boolean (default true) - if true, Sequence will detect layout changes
 */
export function Sequence({
  nodes = [],
  edges = [],
  startId = null,
  allowAutoSwitchLayout = true,
}) {
  // build id -> node map
  const nodeMap = useRef({});
  useEffect(() => {
    const map = {};
    nodes.forEach((n) => (map[n.id] = n));
    nodeMap.current = map;
  }, [nodes]);

  // adjacency via edges (if provided)
  const adjacency = useRef({});
  useEffect(() => {
    const map = {};
    if (edges && edges.length) {
      edges.forEach((e) => {
        if (!map[e.source]) map[e.source] = [];
        map[e.source].push(e.target);
      });
    }
    adjacency.current = map;
  }, [edges]);

  // history stack
  const [history, setHistory] = useState([]);
  // current node id
  const currentId = history.length ? history[history.length - 1] : null;

  // layout detection: 'portrait' or 'landscape'
  const getLayout = useCallback(() => {
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  }, []);
  const [layout, setLayout] = useState(getLayout);

  useEffect(() => {
    if (!allowAutoSwitchLayout) return;
    const onResize = () => {
      const newLayout = getLayout();
      setLayout((prev) => {
        if (prev !== newLayout) return newLayout;
        return prev;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [allowAutoSwitchLayout, getLayout]);

  // timer ref for auto-advance
  const timerRef = useRef(null);

  // helpers to find next nodes
  const getNextIdsFromNode = (node) => {
    if (!node) return [];
    // if choice node has options with nextId, use those
    if (node.type === "choice" && Array.isArray(node.options)) {
      return node.options.map((o) => o.nextId).filter(Boolean);
    }
    // a node may have node.nextId set
    if (node.nextId) return [node.nextId];
    // or use adjacency
    const adj = adjacency.current[node.id];
    if (Array.isArray(adj)) return adj;
    return [];
  };

  // push new id onto history
  const goTo = (id) => {
    if (!id) return;
    setHistory((h) => [...h, id]);
  };

  const undo = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  // preload current + next on id change
  useEffect(() => {
    if (!currentId) return;
    const node = nodeMap.current[currentId];
    if (!node) return;
    // preload current + immediate next(s)
    preloadMediaForBlock(node, layout);
    const nextIds = getNextIdsFromNode(node);
    nextIds.forEach((nid) => {
      preloadMediaForBlock(nodeMap.current[nid], layout);
    });
  }, [currentId, layout]);

  // start sequence
  useEffect(() => {
    const initial = startId || (nodes[0] && nodes[0].id);
    if (initial) setHistory([initial]);
  }, [nodes, startId]);

  // clear timer when unmount or id change
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // function to play a scene node: sets timer to advance (if appropriate)
  const playNode = useCallback(
    (node) => {
      if (!node) return;

      // clear previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // For scenes and actions that have a definite duration, auto-advance when duration elapses.
      if (node.type === "scene" || node.type === "action") {
        const m = node.media && node.media[layout];
        const duration = m && m.length ? Number(m.length) : 5;
        // find default next (for choices this matters, but for scene/action we use nextId)
        const nextIds = getNextIdsFromNode(node);
        const nextId = node.nextId || (nextIds && nextIds[0]) || null;

        if (nextId) {
          timerRef.current = setTimeout(() => {
            goTo(nextId);
          }, Math.max(0, duration * 1000));
        }
      }

      // For choice nodes: if exactly one option has isDefault=true -> auto advance
      if (node.type === "choice") {
        const opts = node.options || [];
        const defaultOpts = opts.filter((o) => o.isDefault);
        if (defaultOpts.length === 1) {
          // auto advance after duration if provided (use node.media[layout].length or fallback 5)
          const m = node.media && node.media[layout];
          const duration = m && m.length ? Number(m.length) : 5;
          const dest = defaultOpts[0].nextId;
          if (dest) {
            timerRef.current = setTimeout(() => {
              goTo(dest);
            }, Math.max(0, duration * 1000));
          }
        } else {
          // zero defaults => wait for user; >1 defaults => disallowed - treat as wait
          if (defaultOpts.length > 1) {
            console.warn(
              `[Sequence] Choice node ${node.id} has more than one default option. Waiting for user.`
            );
          }
        }
      }

      // collector: no auto-advance, wait for user submit (unless node.collector.nextId set and you choose to auto)
    },
    [layout]
  );

  // whenever current node changes, call playNode
  useEffect(() => {
    const node = currentId ? nodeMap.current[currentId] : null;
    playNode(node);
  }, [currentId, playNode]);

  // render current node center stage
  const renderCurrent = () => {
    const node = currentId ? nodeMap.current[currentId] : null;
    if (!node) return <div className="panel small-muted">Sequence finished</div>;

    // render common layout wrapper with background media, two child containers
    const commonProps = {
      node,
      layout,
      goTo,
      getNodeById: (id) => nodeMap.current[id],
      undo,
      setNodeData: (id, updates) => {
        // we can't directly update store here; components can call callback
      },
    };

    switch (node.type) {
      case "scene":
      case "action":
        return (
          <Scene
            node={node}
            layout={layout}
            onEnded={() => {
              // for scenes with explicit next, go there (Sequence.playNode handles timer, but in case video fires ended)
              const next = node.nextId || getNextIdsFromNode(node)[0];
              if (next) goTo(next);
            }}
          />
        );

      case "choice":
        return (
          <Choice
            node={node}
            layout={layout}
            onChoose={(nextId) => {
              goTo(nextId);
            }}
          />
        );

      case "collector":
        return (
          <Collector
            node={node}
            layout={layout}
            onSubmit={(keyValues) => {
              // record values in a local vars map if you want; for now, go to next
              if (node.collector && node.collector.nextId) goTo(node.collector.nextId);
            }}
          />
        );

      default:
        return <div className="panel">Unknown node type: {node.type}</div>;
    }
  };

  return (
    <div className="sequence-stage panel" style={{ width: "100%", height: "100%" }}>
      {renderCurrent()}
    </div>
  );
}