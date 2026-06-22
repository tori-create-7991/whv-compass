"use client";

const KEY = "whv-compass-session";

/** Anonymous, login-less session id (random; no PII). Stored locally. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
