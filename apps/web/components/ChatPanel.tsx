"use client";

import { useState } from "react";
import type { Source } from "@whv-compass/shared";
import { SourceBadge } from "./SourceBadge";

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  mocked?: boolean;
};

function EmptyHint() {
  return (
    <div className="rounded-card border bg-surface p-4 text-[14px] text-ink-muted" style={{ borderColor: "var(--sand)" }}>
      <p className="mb-2 font-medium text-ink">何でも聞いてください。例:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>セカンドビザの88日ファームの条件は？</li>
        <li>到着後にやることチェックリストは？</li>
        <li>シェアハウスのボンド詐欺を避けるには？</li>
      </ul>
    </div>
  );
}

function Bubble({ turn }: { turn: ChatTurn }) {
  const isUser = turn.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className="max-w-[88%] rounded-card border px-3 py-2 text-[15px] leading-6"
        style={{
          borderColor: isUser ? "var(--primary)" : "var(--sand)",
          background: isUser ? "var(--sand)" : "var(--surface)",
          color: "var(--ink)",
        }}
      >
        <p className="whitespace-pre-wrap">{turn.text}</p>
        {turn.mocked && (
          <p className="mt-2 text-[12px] text-warning">モック回答（LLMキー未設定）</p>
        )}
        {turn.sources && turn.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {turn.sources.map((s) => (
              <SourceBadge key={s.id} source={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatPanel({
  turns,
  loading,
  onSend,
}: {
  turns: ChatTurn[];
  loading: boolean;
  onSend: (msg: string) => void;
}) {
  const [input, setInput] = useState("");
  const submit = () => {
    const v = input.trim();
    if (!v || loading) return;
    onSend(v);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {turns.length === 0 ? <EmptyHint /> : turns.map((t) => <Bubble key={t.id} turn={t} />)}
        {loading && <p className="text-[14px] text-ink-muted">考え中…</p>}
      </div>
      <form
        className="border-t p-3"
        style={{ borderColor: "var(--sand)" }}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          相談を入力
        </label>
        <div className="flex gap-2">
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: セカンドビザの88日ファームの条件は？"
            autoComplete="off"
            className="min-h-[44px] flex-1 rounded border bg-surface px-3 text-[16px] text-ink placeholder:text-ink-muted"
            style={{ borderColor: "var(--sand)" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] rounded bg-primary px-4 text-[15px] font-medium text-white transition-colors hover:bg-primary-strong disabled:opacity-50"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
