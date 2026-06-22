import type { Source, SourceTier } from "@whv-compass/shared";

const TIER_LABEL: Record<SourceTier, string> = {
  official: "公式",
  media: "メディア",
  community: "口コミ",
  sns: "SNS",
  user_submitted: "投稿",
};

/** A citation chip. Official sources read as high-trust (terracotta); others muted. */
export function SourceBadge({ source }: { source: Source }) {
  const official = source.tier === "official";
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={source.title}
      className="inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[13px] leading-5 transition-colors hover:bg-sand"
      style={{
        borderColor: official ? "var(--primary)" : "var(--ink-muted)",
        color: official ? "var(--primary-strong)" : "var(--ink-muted)",
      }}
    >
      <span className="font-medium">{TIER_LABEL[source.tier]}</span>
      <span className="truncate">· {source.title}</span>
      {official ? <span aria-hidden>✓</span> : null}
    </a>
  );
}
