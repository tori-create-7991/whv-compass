import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { SourceTier } from "@whv-compass/shared";

export interface RetrievedChunk {
  sourceId: string;
  tier: SourceTier;
  url: string;
  title: string;
  text: string;
  score: number;
}

export interface RagRetriever {
  retrieve(
    query: string,
    opts: { topK: number; tierBoost?: boolean; filterTiers?: SourceTier[] },
  ): Promise<RetrievedChunk[]>;
}

type FaqEntry = Omit<RetrievedChunk, "score">;

/**
 * Stage-1 default retriever: a curated, vetted set of official facts/FAQs.
 * Zero external/vector cost, deterministic — ideal for local dev and the first
 * demo. Swap for FirestoreVectorRetriever / Vertex AI without touching agents.
 */
export class StaticFaqRetriever implements RagRetriever {
  private readonly entries: FaqEntry[];

  constructor() {
    const here = dirname(fileURLToPath(import.meta.url));
    const raw = readFileSync(join(here, "official-faq.json"), "utf8");
    this.entries = JSON.parse(raw) as FaqEntry[];
  }

  async retrieve(
    query: string,
    opts: { topK: number; filterTiers?: SourceTier[] },
  ): Promise<RetrievedChunk[]> {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = this.entries
      .filter((e) => !opts.filterTiers || opts.filterTiers.includes(e.tier))
      .map((e) => {
        const haystack = `${e.title} ${e.text}`.toLowerCase();
        const overlap = terms.filter((t) => haystack.includes(t)).length;
        return { ...e, score: overlap / Math.max(terms.length, 1) };
      })
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, opts.topK);
  }
}

let singleton: RagRetriever | null = null;

/** Factory — returns the configured retriever for the current stage. */
export function getRetriever(): RagRetriever {
  // TODO(stage-2): return FirestoreVectorRetriever when ragChunks exist.
  if (!singleton) singleton = new StaticFaqRetriever();
  return singleton;
}
