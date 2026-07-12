# WHV Compass MVP — Remaining Implementation Plan

Notion: 3872f5910ab7819abba1f21da0db3c6a
Status: Doing

## Scope

The scaffold is complete and typechecks pass. Remaining items before the first demo:

## Tasks

- [ ] 1. Expand official-faq.json from 3 → 15+ entries (all 5 initial content areas)
- [ ] 2. Rate limiting middleware — enforce env.rateLimitPerHour per session on POST /chat
- [ ] 3. Session persistence — save chat turns to Firestore when available
- [ ] 4. Dockerfile for Cloud Run API service
- [ ] 5. .env.example files for api and web
- [ ] 6. Validate: pnpm typecheck, pnpm test, API smoke test

## Content areas for FAQ

1. セカンドビザ / 88日指定労働 / 指定地域・指定業種
2. 仕事探し（カフェ、ジャパレス、ファーム、給与未払い対策）
3. 住居探し（シェアハウス、ボンド、詐欺回避）
4. 初期費用・月生活費・到着後チェックリスト（TFN, 銀行, SIM, 保険）
5. 一般的な権利・ビザ条件・滞在期間
