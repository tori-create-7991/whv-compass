import { z } from "zod";
import { GraphUpdate } from "./graph.js";
import { Source } from "./sources.js";

export const Role = z.enum(["user", "assistant"]);
export type Role = z.infer<typeof Role>;

/**
 * The fixed answer template (product design):
 * 結論 / あなたの条件 / 公式情報 / 体験談・集合知 / 注意点 / 次にやること / 出典
 */
export const AnswerSections = z.object({
  conclusion: z.string(), // 結論
  yourSituation: z.string().optional(), // あなたの条件
  official: z.string().optional(), // 公式情報 (official sources only)
  experience: z.string().optional(), // 体験談・集合知 (signal, not fact)
  cautions: z.string().optional(), // 注意点
  nextActions: z.array(z.string()).default([]), // 次にやること
});
export type AnswerSections = z.infer<typeof AnswerSections>;

export const ChatMessage = z.object({
  sessionId: z.string().min(1),
  role: Role,
  text: z.string(),
  sources: z.array(Source).default([]),
  createdAt: z.string().datetime(),
});
export type ChatMessage = z.infer<typeof ChatMessage>;

export const ChatRequest = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
  turnstileToken: z.string().optional(), // required in production
});
export type ChatRequest = z.infer<typeof ChatRequest>;

export const ChatResponse = z.object({
  answer: z.string(), // rendered answer text
  sections: AnswerSections.optional(), // structured form, when available
  sources: z.array(Source).default([]),
  graph_update: GraphUpdate,
  mocked: z.boolean().default(false), // true when no LLM key is configured
});
export type ChatResponse = z.infer<typeof ChatResponse>;
