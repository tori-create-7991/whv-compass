# Data model & contracts

The canonical schemas live in [`packages/shared`](../packages/shared/src) as Zod
schemas (validated at runtime, inferred as TS types). This doc is the human
reference. **Change the schema in code, then update this doc.**

## The `graph_update` contract (core)

Each AI answer returns a `graph_update` describing how the on-screen knowledge
graph should change. The client applies it idempotently (upsert by node/edge id).

```jsonc
{
  "version": 1,
  "summary": "セカンドビザ向けの88日farm労働の条件を追加",
  "nodes": [
    {
      "id": "goal:second-visa",
      "kind": "goal",              // goal | condition | candidate | risk | next_action | source
      "label": "セカンドビザ取得",
      "detail": "2回目のWHVビザ",
      "provenance": "user",        // user | ai_inferred | official | experience
      "status": "active",          // active | done | rejected
      "sourceIds": []              // refs into the `sources` collection
    },
    {
      "id": "condition:88-days",
      "kind": "condition",
      "label": "指定地域で88日の指定労働",
      "provenance": "official",
      "sourceIds": ["src_homeaffairs_specified_work"]
    }
  ],
  "edges": [
    { "id": "e1", "source": "condition:88-days", "target": "goal:second-visa", "label": "必要条件" }
  ],
  "highlight": ["condition:88-days"]   // node ids to visually emphasize this turn
}
```

### Node kinds (from the product design)

| kind | meaning | typical color (Terracotta) |
|------|---------|----------------------------|
| `goal` | what the user wants | ink / neutral-strong |
| `condition` | a requirement/constraint | terracotta accent |
| `candidate` | an option (city, farm, job, suburb) | sand |
| `risk` | a danger/pitfall (scam, unpaid wages) | danger red |
| `next_action` | a concrete next step | success green |
| `source` | a cited reference node | muted, with trust badge |

### Provenance (who asserted it)

`user` (said by the user) · `ai_inferred` (model's hypothesis) · `official`
(from a government/official source) · `experience` (from reviews/forums/social).
The UI **must** visually distinguish these — provenance drives trust.

## Firestore collections (Stage 1)

| Collection | Key fields | Notes |
|------------|-----------|-------|
| `sessions` | `id`, `createdAt`, `lastSeenAt`, `summary` | Anonymous; no PII. `summary` caps context cost. |
| `messages` | `sessionId`, `role`, `text`, `sources[]`, `createdAt` | One per chat turn. |
| `graphNodes` | `sessionId`, `nodeId`, `kind`, `label`, `provenance`, `status`, `sourceIds[]` | Current graph state per session. |
| `graphEdges` | `sessionId`, `edgeId`, `source`, `target`, `label` | |
| `submittedUrls` | `url`, `status`, `submittedAt`, `classification`, `riskScore` | Moderation queue; `status ∈ pending/crawling/review/approved/rejected`. |
| `sources` | `id`, `url`, `title`, `tier`, `trustLevel`, `publisher`, `lastCheckedAt` | The trust registry (see below). |
| `documents` | `sourceId`, `storagePath`, `extractedAt` | Pointer to Cloud Storage artifacts. |
| `ragChunks` | `sourceId`, `text`, `embedding` (vector), `tier`, `tokens` | Retrieval unit; vector-indexed. |

Cloud Storage holds the heavy/raw artifacts: `raw/<hash>.html`,
`text/<hash>.txt`, `snapshots/<hash>.png` — never the full text in Firestore.

## Source & trust model

```jsonc
{
  "id": "src_homeaffairs_specified_work",
  "url": "https://immi.homeaffairs.gov.au/visas/.../specified-work",
  "title": "Specified work — Working Holiday visa",
  "tier": "official",          // official | media | community | sns | user_submitted
  "trustLevel": "high",        // high | medium | low
  "publisher": "Department of Home Affairs",
  "lastCheckedAt": "2026-06-20T00:00:00Z"
}
```

- **Tier → default trust:** official→high, media→medium, community/sns→low,
  user_submitted→low until reviewed.
- Answers cite `sources[]`; the graph's `source` nodes reference them by id.
- For social/forum content we store **summary + short quote + metadata + original
  URL + removal-check state**, never the full post. See moderation doc.
