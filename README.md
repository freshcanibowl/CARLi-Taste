# CARLi Taste × Qloo

Cultural-interest discovery prototype for people and pet guardians. Qloo supplies cultural candidate signals; **CARLi Taste does not establish whether venues permit pets**.

## Public demo

- Discovery: https://carli-taste-qloo.vercel.app/
- Optional seven-day journey: https://carli-taste-qloo.vercel.app/journey
- Local taste profile and usage evidence: https://carli-taste-qloo.vercel.app/profile
- Devpost submission: https://devpost.com/software/carli-taste-qloo-cultural-discovery

The above are the configured public URLs, not a claim of independently verified current uptime. Production deployment has previously been reported READY; live monitoring is not configured.

## Run locally

```bash
cd app
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

For live discovery, configure `QLOO_API_KEY` in server-side environment variables only. Never commit API keys or expose them with a `NEXT_PUBLIC_` prefix. The API routes require a valid Qloo key for a live response; the app does not synthesize pet-friendly venues if Qloo fails.

## What the demo actually does

1. Takes an interest, queries Qloo Search for interest seeds and Qloo Insights for cultural entities.
2. Displays cultural matches with pet policies **UNVERIFIED** and no pet-entry approval.
3. Accepts optional outing notes for current-page planning; these **are not transmitted to the CARLi app server or Qloo, are not saved, and are not used to filter/rank results**. Only the interest goes to the application server on search. Older API clients may still submit constraints, but the server no longer echoes those notes in responses.
4. Offers a seven-day voluntary reflection tool and local feedback. Journey notes and likes/dislikes are stored in **this browser's localStorage**; no account or cross-device synchronization is implemented.
5. Offers opt-in **client-side** ranking and manual export/import of a portable local profile. This is a heuristic reordering, not a validated AI relevance or wellbeing outcome.
6. Records limited local interaction events for a **single browser**. These are not population analytics, independently validated visits, bookings, retention, or revenue.

## Safety and privacy boundaries

- Always verify pet-entry policy, accessibility, hours, and other venue requirements independently.
- Do not enter health records, identifying details, or other sensitive information in the discovery form or personal notes.
- Other users of the same browser may see the locally stored profile. Exported JSON contains optional reflections; store it carefully.
- Use the Journey page to delete notes and the Discovery page to clear feedback. Profile page supports clearing local interaction evidence.
- This is **not** a clinical tool, veterinary advice, or evidence of improved health.

## Pilot acceptance gates

- **Technical GO:** repeatable `npm test`, TypeScript check, production build, browser smoke tests of Discovery/Journey/Profile; publicly accessible routes verified externally.
- **Data/safety GO:** Qloo is a real source, upstream failures fail closed, pet policies always remain explicitly unverified without independent evidence, user data controls work.
- **Commercial GO:** documented consent for pilot participants, real independent user sessions, feedback and value hypothesis, and an observable paid-use signal. No pilot, conversion, retention, or revenue claims before actual evidence.
- **STOP:** misleading pet-friendly claims; loss or leakage of private user notes; exposed secret; unexpectedly high upstream API spend; inability to reproduce critical tests.

Status: **deployed hackathon prototype, not a validated commercial product**. Public landing-page functionality alone does not establish pilot adoption or production readiness.
