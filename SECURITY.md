# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead, use GitHub's
private [Report a vulnerability](https://github.com/tori-create-7991/whv-compass/security/advisories/new)
flow (Security → Advisories). We aim to acknowledge within 72 hours.

Include: affected component (`apps/web`, `services/api`, infra), reproduction
steps, and impact. Please give us reasonable time to fix before public disclosure.

## Data & privacy scope

WHV Compass is **login-less** and is designed to avoid collecting personal data:

- The UI actively discourages entering personal/sensitive information, and we do
  not request it. Reports about flows that could leak user data are in scope.
- User-submitted URLs are moderated before indexing; injection via submitted
  content (prompt injection, SSRF via crawl targets, stored XSS) is in scope.
- We store summaries/quotes/metadata of third-party content, not full copies.

## Out of scope

- Findings that require a compromised Google/GCP account or physical access.
- Rate-limit/abuse reports better filed as normal issues (unless they enable a
  concrete security impact).

## Supported versions

This is pre-1.0 software; only `main` is supported. Dependency vulnerabilities are
tracked via Dependabot/`pnpm audit`.
