# @whv-compass/api

Agents & workflows for WHV Compass, served over HTTP (Hono) and deployed to
**Cloud Run**. Organized as Mastra-style units:

| Unit | File | Role |
|------|------|------|
| Chat Agent | `src/agents/chatAgent.ts` | retrieve → answer (fixed template) → graph_update |
| Graph Update Generator | `src/agents/graphUpdateGenerator.ts` | deterministic `graph_update` (mock path + fallback) |
| RAG Retriever | `src/rag/retriever.ts` | pluggable; Stage-1 `StaticFaqRetriever` |
| URL Ingestion Workflow | `src/workflows/urlIngestion.ts` | submit → moderation queue (entry step) |

> **Framework note:** the agent layer is implemented on the Vercel AI SDK
> (`ai` + `@ai-sdk/google`), which is the same model-provider layer Mastra uses.
> The module boundaries above are drop-in seams for migrating to `@mastra/core`;
> tracked in [`../../docs/roadmap.md`](../../docs/roadmap.md).

## Run locally

```bash
pnpm --filter @whv-compass/api dev      # http://localhost:8080
```

Without `GOOGLE_GENERATIVE_AI_API_KEY`, `/chat` returns a **mocked** answer plus a
real `graph_update`, so the UI works offline. Set the key in the repo-root `.env`
to enable live Gemini answers.

## Endpoints

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/healthz` | — | `{ ok, llm }` |
| POST | `/chat` | `ChatRequest` | `ChatResponse` (`answer`, `sources`, `graph_update`) |
| POST | `/sources/submit` | `SubmitRequest` | `SourceSubmission` (202) |

Schemas are in [`@whv-compass/shared`](../../packages/shared/src).

## Deploy (Cloud Run, Stage 1)

```bash
gcloud run deploy whv-compass-api \
  --source . \
  --region australia-southeast1 \
  --min-instances 0 \
  --set-secrets GOOGLE_GENERATIVE_AI_API_KEY=gemini-key:latest
```

`min-instances=0` keeps idle cost at ~0. See [`../../infra/README.md`](../../infra/README.md).
