# Build 38 — Live Deployment Attestation

## Objective

Prove that the **public, unauthenticated** CARLi Taste deployment serves the expected pages and production Git commit. A green GitHub CI run alone is insufficient. No fake Qloo results, user analytics, bookings, or pet approval are inferred from this check.

## Run from a machine with public internet access

```bash
cd app
npm run verify:live -- --base https://carli-taste-qloo.vercel.app --sha YOUR_MERGED_MAIN_COMMIT_SHA
```

The script prints one JSON line per endpoint and a final gate verdict; it uses read-only GET requests to `/`, `/journey`, `/profile`, and `/api/status`. It never calls Qloo, which may cost money. A missing or mismatched commit hash is **not a verified production release**. `HTTP_ROUTES_PASS` with no `--sha` is a basic route check only.

Expected sample format (NOT a real result):

```json
{"gate":"HTTP_ROUTES_PASS","releaseVerified":true,"expectedRevision":"...","actualRevision":"...","qlooLiveVerified":false,"petPolicyApproved":false}
```

The public status endpoint exposes only a nonsecret revision from `VERCEL_GIT_COMMIT_SHA` (or `GITHUB_SHA` in non-Vercel setups), deployment environment, and whether Qloo key is configured; it does **not** expose any API key. `qlooConfigured: true` does **not** demonstrate live Qloo success. `liveQlooVerified: false` remains the default.

## Auth/403/404 recovery

The available Vercel connections currently returned HTTP 403 / project 404, and the public URL could not be independently fetched. Therefore **production verification is NO-GO** until:
1. In Vercel Dashboard, find which team owns the actual `carli-taste-qloo` project and confirm the GitHub repo `freshcanibowl/CARLi-Taste` is connected.
2. Confirm deployment for the current `main` commit is READY and assigned to `carli-taste-qloo.vercel.app`.
3. Confirm deployment protection is configured intentionally. If a public user requires authentication, this is not an unauthenticated public demo; do not disable protection without the owner approving the access policy.
4. Reauthorize the appropriate Vercel account/team to the connection, or run the read-only checker locally on a machine with internet access.
5. Check `/api/status` does not leak secrets and `revision` is the merged main commit SHA.

## Separate live-Qloo gate

With an authorized and rate-limited manual test, search for a benign cultural interest, and capture a timestamped evidence sample of source attribution. Verify `UNVERIFIED` is displayed for pet policy. Never enter personal notes, private locations, or protected information into the search form. Do not treat this route probe as a live Qloo test.

## Stop criteria

- STOP external recruiting if public routes or release identity cannot be verified.
- STOP if notes or feedback leave the user's browser without consent, or if results imply that Qloo validates pet entry.
- STOP if the live-Qloo request fails or secret appears in responses/logs.

Related pilot protocol: [BUILD37_PILOT_PROTOCOL.md](BUILD37_PILOT_PROTOCOL.md).
