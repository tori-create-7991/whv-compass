# 2. Firebase + Cloud Run + Firestore + Gemini for the MVP

Date: 2026-06-23

## Status

Accepted

## Context

We need a login-less AI consultation app with a realtime graph UI, user URL
submissions, a moderation queue, and RAG — at near-zero idle cost for an MVP. An
alternative (Plan A) was Cloudflare Pages + Workers + a static FAQ, which is even
cheaper but weaker on realtime data, queues, and a growth path to managed vector
search.

## Decision

Adopt **Plan B**:

- **Firebase Hosting** for the Next.js web app.
- **Cloud Run** (scale-to-zero) running a **Mastra** agent/workflow service.
- **Firestore** (+ Vector Search) as the single Stage-1 datastore for sessions,
  messages, graph, sources, moderation queue, and RAG chunks.
- **Cloud Storage** for raw/extracted crawl artifacts.
- **Gemini free tier** (Flash) as the MVP LLM, with no-PII + rate-limit guards and
  a documented path to a paid/Vertex tier.

RAG and the LLM sit behind interfaces so Stage 2/3 upgrades (Cloud Tasks, Vertex
AI Vector Search, pgvector, reranking, citation verification) are local swaps.

## Consequences

- One managed datastore covers login-less realtime + queue + MVP RAG → less
  moving parts for Stage 1.
- Cloud Run scale-to-zero keeps idle cost ~0; cold starts are acceptable for MVP.
- Free-tier Gemini imposes rate/usage limits → enforced no-PII, question caps,
  and a kill-switch; production needs a paid tier.
- Vendor lean toward GCP, mitigated by Mastra portability and interface seams.
