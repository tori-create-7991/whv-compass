import { z } from "zod";
import { SourceTier } from "./sources.js";

export const SubmissionStatus = z.enum([
  "pending", // just submitted, awaiting crawl
  "crawling", // being fetched
  "review", // classified, awaiting human approval
  "approved", // indexed into RAG
  "rejected", // declined (see reason)
]);
export type SubmissionStatus = z.infer<typeof SubmissionStatus>;

export const SourceSubmission = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  status: SubmissionStatus.default("pending"),
  submittedAt: z.string().datetime(),
  suggestedTier: SourceTier.optional(),
  classification: z.string().optional(), // AI topic classification
  summary: z.string().optional(), // short AI summary (not full text)
  riskScore: z.number().min(0).max(1).optional(),
  reason: z.string().optional(), // rejection reason
});
export type SourceSubmission = z.infer<typeof SourceSubmission>;

export const SubmitRequest = z.object({
  url: z.string().url(),
  suggestedTier: SourceTier.optional(),
  note: z.string().max(1000).optional(),
  turnstileToken: z.string().optional(),
});
export type SubmitRequest = z.infer<typeof SubmitRequest>;
