import { randomUUID } from "node:crypto";
import {
  type SourceSubmission,
  type SubmitRequest,
  defaultTrustForTier,
} from "@whv-compass/shared";
import { getDb } from "../lib/firestore.js";

/**
 * Mastra-style "URL Ingestion Workflow" — entry step only.
 *
 * Full pipeline (see docs/moderation-and-privacy.md):
 *   submit → Turnstile + dedup → crawl (Cloud Storage) → AI classify/summarize/
 *   risk-score → review queue → human approve → chunk + embed → ragChunks.
 *
 * The submitter NEVER writes to ragChunks/sources directly; only the privileged
 * moderation step does, after human approval. This function performs the safe
 * first step: record the submission as `pending`.
 */
export async function submitUrl(req: SubmitRequest): Promise<SourceSubmission> {
  const submission: SourceSubmission = {
    id: randomUUID(),
    url: req.url,
    status: "pending",
    submittedAt: new Date().toISOString(),
    suggestedTier: req.suggestedTier,
  };

  if (req.suggestedTier) {
    // Trust is provisional until human review regardless of the suggestion.
    void defaultTrustForTier(req.suggestedTier);
  }

  const db = getDb();
  if (db) {
    try {
      // Dedup by normalized URL would happen here before write (stage 2).
      await db.collection("submittedUrls").doc(submission.id).set(submission);
    } catch (err) {
      console.warn("[urlIngestion] persist failed (best-effort):", err);
    }
  }

  // TODO(stage-1): enqueue crawl (inline) / (stage-2) publish to Cloud Tasks.
  return submission;
}
