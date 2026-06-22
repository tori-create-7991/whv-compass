# Design system — Terracotta (JP-first adaptation)

WHV Compass uses the **Terracotta** aesthetic: a sun-baked, clay-toned editorial
interface on warm cream surfaces, ink-brown headlines, and a single terracotta
accent. Earthy, human, content-first — which suits a trust-driven product whose
value is *well-sourced reading*, and whose subject (Australia) is literally red
earth. The product UI is **Japanese-first**, so the type stack is adapted for JP.

Tokens are implemented as CSS variables in `apps/web/app/globals.css` and mapped
into Tailwind in `apps/web/tailwind.config.ts`. **Use semantic tokens, never raw
hex, in components.**

## Design tokens

### Color

| Token | Value | Use |
|-------|-------|-----|
| `--surface` | `#FFFFFF` | cards, panels |
| `--bg` (cream) | `#FBF6EC` | app background |
| `--sand` (secondary) | `#F3E9D8` | muted fills, candidate nodes |
| `--primary` (terracotta) | `#C56A3C` | single accent: CTAs, condition nodes, links |
| `--primary-strong` | `#A8542C` | hover/active of primary |
| `--ink` (text) | `#2A211C` | headlines & body on cream (AA on cream/white) |
| `--ink-muted` | `#6B5E54` | secondary text, captions |
| `--success` | `#16A34A` | next-action nodes, confirmations |
| `--warning` | `#D97706` | cautions, "review" states |
| `--danger` | `#DC2626` | risk nodes, errors |

**Contrast rule (must):** terracotta `#C56A3C` is an *accent*, not body text — it
fails AA as small text on white. Body text uses `--ink`. Terracotta is allowed for
large text (≥24px/700), icons, borders, and fills with sufficient contrast.

### Provenance & trust colors (product-specific)

| Provenance | Token | Badge |
|------------|-------|-------|
| `official` | `--primary` outline + ✓ | high trust |
| `experience` | `--warning` outline | signal, not fact |
| `ai_inferred` | dashed `--ink-muted` | hypothesis |
| `user` | solid `--ink` | said by you |

### Typography

- **Display/headings:** `DM Serif Display` (Latin) + `Shippori Mincho` /
  `Noto Serif JP` (Japanese) — the editorial serif voice, JP-complete.
- **Body/UI:** `Noto Sans JP` (clean, legible at small sizes for dense graph
  labels and chat).
- **Mono:** `JetBrains Mono` (code, ids, token counts).
- **Scale:** 14 / 16 / 18 / 24 / 32 / 40. Body 16, captions 14, never below 14.

### Spacing & radius

- Spacing scale: **4 / 8 / 12 / 16 / 24 / 32**. Keep a consistent rhythm.
- Radius: `8px` default, `12px` cards, `9999px` pills/badges.

## Accessibility (WCAG 2.2 AA — non-negotiable)

- Text contrast ≥ 4.5:1 (≥ 3:1 for large text); verify any terracotta-on-color.
- Visible `:focus-visible` ring on every interactive element (2px `--primary`).
- Keyboard-first: chat input, send, graph nodes, and submit form fully operable
  without a mouse. Graph nodes are reachable/focusable, not mouse-only.
- Touch targets ≥ **44×44px**.
- Respect `prefers-reduced-motion`: graph node-in animations become instant.
- Semantic HTML + labels; JP screen-reader friendly.

When aesthetics and accessibility conflict, **accessibility wins.**

## Signature layout: split screen

- **Left (≈40%)**: chat — answer rendered in the fixed template (結論 / あなたの
  条件 / 公式情報 / 体験談 / 注意点 / 次にやること / 出典) with source badges.
- **Right (≈60%)**: React Flow knowledge graph. New nodes animate in (≤200ms,
  honoring reduced-motion); `highlight` ids pulse briefly.
- **Persistent**: top disclaimer bar; URL-submit entry point.
- **Responsive**: below `768px`, stack vertically with a chat/graph tab toggle;
  no horizontal scroll; min font sizes preserved.

## Do / Don't

- **Do** use one accent (terracotta). **Don't** introduce a second bright hue;
  semantic success/warning/danger only carry meaning.
- **Do** keep the cream→sand→white surface hierarchy. **Don't** put body text in
  terracotta or low-contrast tan-on-cream.
- **Do** show provenance on every node and source on every claim. **Don't** render
  raw third-party HTML (sanitize; summaries only).

## QA checklist (code review)

- [ ] Only semantic tokens used (no raw hex in components).
- [ ] All text meets AA contrast; terracotta not used as small body text.
- [ ] Every interactive element has a visible focus state and ≥44px target.
- [ ] Graph is keyboard navigable; reduced-motion respected.
- [ ] Node provenance + source citation are visible.
- [ ] Layout reflows cleanly at 375 / 768 / 1280px without overflow.
