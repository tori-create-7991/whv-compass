import type { GraphUpdate, NodeKind, Provenance } from "@whv-compass/shared";
import type { Edge, Node } from "@xyflow/react";

export type FlowNodeData = {
  label: string;
  detail?: string;
  kind: NodeKind;
  provenance: Provenance;
};
export type FlowNode = Node<FlowNodeData>;

/** Accent color per node kind (Terracotta semantic tokens). */
export const KIND_ACCENT: Record<NodeKind, string> = {
  goal: "var(--ink)",
  condition: "var(--primary)",
  candidate: "var(--ink-muted)",
  risk: "var(--danger)",
  next_action: "var(--success)",
  source: "var(--ink-muted)",
};

function positionFor(index: number): { x: number; y: number } {
  // Simple column grid; swap for dagre/elk auto-layout later.
  const col = index % 3;
  const row = Math.floor(index / 3);
  return { x: col * 240 + 24, y: row * 150 + 24 };
}

/** Apply a graph_update to the current React Flow state (idempotent upsert by id). */
export function applyGraphUpdate(
  prev: { nodes: FlowNode[]; edges: Edge[] },
  update: GraphUpdate,
): { nodes: FlowNode[]; edges: Edge[] } {
  const nodeMap = new Map(prev.nodes.map((n) => [n.id, n] as const));
  for (const gn of update.nodes) {
    const existing = nodeMap.get(gn.id);
    nodeMap.set(gn.id, {
      id: gn.id,
      type: "knowledge",
      position: existing?.position ?? positionFor(nodeMap.size),
      data: { label: gn.label, detail: gn.detail, kind: gn.kind, provenance: gn.provenance },
      selected: update.highlight.includes(gn.id),
    });
  }

  const edgeMap = new Map(prev.edges.map((e) => [e.id, e] as const));
  for (const ge of update.edges) {
    edgeMap.set(ge.id, {
      id: ge.id,
      source: ge.source,
      target: ge.target,
      label: ge.label,
      animated: update.highlight.includes(ge.target),
    });
  }

  return { nodes: [...nodeMap.values()], edges: [...edgeMap.values()] };
}
