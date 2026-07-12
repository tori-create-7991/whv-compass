import type { Context, Next } from "hono";
import { env } from "../lib/env.js";

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/** In-memory per-session rate limiter for POST /chat. */
export async function rateLimitMiddleware(c: Context, next: Next): Promise<Response | void> {
  const body = await c.req.raw.clone().json().catch(() => ({} as Record<string, unknown>)) as Record<string, unknown>;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : c.req.header("x-session-id") ?? "unknown";

  const now = Date.now();
  let win = windows.get(sessionId);

  if (!win || win.resetAt <= now) {
    win = { count: 0, resetAt: now + WINDOW_MS };
    windows.set(sessionId, win);
  }

  win.count += 1;

  if (win.count > env.rateLimitPerHour) {
    const retryAfterSec = Math.ceil((win.resetAt - now) / 1000);
    return c.json(
      { error: "rate_limited", message: "1時間あたりの質問上限に達しました。しばらくしてからお試しください。", retry_after: retryAfterSec },
      429,
    );
  }

  c.res.headers.set("X-RateLimit-Limit", String(env.rateLimitPerHour));
  c.res.headers.set("X-RateLimit-Remaining", String(Math.max(0, env.rateLimitPerHour - win.count)));
  c.res.headers.set("X-RateLimit-Reset", String(Math.ceil(win.resetAt / 1000)));

  await next();
}
