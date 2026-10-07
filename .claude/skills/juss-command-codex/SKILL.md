---
name: juss-command-codex
version: 0.1.0
owner: Juss
status: draft-first-party
description: >
  Portable, governed slash-command library. Each command is a spec (intent, input, method,
  output contract, gate, redteam, pass-if) instead of a one-line shortcut. AI-agnostic plain
  markdown: runs the same on Claude, ChatGPT, Muse, DeepSeek, and Perplexity.
triggers:
  - /swot
  - /businessmodel
  - /landingpage
  - /userstory
  - /bugreport
  - /changelog
  - /coldemail
  - /casestudy
  - /database
  - /architecture
  - /security
  - /codereview
---

# Juss Command Codex — v0.1

## Kernel boundary

This codex is a subordinate command module under `juss-os`.
Before running it inside a Juss repository, load `../juss-os/SKILL.md` and `../juss-os/references/os.md`.
It cannot override `juss-os` authority, phase, evidence, state, receipt, merge/deploy, or verification gates.
Outside a repository (any council model, any chat), the Global law below applies on its own.
> Turn thoughts into living works. Each command is a governed spec, not a shortcut.
> **Portable:** this is plain markdown. Paste it into Claude, ChatGPT, Muse, DeepSeek, or Perplexity as a system or project instruction. It uses no tools, APIs, or model-specific features.

---

## 0. How to load it

Paste this whole file into the model's instructions, then say:

```
Codex loaded. Follow the Juss Command Codex for any message starting with /<command>.
```

**Call syntax**

```
/<command>: <subject>  [--depth quick|full]  [--for <audience>]
```

- `--depth quick` returns the output contract only.
- `--depth full` (the default) adds the reasoning and the redteam pass.
- Anything after the colon is the subject. Paste context, files, or data below the call.

---

## 1. Global law (applies to every command)

1. **Evidence tags.** Every factual claim gets one tag: `[VERIFIED]` (from the user's input or a cited source), `[INFERRED]` (reasoned from evidence and says from what), or `[UNKNOWN]` (needed but missing). Never present an inference as fact.
2. **No fabrication.** Never invent numbers, quotes, customers, metrics, sources, or test results. When a number is needed and absent, write `[UNKNOWN: <what's needed>]`.
3. **Missing input.** If a **required** input is missing, ask once, in one short list. If the user says "proceed," continue with stated assumptions, each labeled `ASSUMPTION:`.
4. **Output contract is law.** Return the sections the command defines, in that order. Nothing extra except the closing block in rule 7.
5. **Smallest useful output.** Prefer a decision over a menu, and one strong option over five weak ones.
6. **High-stakes gate.** Legal, tax, valuation, medical, and wellness content is labeled `DRAFT — for professional review`. It states its assumptions and jurisdiction and never claims to be advice.
7. **Close every command** with:

```
TRUTH CHECK: <count of VERIFIED / INFERRED / UNKNOWN claims>
RISK: <the one way this output could be wrong>
NEXT GATE: <one decision or action for the founder>
```

---

## 2. Spec template (use it to add commands)

```
### /<name>
INTENT:        one sentence — the decision this command serves
INPUT:         required: … | optional: …
METHOD:        numbered steps the model must follow
OUTPUT:        exact sections, in order
GATE:          what must be true before the output is valid
REDTEAM:       the attack the model runs on its own output
PASS IF:       checkable acceptance tests (how a human verifies it)
```

**Growth rule:** add a command only after you've done the task by hand twice. Version every change. Remove a command if it goes 60 days unused.

---

## 3. Commands

### /swot
**INTENT:** Decide the single best strategic move for a subject.
**INPUT:** required: subject, and what is known about its market | optional: competitors, goals, constraints
**METHOD:**
1. Separate internal factors (Strengths, Weaknesses) from external ones (Opportunities, Threats). Never mix them.
2. Give 3–5 points per quadrant, each with an evidence tag.
3. Cross the quadrants: S×O (attack), W×T (defend).
4. Pick the top 3 moves, then choose 1.

**OUTPUT:** Quadrants → Cross-moves (S×O, W×T) → Top 3 moves → THE move
**GATE:** No quadrant can be all `[INFERRED]` without saying so.
**REDTEAM:** "What would make THE move fail in 90 days?" Answer it in one line.
**PASS IF:** Internal and external factors aren't mixed. Every point is tagged. There's exactly one chosen move.

### /businessmodel
**INTENT:** Decide whether the business makes money, and what the riskiest assumption is.
**INPUT:** required: product, customer | optional: pricing, costs, channels
**METHOD:** Fill the 9 canvas blocks (segments, value proposition, channels, relationships, revenue, key resources, key activities, partners, costs). Mark every block as `[VERIFIED]` or `ASSUMPTION`. Rank the assumptions by how fatal they'd be if wrong.
**OUTPUT:** Canvas table → Riskiest assumption → Cheapest test of it (cost and time)
**GATE:** Revenue and cost blocks show `[UNKNOWN]` instead of made-up numbers.
**REDTEAM:** "Who pays, why now, and why not the free alternative?"
**PASS IF:** All 9 blocks are present. One riskiest assumption is named, with a test under one week.

### /landingpage
**INTENT:** Write landing page copy that turns one audience into one action.
**INPUT:** required: product, audience, the one action | optional: proof (testimonials, stats), tone
**METHOD:** Hero (headline under 10 words, subhead, CTA) → problem → how it works (3 steps) → proof → objections answered → final CTA.
**OUTPUT:** Copy, section by section → 2 alternate headlines → the claim most likely to be challenged
**GATE:** Proof uses only what the user provided. Missing proof becomes `[PROOF SLOT: <type needed>]`, never invented.
**REDTEAM:** Read it as a skeptic in 5 seconds: is the action obvious?
**PASS IF:** There's one CTA verb throughout. No invented stats or quotes. The headline is under 10 words.

### /userstory
**INTENT:** Turn a need into buildable, testable work.
**INPUT:** required: user, need | optional: constraints, edge cases
**METHOD:** "As a <user>, I want <capability>, so that <outcome>." Then add Given/When/Then acceptance criteria, including at least one failure path.
**OUTPUT:** Story → Acceptance criteria (3–6, one of them a failure path) → Out of scope → Open questions
**GATE:** Every criterion is testable by a person or a Playwright script.
**REDTEAM:** "Could this pass its criteria and still not deliver the outcome?"
**PASS IF:** There's at least one failure path. No vague words ("fast," "easy") without a measure.

### /bugreport
**INTENT:** Write a bug report that someone else can reproduce and fix without asking.
**INPUT:** required: what happened, what was expected | optional: steps, environment, logs, screenshots
**METHOD:** Exact repro steps → expected vs actual → environment → evidence → severity → suspected area (tagged `[INFERRED]`).
**OUTPUT:** Title (symptom + location) → Repro → Expected/Actual → Env → Evidence → Severity → Suspected cause
**GATE:** If the repro steps are unknown, say so explicitly. Don't fake steps.
**REDTEAM:** "Is this one bug or two?"
**PASS IF:** A stranger could follow the steps. The suspected cause is labeled as inference.

### /changelog
**INTENT:** Write release notes that tell users what changed for them.
**INPUT:** required: list of changes (commits, PRs, or notes) | optional: version, date, audience
**METHOD:** Group into Added / Changed / Fixed / Removed / Security. Rewrite each item as user impact, not implementation.
**OUTPUT:** Version + date → grouped notes → breaking changes (or "none") → upgrade action (if any)
**GATE:** Include only changes present in the input. Nothing aspirational.
**REDTEAM:** "Is anything here not shipped yet, or not merged?"
**PASS IF:** Each line traces to an input item. Breaking changes are stated even when empty.

### /coldemail
**INTENT:** Get one reply from one specific person.
**INPUT:** required: recipient (role or person), what you offer, the ask | optional: a real detail about them, proof
**METHOD:** Subject (under 6 words) → line 1 is about THEM, using only real details → one-sentence value → one proof point → a low-friction ask.
**OUTPUT:** Subject + body under 120 words → follow-up for day 4 → the personalization that's still missing
**GATE:** No fake familiarity ("loved your recent post") unless the user supplied the post.
**REDTEAM:** "Would I delete this in 3 seconds? Why?"
**PASS IF:** Under 120 words. One ask. No invented personal details.

### /casestudy
**INTENT:** Prove a result with a true story.
**INPUT:** required: customer (or anonymized), problem, what was done, result | optional: quotes, metrics, timeline
**METHOD:** Situation → problem cost → approach → result (numbers as given) → quote → what's next.
**OUTPUT:** Headline (the result) → story → metrics box → pull quote → CTA
**GATE:** Metrics and quotes come only from the input. Missing ones become `[NEEDS: …]`. Anonymize if consent is `[UNKNOWN]`.
**REDTEAM:** "Is the result caused by us, or just correlated?"
**PASS IF:** Every number and quote traces to the input. Consent status is stated.

### /database
**INTENT:** Design a schema that fits the real access patterns.
**INPUT:** required: entities, main queries/use cases | optional: engine (Postgres, D1, Supabase), scale, privacy needs
**METHOD:** List the access patterns first → entities and relations → tables with types, keys, indexes → constraints → privacy and retention.
**OUTPUT:** Access patterns → Schema (SQL DDL) → Indexes and why → Migration notes → Data that needs protection
**GATE:** Every index maps to a listed query. Personal or minor data is flagged.
**REDTEAM:** "Which query gets slow or wrong at 100× the data?"
**PASS IF:** The DDL runs as written for the stated engine. No orphan indexes.

### /architecture
**INTENT:** Choose a system shape with clear tradeoffs.
**INPUT:** required: what the system must do, constraints | optional: stack, scale, team size, budget
**METHOD:** Requirements → components and boundaries → data flow → the 2 strongest options compared → the decision → failure modes.
**OUTPUT:** Diagram (text or Mermaid) → Option A vs B table → Decision + why → Failure modes and mitigations → Reversal cost
**GATE:** Each component has one owner and one job.
**REDTEAM:** "What breaks first, and how would we know?"
**PASS IF:** One decision is made. Rollback or reversal cost is stated.

### /security
**INTENT:** Find the highest-risk gaps before an attacker does.
**INPUT:** required: system or code description, what's exposed publicly | optional: auth model, secrets, deploy setup
**METHOD:** List the attack surface → check auth, input validation, secrets, rate limits, data exposure, dependencies, and logging → rank by likelihood × impact.
**OUTPUT:** Attack surface → Findings table (issue, severity, evidence tag, fix) → Top 1 fix to do now
**GATE:** Defensive only. Describe each issue and its fix, never a working exploit. A finding without evidence is `[INFERRED]`.
**REDTEAM:** "What did I not check?" List it.
**PASS IF:** Each finding has a severity and a fix. Unchecked areas are listed.

### /codereview
**INTENT:** Decide merge, fix, or block, with evidence.
**INPUT:** required: diff or code, and what it's meant to do | optional: tests, CI output, repo conventions
**METHOD:** Check correctness against intent → security → error handling → tests (do they actually test the change?) → simplicity. Silenced, skipped, or deleted tests count as findings.
**OUTPUT:** Verdict (MERGE / FIX FIRST / BLOCK) → Findings (file:line, severity, why, fix) → Missing tests
**GATE:** No "looks good" without naming what was checked. Don't claim tests pass without seeing their output.
**REDTEAM:** "How could this pass CI and still break production?"
**PASS IF:** One verdict. Every finding has a location. Skipped tests are called out.

---

## 4. Version log

- **v0.1.0** (2026-10-07): 12 seed commands, global law, spec template, kernel boundary. First live use: `/codereview` on the PR that added this file.
