"use client";

import { useCallback, useState } from "react";
import type { Edge } from "@xyflow/react";
import { ChatPanel, type ChatTurn } from "@/components/ChatPanel";
import { Disclaimer } from "@/components/Disclaimer";
import { GraphPanel } from "@/components/GraphPanel";
import { SubmitUrlDialog } from "@/components/SubmitUrlDialog";
import { postChat } from "@/lib/api";
import { applyGraphUpdate, type FlowNode } from "@/lib/graph";
import { getSessionId } from "@/lib/session";

export default function Home() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [graph, setGraph] = useState<{ nodes: FlowNode[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"chat" | "graph">("chat");

  const handleSend = useCallback(async (message: string) => {
    setTurns((t) => [...t, { id: crypto.randomUUID(), role: "user", text: message }]);
    setLoading(true);
    try {
      const res = await postChat(getSessionId(), message);
      setTurns((t) => [
        ...t,
        { id: crypto.randomUUID(), role: "assistant", text: res.answer, sources: res.sources, mocked: res.mocked },
      ]);
      setGraph((g) => applyGraphUpdate(g, res.graph_update));
      setTab("graph");
    } catch {
      setTurns((t) => [
        ...t,
        { id: crypto.randomUUID(), role: "assistant", text: "エラーが発生しました。API が起動しているか確認してください。" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="flex h-dvh flex-col">
      <header className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--sand)" }}>
        <div>
          <h1 className="text-[24px] leading-7">WHV Compass</h1>
          <p className="text-[13px] text-ink-muted">公式情報を土台に、AIと一緒にワーホリを計画する</p>
        </div>
        <SubmitUrlDialog />
      </header>

      <Disclaimer />

      {/* Mobile chat/graph toggle */}
      <div className="flex border-b md:hidden" style={{ borderColor: "var(--sand)" }} role="tablist" aria-label="表示切替">
        {(["chat", "graph"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className="min-h-[44px] flex-1 text-[15px] font-medium"
            style={{
              color: tab === k ? "var(--primary-strong)" : "var(--ink-muted)",
              borderBottom: tab === k ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            {k === "chat" ? "相談" : "グラフ"}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <section
          className={`${tab === "chat" ? "flex" : "hidden"} w-full border-r md:flex md:w-2/5`}
          style={{ borderColor: "var(--sand)" }}
          aria-label="相談"
        >
          <div className="w-full">
            <ChatPanel turns={turns} loading={loading} onSend={handleSend} />
          </div>
        </section>
        <section
          className={`${tab === "graph" ? "block" : "hidden"} w-full md:block md:w-3/5`}
          aria-label="ワーホリ計画グラフ"
        >
          <GraphPanel nodes={graph.nodes} edges={graph.edges} />
        </section>
      </div>
    </main>
  );
}
