---
name: proofmode
description: Establish what is actually proven by source, tests, CI, browser, runtime, provider, and outcome evidence.
version: 1.0.0
owner: Juss & Co.
scope: portable-reference
authority: advisory
triggers:
  - /proofmode
---

# PROOFMODE: evidence before claims

## Evidence planes

Keep these distinct:

1. **Source:** exact repository, branch, commit, diff, and readback.
2. **Static checks:** typecheck, lint, schema validation, security analysis.
3. **Tests:** focused unit, integration, migration, and regression tests.
4. **CI:** required workflows completed on the exact candidate head.
5. **Browser/device:** Playwright or device evidence for affected user journeys.
6. **Runtime/provider:** exact deployed version, environment, configuration, and provider readback.
7. **Outcome:** the intended user or business result observed at the real boundary.

## Rules

- Bind every claim to its exact subject, source, timestamp, and environment where relevant.
- A skipped, cancelled, stale, unstarted, or missing check is not a pass.
- A test proves only the behavior it exercised. CI does not prove production runtime. Deployment does not prove a user outcome.
- Re-run evidence after the subject moves; predecessor proof becomes historical or stale.
- Record failures and unknowns. Never fabricate logs, screenshots, traces, receipts, signatures, or approvals.
- Use Playwright for changed browser/UI flows and preserve the actual result.
- State what evidence is sufficient, what is missing, and what would falsify the conclusion.

## Authority boundary

Proof is an input to a decision, not permission. This skill cannot approve a merge, deploy, publish, spend, change credentials, or delete data. Keep rollback and the next human gate explicit.
