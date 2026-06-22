# Roadmap — 3-stage architecture

Cost-first MVP that upgrades along two axes (cost-efficiency, then accuracy)
without rewrites, because RAG and the LLM sit behind interfaces.

## Stage 1 — MVP (this repo's target)

**Goal:** prove the experience end-to-end, cheaply.

- Firebase Hosting (web) + Cloud Run Mastra (api, `min-instances=0`).
- Firestore + Firestore Vector Search; Cloud Storage for raw/extracted content.
- Gemini **free tier** (Flash). Static official-FAQ retriever as the zero-cost
  default; vector search once content is ingested.
- Login-less chat → `answer + graph_update` → Firestore → React Flow.
- URL submit + minimal moderation queue. Disclaimers, rate limits, no PII.

**Exit criteria** (mirrors the Notion completion checklist):

- [ ] Chat → `graph_update` JSON → Firestore → React Flow loop works live.
- [ ] Official vs. experience sources separated; answers show 出典 + 信頼度.
- [ ] URL submit form + approval queue (minimal) work.
- [ ] Cost caps, rate limit, no-PII, disclaimer in place.

## Stage 2 — cost-efficient & robust

**Goal:** keep cost flat as traffic grows; improve reliability.

- **Cloud Tasks / Pub/Sub** for async crawling & ingestion (off the request path).
- **Query/result caching** (common questions) + conversation summarization.
- **RAG router**: decide official-only vs. include-experience per query.
- **Source-quality scoring** feeding the tier boost.
- Secret Manager, budget alerts, structured logging/metrics.

## Stage 3 — accuracy-first

**Goal:** maximize answer trustworthiness.

- **Vertex AI Vector Search** or **Cloud SQL pgvector / AlloyDB** for scale + recall.
- **Reranking** of retrieved chunks.
- **Citation verifier**: validate each cited claim against its chunk before
  returning the answer; drop/flag unsupported claims.
- Structured review analytics (aggregate experience signals into trends).
- Move LLM to a paid Gemini / Vertex tier with higher limits.

## Content rollout (initial scope)

Start narrow, expand later:

1. Second visa / 88-day specified work / specified regions & industries.
2. Job hunting (café, Japanese restaurants, farms; unpaid-wage protection).
3. Housing (sharehouses, bond, scam avoidance).
4. Money (initial costs, monthly living costs) + arrival checklist (TFN, bank,
   SIM, insurance).
5. User-submitted source queue feeding all of the above.
