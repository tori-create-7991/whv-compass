import { type GraphUpdate, type Source } from "@whv-compass/shared";
import type { RetrievedChunk } from "../rag/retriever.js";

/** Stable, slug-like node id from a label. */
function slug(prefix: string, label: string): string {
  const s = label
    .toLowerCase()
    .replace(/[^a-z0-9぀-ヿ一-龯]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `${prefix}:${s || "node"}`;
}

/**
 * Deterministic graph_update used on the mock path (no LLM key) and as a
 * structural fallback. Creates a goal node from the user's question and
 * condition/source nodes from retrieved official chunks. On the LLM path, the
 * model returns a graph_update directly (see chatAgent).
 */
export function buildGraphUpdate(
  message: string,
  chunks: RetrievedChunk[],
): { graph_update: GraphUpdate; sources: Source[] } {
  const goalId = slug("goal", message.slice(0, 30));
  const nodes: GraphUpdate["nodes"] = [
    {
      id: goalId,
      kind: "goal",
      label: message.length > 36 ? `${message.slice(0, 36)}…` : message,
      provenance: "user",
      status: "active",
      sourceIds: [],
    },
  ];
  const edges: GraphUpdate["edges"] = [];
  const sources: Source[] = [];

  for (const c of chunks.slice(0, 3)) {
    const condId = slug("condition", c.title);
    nodes.push({
      id: condId,
      kind: "condition",
      label: c.title,
      detail: c.text,
      provenance: c.tier === "official" ? "official" : "experience",
      status: "active",
      sourceIds: [c.sourceId],
    });
    edges.push({ id: `e:${condId}->${goalId}`, source: condId, target: goalId, label: "関連" });
    sources.push({
      id: c.sourceId,
      url: c.url,
      title: c.title,
      tier: c.tier,
      trustLevel: c.tier === "official" ? "high" : "low",
    });
  }

  return {
    graph_update: {
      version: 1,
      summary: "質問に関連する条件と出典を追加",
      nodes,
      edges,
      highlight: nodes.map((n) => n.id),
    },
    sources,
  };
}
