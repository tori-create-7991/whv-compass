"use client";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { KIND_ACCENT, type FlowNode, type FlowNodeData } from "@/lib/graph";

const PROVENANCE_LABEL: Record<string, string> = {
  user: "あなた",
  ai_inferred: "AI推定",
  official: "公式",
  experience: "体験談",
};

function KnowledgeNode({ data, selected }: NodeProps) {
  const d = data as FlowNodeData;
  const accent = KIND_ACCENT[d.kind];
  return (
    <div
      className="rounded-card border bg-surface px-3 py-2 shadow-sm"
      style={{
        borderColor: accent,
        borderLeftWidth: 4,
        maxWidth: 200,
        boxShadow: selected ? "0 0 0 2px var(--primary)" : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="line-clamp-2 text-[14px] font-medium text-ink">{d.label}</div>
      <div className="mt-1 text-[12px] text-ink-muted">{PROVENANCE_LABEL[d.provenance] ?? d.provenance}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { knowledge: KnowledgeNode };

export function GraphPanel({ nodes, edges }: { nodes: FlowNode[]; edges: Edge[] }) {
  return (
    <div className="relative h-full w-full">
      {nodes.length === 0 && (
        <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-[15px] text-ink-muted">
          相談すると、ここにワーホリ計画グラフが育ちます。
        </p>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--sand)" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
