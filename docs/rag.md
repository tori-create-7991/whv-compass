# RAG design

Goal: ground answers in **official information first**, with experience/community
content as secondary signal — at MVP cost, but swappable as we scale.

## Retriever interface (pluggable)

`ragRetriever` is an interface in `services/api/src/rag`. Agents depend on the
interface, never on a concrete vector store, so Stage 1 → Stage 3 swaps are local.

```ts
export interface RagRetriever {
  retrieve(query: string, opts: {
    topK: number;
    tierBoost?: boolean;            // rank official chunks above experience
    filterTiers?: SourceTier[];     // e.g. ["official"] for a facts-only pass
  }): Promise<RetrievedChunk[]>;
}
```

`RetrievedChunk = { sourceId, text, tier, score }`.

## Stage 1 (MVP) implementation

Two backends ship behind the interface; pick via env:

1. **Static index (`StaticFaqRetriever`)** — a curated
   `data/official-faq.json` of vetted official facts + FAQs, embedded at build
   time. Zero external vector cost, deterministic, perfect for the first demo and
   for offline/local dev. Default when no GCP project is configured.
2. **Firestore Vector Search (`FirestoreVectorRetriever`)** — `ragChunks` with a
   vector field + `findNearest`. Used once content is ingested via the moderation
   pipeline.

### Ranking: official-first

After vector similarity, apply a **tier boost** so official chunks outrank
experience chunks at similar relevance. The answer template then separates
*公式情報* (official) from *体験談・集合知* (experience), and only official chunks
may back a factual claim; experience chunks back "tendency / caution / signal".

```
finalScore = similarity + tierWeight[tier]
tierWeight = { official: +0.15, media: +0.05, community: 0, sns: -0.05 }
```

## Cost controls (Stage 1)

- `RAG_TOP_K` default **6**, hard-capped.
- Embed once on ingest; never re-embed on read. Cache query embeddings per turn.
- Conversation summarization (`sessions.summary`) keeps prompt size bounded.
- Dedup submitted URLs by normalized URL + content hash before embedding.

## Stage 2 / 3 (see roadmap)

- Stage 2: a **RAG router** (decide official-only vs. include experience),
  query caching, source-quality scoring.
- Stage 3: **Vertex AI Vector Search** or **Cloud SQL pgvector / AlloyDB**,
  reranking, and a **citation verifier** that checks each cited claim against its
  chunk before the answer is returned.
