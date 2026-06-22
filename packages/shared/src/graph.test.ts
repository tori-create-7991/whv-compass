import { describe, expect, it } from "vitest";
import { GraphUpdate, EMPTY_GRAPH_UPDATE } from "./graph.js";
import { defaultTrustForTier, TIER_WEIGHT } from "./sources.js";

describe("GraphUpdate contract", () => {
  it("accepts a well-formed update and fills array defaults", () => {
    const parsed = GraphUpdate.parse({
      version: 1,
      summary: "add second-visa goal",
      nodes: [
        {
          id: "goal:second-visa",
          kind: "goal",
          label: "セカンドビザ取得",
          provenance: "user",
        },
      ],
    });
    expect(parsed.nodes[0]?.status).toBe("active");
    expect(parsed.nodes[0]?.sourceIds).toEqual([]);
    expect(parsed.edges).toEqual([]);
    expect(parsed.highlight).toEqual([]);
  });

  it("rejects an unknown node kind", () => {
    const result = GraphUpdate.safeParse({
      version: 1,
      nodes: [{ id: "x", kind: "banana", label: "x", provenance: "user" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a wrong version", () => {
    const result = GraphUpdate.safeParse({ version: 2, nodes: [] });
    expect(result.success).toBe(false);
  });

  it("exposes a usable empty update", () => {
    expect(GraphUpdate.parse(EMPTY_GRAPH_UPDATE)).toEqual(EMPTY_GRAPH_UPDATE);
  });
});

describe("source trust", () => {
  it("treats official sources as high trust and sns as low", () => {
    expect(defaultTrustForTier("official")).toBe("high");
    expect(defaultTrustForTier("sns")).toBe("low");
  });

  it("ranks official above sns via tier weight", () => {
    expect(TIER_WEIGHT.official).toBeGreaterThan(TIER_WEIGHT.sns);
  });
});
