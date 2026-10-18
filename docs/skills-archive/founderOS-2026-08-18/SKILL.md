---
name: founderOS
description: >
  Juss's upstream launch orchestration skill. Activates when turning a new idea,
  feature, or strategic decision into the smallest durable verified product slice.
  ALWAYS trigger on: new ideas, "how do I build X", "ship this", ULTRATHINK on
  new work, cross-repo decisions, "idea to product", /steal, /futureyou, /founderOS,
  Bill Gates systems thinking, Elon first-principles, deep research requests, release
  identity questions, or any work that is UPSTREAM of a repair — meaning nothing is
  broken yet, something new needs to exist. This is NOT goalfix (which fixes broken
  things). This is the OS that runs BEFORE you know what to build or fix. Owner: Juss
  (jussray). Brand: "turn thoughts into living works."
version: 1.0
owner: Juss (jussray)
triggers:
  - /founderOS
  - /idea-to-product
  - /steal
  - /futureyou
  - ULTRATHINK (new work)
  - "how do I build"
  - "ship this"
  - "new feature"
  - "idea"
  - "strategic decision"
  - "cross-repo"
---

# /founderOS — Juss Founder Launch OS
## Intent → Research → Steal → Build → Verify → Evidence → Loop

---

## BOUNDARY (read first)

**This skill = upstream orchestration. New work. Intent to launch.**
**Use `/goalfix` instead if:** something is broken, there's an outage, you need a repair, you're merging a fix.

If you're unsure: ask "is something broken?" → Yes = goalfix. No = founderOS.

---

## WHO YOU ARE BUILDING FOR

**Juss** — solo founder, `jussray` brand, mission: *"turn thoughts into living works."*

Portfolio (three standalone products, shared trust architecture):
- **Chief AI** — Founder Intelligence OS (defines intent)
- **Founder Control Room** — Agent governance / execution
- **L99** — AI integrity / trust infrastructure

Active: Se'kret Bip · JBH · trading-agent · StoryEngine
Dev pattern: iPhone + Codespaces (work hours) · Laptop (evenings)
Mode: terse directives · challenge not validate · ships small reversible changes

---

## PHASE 1 — INTENT (before touching any repo)

Answer these before anything else. If you can't answer one, that's the first blocker.

```
IDEA:       What is Juss trying to create?
USER:       Who experiences the problem?
OUTCOME:    What observable result must exist when done?
PROOF:      What evidence says this problem is real?
CONSTRAINTS: Time · money · architecture · platform · privacy · launch stage
```

Produce: one-paragraph intent statement Juss can confirm or correct.
Do not proceed until intent is confirmed or refined.

---

## PHASE 2 — LOCAL REALITY (repo audit before external research)

Before searching the world, search what already exists.

```
REPO:         Authoritative repo + branch + HEAD SHA
EXISTS:       Does any version of this already exist in the codebase?
ADJACENT:     What can be connected instead of built new?
CONSTRAINTS:  What does the repo already define that bounds this work?
```

Classify every finding:
- `VERIFIED` — confirmed from direct evidence
- `INFERRED` — reasonable but not confirmed
- `UNKNOWN` — not yet determined
- `BLOCKED` — cannot proceed without external action

**Never convert UNKNOWN → VERIFIED.**

---

## PHASE 3 — WORLD SEARCH (only when local reality is exhausted)

External research earns its place only when it would materially change:
diagnosis · architecture · security · UX · product direction · launch strategy

Search worldwide — not only famous US tech companies. Look across:
official docs → standards → primary research → open-source → incident reports → postmortems → startups → other industries

Classify findings:
- `KNOWN` — evidence-backed
- `TRANSFERABLE` — mechanism can fit Juss's system
- `CONTEXT-SPECIFIC` — worked elsewhere, may not transfer
- `REJECTED` — interesting but unsuitable

Stop researching when it stops changing the decision. Research ≠ procrastination.

---

## PHASE 4 — /STEAL

Extract durable mechanics from successful systems. Never copy proprietary expression.

**Steal the physics, not the paint.**

Ask of every external pattern:
> What principle made this work?

Extract:
- Invariants · Architecture patterns · Reliability mechanisms
- Product mechanics · Information hierarchy · Onboarding loops
- Testing strategies · Failure prevention · Growth loops

Then transform through:

```
ME NOW          What is verified today in Juss's system?
      ↓
FUTUREYOU       What does the intended mature system look like?
      ↓
GAP             What constraint separates those two states?
      ↓
MECHANIC        What proven external principle helps close the gap?
      ↓
JUSS VERSION    How must it change for this product · users · budget ·
                architecture · brand · privacy · launch stage?
      ↓
BRIDGE          Smallest compounding complete implementation
      ↓
PROOF           What evidence proves progress?
```

External excellence is raw material. Juss's system is the finished product.

---

## PHASE 5 — OPERATING STACK

Apply in order for every nontrivial decision:

### /garyvee
- What founder value does this serve?
- What user outcome must exist?
- What is the fastest truthful proof?
- Ship useful reality, not hype.

### Lindy
- Will this fix still make sense in 2 years?
- Prefer boring, portable, reversible, observable primitives.
- Novel complexity must earn its place.

### Redteam I (attack the premise)
- Is the diagnosis correct?
- Should this change exist?
- Does this already exist somewhere in the repo?
- Can existing code be connected instead?
- Are we solving a symptom?

### L99
Map for every change:
- **Authority** — who decided this?
- **Provenance** — where did this come from?
- **State** — what changed?
- **Evidence** — what proves it works?
- **Rollback** — how fast can we undo? (target: <2 min, no data loss)
- **Compounding value** — does this fix enable the next fix?

### Redteam II (attack the implementation)
- How could this fail?
- Could stale state hide the problem?
- Could caching mislead verification?
- Could auth differ in production?
- Could the test prove the wrong path?
- Could rollback fail?

### OODA
Observe actual state → Orient to highest-leverage constraint → Decide one reversible path → Act → Collect evidence → Re-orient when evidence changes.

---

## PHASE 6 — BILL GATES SYSTEMS LENS

Use as systems heuristic, not personality imitation.

Ask:
- What is the bottleneck?
- What repeatedly consumes founder effort?
- What should become reusable infrastructure?
- What should remain manual until understood?
- Where can software create compounding leverage?
- What complexity prevents scaling?
- **What should NOT be scaled yet?**

Understand the process before automating it.

---

## PHASE 7 — ELON FIRST-PRINCIPLES LENS

Use as engineering heuristic, not personality imitation.

For difficult systems, in order:
1. Question requirements — where did each come from?
2. Remove requirements that are not actually necessary
3. Remove unnecessary steps or architecture
4. Simplify the surviving system
5. Shorten feedback loops
6. Optimize only after simplification
7. **Automate last**

Speed never overrides: safety · privacy · security · accessibility · evidence · rollback · founder authority.

---

## PHASE 8 — MINIMUM DURABLE PRODUCT

Choose the smallest useful complete production slice.

Define full correctness boundary before reducing scope. Include every coupled change required for: correctness · security · privacy · data integrity · UX · operability · verification · rollout · rollback.

```
one root cause → one coherent correction
```

A partial mitigation must not be called complete when a known gap remains.

Do not spend weeks architecting something that can be truthfully tested much sooner.

---

## PHASE 9 — BUILD + VERIFY

### Verification ladder (cheapest first)
1. Syntax / static check
2. Touched-area typecheck
3. Touched-area lint
4. Targeted unit test
5. Targeted integration / contract test
6. Build
7. Targeted Playwright critical journey
8. Device / native proof where required
9. Security / authority / privacy checks
10. Exact-head evidence check
11. Broader CI
12. Provider / deployment verification
13. Production consumer-path proof when required

**For Se'kret Bip UI/runtime: Playwright evidence required before calling it done.**

### Release identity — track the full chain
```
repo SHA → build artifact → deployment → runtime release → browser/device-tested release
```

Provider success ≠ consumer truth:
- Cloudflare deploy success ≠ users received the intended release
- Supabase migration success ≠ app uses schema correctly
- GitHub mergeable ≠ merge authorized

---

## PHASE 10 — /STEAL ME TOO

When a pattern works repeatedly across jussray projects, promote it to reusable infrastructure.

Possible outputs: skill · test helper · workflow · component · design token · provider adapter · CI primitive · evidence format · release-proof primitive · automation · template

**Promote only verified repeated value. Do not abstract from one unproven experiment.**

---

## FUTUREYOU / TRUTHMODE / CONFESS (always active)

### /futureyou
*How should this be remembered by building it?*
Leave a map, not a maze. Every build must preserve: purpose · decisions · authority · assumptions · provenance · evidence · failure detection · recovery · rollback · unresolved unknowns · next gate.

### /TRUTHMODE
Separate at all times: verified facts · inference · assumptions · risks · unknowns · blockers.

### /confess
Expose what is not proven. Do not polish BLOCKED into success. Do not hide failed tests, stale evidence, or unresolved uncertainty. Teach the next builder enough to safely continue, improve, or reverse the work.

---

## REQUIRED COMPLETION REPORT

Every implementation, feature, or launch decision ends with:

```
REALITY:
  What is verified right now.

BUILD:
  What was decided and created — files / commit / PR / design / decision.

PROOF:
  Tests · CI · Playwright · provider evidence · runtime readback · exact SHA.

RISK:
  Meaningful uncertainty that still remains.

ROLLBACK:
  Smallest safe reversal path. Target: <2 min, no data loss.

NEXT GATE:
  One exact founder decision or next launch-moving action.
```

Never claim completion without evidence.

---

## /LOOP

After one verified step: re-observe reality. Select next highest-leverage launch-critical constraint.

**Stop when:**
- Definition of done is satisfied
- Explicit founder decision required
- Provider access unavailable
- Production mutation requires separate gate
- Destructive action or spending required
- Same blocker unchanged after valid verification — surface it, don't loop it

---

## KNOWN jussray ECOSYSTEM CONSTRAINTS

| Tool | Constraint |
|------|-----------|
| Zapier GitHub | Creates files, cannot edit existing. Cannot write `.github/workflows/` (422, missing `workflow` scope — not transient) |
| `@claude` GitHub App | Required for fix→merge loop on Se'kret Bip |
| Supabase CI | Requires `--yes` flag on `supabase db push` |
| Buffer | Routes through Zapier, not standalone MCP |
| `github_create_branch` | Use explicit full commit SHA as `ref` |
| HubSpot deal reads | Use `execute_zapier_write_action` not read action |
| Instagram / TikTok | Not connected in Buffer — requires manual OAuth |

---

## MASTER MANTRA

> Intent first. Repo truth second. World search only when it changes the decision.
> Steal the physics, not the paint. Transform through FutureYou.
> Build the smallest coherent COMPLETE thing.
> Prove the exact release through the real user path.
> Leave evidence for the next builder.
> Turn repeated wins into reusable Juss infrastructure.
> Then loop toward launch.
