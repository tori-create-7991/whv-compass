import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ChatRequest, SubmitRequest } from "@whv-compass/shared";
import { env } from "./lib/env.js";
import { handleChat } from "./agents/chatAgent.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import { submitUrl } from "./workflows/urlIngestion.js";

const app = new Hono();

app.use("/*", cors({ origin: env.webOrigin, allowMethods: ["GET", "POST", "OPTIONS"] }));

app.get("/healthz", (c) => c.json({ ok: true, llm: env.geminiApiKey ? "enabled" : "mock" }));

app.post("/chat", rateLimitMiddleware, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = ChatRequest.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_request", issues: parsed.error.issues }, 400);
  }
  try {
    const res = await handleChat(parsed.data);
    return c.json(res);
  } catch (err) {
    console.error("[/chat] failed:", err);
    return c.json({ error: "internal_error" }, 500);
  }
});

app.post("/sources/submit", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = SubmitRequest.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_request", issues: parsed.error.issues }, 400);
  }
  const submission = await submitUrl(parsed.data);
  return c.json(submission, 202);
});

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`whv-compass api on http://localhost:${info.port} (llm: ${env.geminiApiKey ? "on" : "mock"})`);
});
