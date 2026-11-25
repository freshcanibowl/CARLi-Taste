# Build 37 — Privacy-first real-user pilot protocol

Status: **NOT STARTED**. This document is a protocol, not evidence of recruitment, live uptime, consent, demand, conversion or payment.

## Preconditions (fail closed)

1. Confirm a fresh Vercel **production** deployment corresponds to the merged GitHub commit; check `/`, `/journey`, `/profile`, and `/api/status` without credentials on a normal browser. Record HTTP status, local time, release SHA, screenshots and any exceptions. Do not equate deployment READY with externally reachable.
2. Confirm `QLOO_API_KEY` is configured server-side, a real response is returned, and pet policy remains UNVERIFIED. Do not publish the key or pretend search results are pet-entry approvals.
3. Verify no journey notes/feedback or outing notes appear in outgoing `/api/recommend` requests using browser DevTools; request should contain **taste only**.
4. Share a short consent information sheet before each session. Do not gather sensitive health, addresses, phone numbers or precise location. Participants may stop or decline any question.

## Protocol: 5 participants, separate sessions

Recruit five voluntary adult testers who have an interest in cultural discovery. Do not claim they represent a population. Ideally include some pet guardians and some non-pet guardians. No paid acquisition or deployment to clinical populations is implied.

Each participant is shown how to:
- Enter a cultural interest and intentionally click Explore; identify one Qloo-sourced cultural candidate.
- Explain in their own words what the **UNVERIFIED** pet policy means; request that they independently verify any venue-specific facts.
- Open evidence details and indicate whether the result was useful.
- Explore the optional seven-day Journey; do not require seven consecutive days in a single session.
- Access the profile page and demonstrate an export and deletion action (using dummy notes only).

**Interview questions (avoid leading wording):**
1. Which specific problem, if any, would this help you solve?
2. What did you expect the pet-policy status to mean?
3. What information was missing for you to act on the result?
4. Would you use this again this week? What would prompt that?
5. Have you paid for another way to solve this problem? If not, under what conditions would you consider paying? Record a quote, not a hypothetical sale.

## Evidence ledger — append one row per consented participant

Use a participant pseudonym without personal identifiers. Record date, consent=yes/no, task completion=yes/no, unverified-label comprehension=yes/no, explicit value statement (verbatim), critical friction, repeat-use intention, *actual* follow-up if any, price question response, and evidence source. Do not collect the browser-exported Journey notes by default. Do not upload private respondent data to public GitHub.

## Decision gates

**Engineering GO** = CI green + public route verification + real Qloo result + no note leakage.

**Safety GO** = all 5 testers correctly understand that results do not verify pet admission, or misleading UI is fixed and re-tested before expansion. Any user confusing UNVERIFIED with approved triggers STOP and UI repair.

**Evidence-of-value GO** = at least 3 of 5 participants can name a specific problem solved and 2 voluntarily use the experience on a second day, with timestamped consented evidence. These are *pilot thresholds*, not confidence intervals or market-proof.

**Commercial GO** = at least one real, documented willingness-to-pay commitment or paid pilot from a distinct user/partner; a hypothetical price answer alone does not qualify.

**STOP/KILL** = secret exposure, sensitive data transmission, misleading venue safety claims, inability to validate live Qloo, unapproved tracking, or repeat failures on basic tasks.

Why Continue: technical prototype and testable interest signals exist.
Stop/Kill Criteria: zero repeated use, no real pain, failure of safety comprehension, or unverifiable live source.

## Current evidence ledger

| Participant | Consented | Search completed | UNVERIFIED understood | Repeated use | Paid commitment |
|---|---|---|---|---|---|
| None enrolled | — | — | — | — | — |

No pilot findings are claimed.
