import { z } from "zod";

/** Node kinds shown on the React Flow knowledge graph. */
export const NodeKind = z.enum([
  "goal", // what the user wants
  "condition", // a requirement / constraint
  "candidate", // an option: city, farm, job, suburb
  "risk", // a danger / pitfall
  "next_action", // a concrete next step
  "source", // a cited reference
]);
export type NodeKind = z.infer<typeof NodeKind>;

/** Who asserted a node — drives the trust/visual treatment. */
export const Provenance = z.enum([
  "user", // said by the user
  "ai_inferred", // the model's hypothesis
  "official", // from a government / official source
  "experience", // from reviews / forums / social
]);
export type Provenance = z.infer<typeof Provenance>;

export const NodeStatus = z.enum(["active", "done", "rejected"]);
export type NodeStatus = z.infer<typeof NodeStatus>;

export const GraphNode = z.object({
  id: z.string().min(1), // stable id, e.g. "condition:88-days"
  kind: NodeKind,
  label: z.string().min(1),
  detail: z.string().optional(),
  provenance: Provenance,
  status: NodeStatus.default("active"),
  sourceIds: z.array(z.string()).default([]),
});
export type GraphNode = z.infer<typeof GraphNode>;

export const GraphEdge = z.object({
  id: z.string().min(1),
  source: z.string().min(1), // source node id
  target: z.string().min(1), // target node id
  label: z.string().optional(),
});
export type GraphEdge = z.infer<typeof GraphEdge>;

/**
 * The payload an AI answer returns to mutate the on-screen graph.
 * Applied idempotently by the client (upsert by id).
 */
export const GraphUpdate = z.object({
  version: z.literal(1),
  summary: z.string().optional(), // one-line description of this turn's change
  nodes: z.array(GraphNode).default([]),
  edges: z.array(GraphEdge).default([]),
  highlight: z.array(z.string()).default([]), // node ids to emphasize this turn
});
export type GraphUpdate = z.infer<typeof GraphUpdate>;

export const EMPTY_GRAPH_UPDATE: GraphUpdate = {
  version: 1,
  nodes: [],
  edges: [],
  highlight: [],
};
