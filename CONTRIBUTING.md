# Contributing to WHV Compass

Thanks for helping build a trustworthy, community-owned resource for Working
Holiday makers in Australia. Contributions of code, content, and **source
submissions** are all welcome.

## Ground rules

1. **Official information is the factual base.** Answers and indexed content must
   treat government/official pages (Department of Home Affairs, Fair Work
   Ombudsman, ATO, Workforce Australia, etc.) as the source of truth. Reviews,
   forums, and social posts are *experience/signal*, never fact. See
   [`docs/moderation-and-privacy.md`](./docs/moderation-and-privacy.md).
2. **Never paste personal or sensitive data** into issues, PRs, fixtures, or test
   data. No real names, passports, TFNs, visa grant numbers, addresses.
3. **No secrets in git.** Use `.env` (gitignored) locally and Secret Manager / CI
   secrets in deployment. PRs that add credentials will be rejected.
4. **Respect source licensing.** We store summaries, short quotes, metadata, and
   the original URL — not full copyrighted text. Honor robots.txt and site ToS.

## Development setup

```bash
# Prereqs: Node 20+, pnpm 9+
pnpm install
cp .env.example .env
pnpm dev          # web on :3000, api on :8080
```

- `pnpm lint` · `pnpm typecheck` · `pnpm test` must pass before you open a PR.
- `pnpm format` runs Prettier.
- Shared contracts (the `graph_update` payload, source/trust types) live in
  [`packages/shared`](./packages/shared) — change them there, not in copies.

## Pull requests

- Branch from `main`; keep PRs focused and small where possible.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for titles,
  e.g. `feat(web): highlight risk nodes on the graph`.
- Describe the user-visible change and how you verified it. Add/adjust tests for
  behavior changes — test names should read as English sentences.
- CI (lint, typecheck, build, test) runs on every PR and must be green.

## Submitting a source

The highest-value contribution is often a good **source**. Open a
[Source submission](https://github.com/tori-create-7991/whv-compass/issues/new?template=source_submission.yml)
issue with the URL, why it's useful, and whether it's *official* or *experience*.
Approved sources are crawled, summarized, and added to RAG with a trust level.

## License

By contributing, you agree your contributions are licensed under the project's
[MIT License](./LICENSE).
