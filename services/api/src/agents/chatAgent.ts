import {
  type ChatRequest,
  type ChatResponse,
  GraphUpdate,
  type Source,
} from "@whv-compass/shared";
import { env, isLlmEnabled } from "../lib/env.js";
import { getRetriever } from "../rag/retriever.js";
import { saveTurn } from "../lib/session.js";
import { buildGraphUpdate } from "./graphUpdateGenerator.js";

/**
 * The fixed answer template the model must follow.
 * 結論 / あなたの条件 / 公式情報 / 体験談・集合知 / 注意点 / 次にやること / 出典
 */
const SYSTEM_PROMPT = `あなたはオーストラリアのワーキングホリデー相談AIです。
公式情報（Home Affairs / Fair Work / ATO / Workforce Australia 等）を事実の根拠とし、
レビュー・掲示板・SNSは「体験談・傾向・注意喚起」として扱い、事実の根拠にはしないこと。
回答は次の型に従う: 結論 / あなたの条件 / 公式情報 / 体験談・集合知 / 注意点 / 次にやること / 出典。
法務・移民・税務・医療の確定的助言はせず、必ず公式情報での確認を促す。
与えられた sources 以外を出典として捏造しない。`;

/**
 * Mastra-style "Chat Agent". Orchestrates retrieval → answer → graph update.
 * Falls back to a deterministic mock when no LLM key is configured so the UI is
 * fully explorable offline.
 */
export async function handleChat(req: ChatRequest): Promise<ChatResponse> {
  const retriever = getRetriever();
  const chunks = await retriever.retrieve(req.message, {
    topK: env.ragTopK,
    tierBoost: true,
  });

  void saveTurn(req.sessionId, { role: "user", text: req.message, sources: [] });

  if (!isLlmEnabled()) {
    const { graph_update, sources } = buildGraphUpdate(req.message, chunks);
    const answer = mockAnswer(req.message, sources);
    void saveTurn(req.sessionId, { role: "assistant", text: answer, sources });
    return { answer, sources, graph_update, mocked: true };
  }

  // --- LLM path (Gemini via the AI SDK; Mastra agent migration: see roadmap) ---
  const { generateObject } = await import("ai");
  const { google } = await import("@ai-sdk/google");

  const context = chunks
    .map((c) => `- [${c.tier}] ${c.title} (${c.url})\n  ${c.text}`)
    .join("\n");

  const { object } = await generateObject({
    model: google(env.geminiModel),
    schema: LlmAnswerSchema,
    system: SYSTEM_PROMPT,
    prompt: `ユーザーの質問:\n${req.message}\n\n利用可能な出典:\n${context}\n\nこの質問に答え、graph_update を生成してください。`,
  });

  const sources: Source[] = chunks
    .filter((c) => object.usedSourceIds.includes(c.sourceId))
    .map((c) => ({
      id: c.sourceId,
      url: c.url,
      title: c.title,
      tier: c.tier,
      trustLevel: c.tier === "official" ? "high" : "low",
    }));

  // Validate the model's graph against the shared contract; fall back if invalid.
  const parsed = GraphUpdate.safeParse(object.graph_update);
  const graph_update = parsed.success
    ? parsed.data
    : buildGraphUpdate(req.message, chunks).graph_update;

  void saveTurn(req.sessionId, { role: "assistant", text: object.answer, sources });
  return { answer: object.answer, sources, graph_update, mocked: false };
}

// A relaxed schema for the model (no literals/defaults → friendlier to LLMs).
import { z } from "zod";
const LlmAnswerSchema = z.object({
  answer: z.string().describe("結論から始まる、テンプレートに沿った回答本文"),
  usedSourceIds: z.array(z.string()),
  graph_update: z.object({
    version: z.number(),
    summary: z.string().optional(),
    nodes: z.array(
      z.object({
        id: z.string(),
        kind: z.enum(["goal", "condition", "candidate", "risk", "next_action", "source"]),
        label: z.string(),
        detail: z.string().optional(),
        provenance: z.enum(["user", "ai_inferred", "official", "experience"]),
        sourceIds: z.array(z.string()).optional(),
      }),
    ),
    edges: z.array(
      z.object({ id: z.string(), source: z.string(), target: z.string(), label: z.string().optional() }),
    ),
    highlight: z.array(z.string()).optional(),
  }),
});

function mockAnswer(message: string, sources: Source[]): string {
  const cites = sources.map((s) => `- ${s.title}（${s.tier}）: ${s.url}`).join("\n");
  return [
    "【結論】これはモック回答です（LLMキー未設定）。右のグラフは実際に更新されています。",
    `【あなたの条件】質問: ${message}`,
    "【公式情報】下記の出典を参照してください。",
    "【体験談・集合知】（キー設定後に有効化されます）",
    "【注意点】一般情報のみ・公式ではありません。個人情報は入力しないでください。",
    "【次にやること】GOOGLE_GENERATIVE_AI_API_KEY を設定して再実行。",
    `【出典】\n${cites || "（なし）"}`,
  ].join("\n\n");
}
