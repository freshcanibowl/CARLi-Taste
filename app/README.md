# CARLi Taste × Qloo — Gate 0 starter

Independent hackathon implementation. Not yet a working Qloo integration or eligible submission.

## Run
`npm install && npm run dev`

## Current state
- Minimal UI and validated POST input are implemented.
- API route deliberately fails closed (503) until Qloo endpoint/credentials are verified.
- No real Qloo call, recommendations, agent orchestration, pet-friendly verification, ablation results, production deployment, or tests are claimed.

## Next gates
1. Obtain Qloo API key privately; confirm endpoints and API terms from official docs.
2. Record a sanitized real API receipt (never expose key).
3. Implement server-only Qloo adapter and evidence-bound ranking.
4. Add independent pet-friendly validation, constraints, Qloo ON/OFF tests and owner approval.
5. Run typecheck/build/test, publish an externally hosted public demo, public repo and suitable license after IP review.

## Background IP
No code is copied from private CAIOS or CARLi systems. Existing public CARLi repos are reference only. Do not add patient, owner or animal private data.

## Build 02 — Offline contract and safety gates
- `npm test`: ten deterministic contract tests, including missing cultural evidence and independent pet-friendly verification.
- `GET /api/status`: transparent integration state.
- `POST /api/recommend`: validates input and fails closed with HTTP 503; it does **not** make Qloo calls yet.
- No fabricated recommendations, real user data, credentials, or public deployment.
- Next: verify Qloo developer guide and live API with private server-only credentials, then add a real adapter and end-to-end tests.
