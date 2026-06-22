/** Central, typed access to environment configuration. */
export const env = {
  port: Number(process.env.API_PORT ?? 8080),
  gcloudProject: process.env.GCLOUD_PROJECT ?? "",
  geminiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
  ragTopK: Number(process.env.RAG_TOP_K ?? 6),
  maxTokensPerAnswer: Number(process.env.MAX_TOKENS_PER_ANSWER ?? 1200),
  rateLimitPerHour: Number(process.env.RATE_LIMIT_QUESTIONS_PER_HOUR ?? 20),
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY ?? "",
  readOnly: process.env.READ_ONLY === "true", // cost kill-switch
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
} as const;

/** When false, agents return deterministic mocked answers (no LLM cost). */
export function isLlmEnabled(): boolean {
  return env.geminiApiKey.length > 0 && !env.readOnly;
}
