---
name: Agent Queue Task
about: AI ループエンジニアリングで実装するタスク
title: '[agent] '
labels: agent-queue
assignees: ''
---

<!-- 以下のメタデータブロックは n8n が parse します。書式厳守。 -->
<!-- repo は owner/repo 形式、lane_chain は jules/codex/claude のいずれか。 -->

```yaml
mode: single
repo: <owner>/<repo>
lane_chain: [jules, codex, claude]
max_cycles: 3
acceptance:
  - command: pnpm typecheck
  - command: pnpm lint
  - command: pnpm test
```

## タスク内容

<!-- 何を実装してほしいかを書く。
受け入れ条件 (Acceptance) は YAML 側の command が CI で全 PASS する状態。
必要なら追加の品質バーをここに書く。 -->

## 補足

<!-- 関連ファイル・参考リンク・既存実装の場所・避けるべきアプローチ等。
書くほど LLM の探索が短縮される。 -->

## 想定する変更スコープ

<!-- どのディレクトリを触る想定か。 -->
