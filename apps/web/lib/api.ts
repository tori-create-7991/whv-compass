import type { ChatResponse, SourceSubmission } from "@whv-compass/shared";

/** Calls the same-origin Next route handler, which proxies to the API. */
export async function postChat(sessionId: string, message: string): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });
  if (!res.ok) throw new Error(`chat failed: ${res.status}`);
  return (await res.json()) as ChatResponse;
}

/** Submits a URL to the moderation queue (direct to API; CORS-allowed). */
export async function submitUrl(url: string, note?: string): Promise<SourceSubmission> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const res = await fetch(`${base}/sources/submit`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, note }),
  });
  if (!res.ok) throw new Error(`submit failed: ${res.status}`);
  return (await res.json()) as SourceSubmission;
}
