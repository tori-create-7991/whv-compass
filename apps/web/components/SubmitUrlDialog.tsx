"use client";

import { useState } from "react";
import { submitUrl } from "@/lib/api";

type State = "idle" | "sending" | "done" | "error";

/** Lets anyone propose a URL to index. Goes to the moderation queue (not RAG). */
export function SubmitUrlDialog() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setState("sending");
    try {
      await submitUrl(url.trim());
      setState("done");
      setUrl("");
    } catch {
      setState("error");
    }
  };

  return (
    <details className="text-[14px]">
      <summary className="cursor-pointer rounded px-2 py-1 text-primary-strong hover:bg-sand">
        取り込んでほしいURLを提案
      </summary>
      <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="submit-url" className="sr-only">
          提案するURL
        </label>
        <input
          id="submit-url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…（公式情報や参考になる体験談）"
          className="min-h-[44px] flex-1 rounded border bg-surface px-3 text-[16px] text-ink"
          style={{ borderColor: "var(--sand)" }}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="min-h-[44px] rounded border border-primary px-3 font-medium text-primary-strong hover:bg-sand disabled:opacity-50"
        >
          提案する
        </button>
      </form>
      <p className="mt-1 text-[13px] text-ink-muted">
        {state === "done" && "ありがとうございます。承認後に反映されます。"}
        {state === "error" && "送信に失敗しました。時間をおいて再度お試しください。"}
        {state === "idle" && "承認制です。すぐには反映されません。個人情報は含めないでください。"}
      </p>
    </details>
  );
}
