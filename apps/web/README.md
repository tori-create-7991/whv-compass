# @whv-compass/web

Next.js (App Router) front-end: a split screen with an **AI chat** (left) and a
**live React Flow knowledge graph** (right) that updates from each answer's
`graph_update`. Styled with the **Terracotta** design system
([`../../docs/design-system.md`](../../docs/design-system.md)).

## Run

```bash
pnpm --filter @whv-compass/web dev    # http://localhost:3000
```

`/api/chat` (a Next route handler) proxies to the API (`API_BASE_URL`) so the
browser holds no backend URL/secret. With no Gemini key set on the API, answers
are mocked but the graph still updates — fully explorable offline.

## Structure

- `app/page.tsx` — split-screen shell + state (messages, graph) with a mobile
  chat/graph tab toggle.
- `components/ChatPanel.tsx` — conversation + input + source badges.
- `components/GraphPanel.tsx` — React Flow canvas; nodes colored by kind, badged
  by provenance.
- `components/Disclaimer.tsx` — persistent "not official / no PII" notice.
- `lib/graph.ts` — applies a `graph_update` to React Flow nodes/edges.
- `lib/api.ts` — chat + URL-submit clients.

## Deploy

Firebase Hosting (web frameworks) — see [`../../infra/README.md`](../../infra/README.md).
