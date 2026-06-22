# Infra & deployment (Stage 1)

No IaC is required for the MVP — a handful of `gcloud`/`firebase` commands. This
folder is the home for Terraform if/when Stage 2 warrants it.

> Region: **australia-southeast1** (Sydney) — closest to the audience and data.
> Target domain: **aus.tori-dev.com** (subdomain).

## Prerequisites

```bash
gcloud auth login
gcloud config set project whv-compass-dev
firebase login
```

Enable APIs: Cloud Run, Firestore, Cloud Storage, Secret Manager, Cloud Build.

## 1. Secrets (never in git)

```bash
echo -n "$GEMINI_KEY" | gcloud secrets create gemini-key --data-file=-
```

## 2. API → Cloud Run

```bash
gcloud run deploy whv-compass-api \
  --source services/api \
  --region australia-southeast1 \
  --min-instances 0 --max-instances 3 \
  --set-secrets GOOGLE_GENERATIVE_AI_API_KEY=gemini-key:latest \
  --set-env-vars GCLOUD_PROJECT=whv-compass-dev,WEB_ORIGIN=https://aus.tori-dev.com
```

`min-instances 0` = scale to zero (no idle cost). `max-instances` caps blast radius.

## 3. Firestore + rules + vector index

```bash
firebase deploy --only firestore:rules,firestore:indexes
# Vector (KNN) index for RAG — see docs/rag.md for the exact field/dimension:
# gcloud firestore indexes composite create --collection-group=ragChunks \
#   --field-config field-path=embedding,vector-config='{"dimension":768,"flat":{}}'
```

## 4. Web → Firebase Hosting

```bash
# apps/web is wired via firebase.json frameworks backend
firebase deploy --only hosting
```

Set `API_BASE_URL` (the Cloud Run URL) in the Hosting backend env so the
`/api/chat` proxy can reach the API.

## 5. Guardrails

- **Budget alert** + cap: a billing budget with email/pubsub alert.
- **Kill switch**: set `READ_ONLY=true` on the Cloud Run service to disable LLM
  calls instantly if costs spike.
- Confirm `min-instances=0` and the rate limit before announcing publicly.
