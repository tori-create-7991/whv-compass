/** Persistent, non-dismissable safety notice (see docs/moderation-and-privacy.md). */
export function Disclaimer() {
  return (
    <div
      role="note"
      className="border-b bg-sand px-4 py-2 text-[13px] leading-5 text-ink-muted"
      style={{ borderColor: "var(--primary)" }}
    >
      <span aria-hidden>⚠️ </span>
      一般情報のみ・公式ではありません（法務／移民／税務／医療の助言ではありません）。
      必ず公式情報（Home Affairs / Fair Work / ATO 等）で確認してください。
      <strong className="text-ink"> 個人情報・機微情報は入力しないでください。</strong>
    </div>
  );
}
