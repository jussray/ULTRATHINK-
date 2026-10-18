# ULTRATHINK knowledge base

Purpose: the process knowledge behind the ULTRATHINK skills, in one place, so every agent (Claude, Claude Code, Codex, ChatGPT, Muse, DeepSeek, Perplexity, and any future seat) can load the same lineage, vocabulary, and lessons.

This file is **knowledge, not law**. The law is `.claude/skills/juss-os/references/os.md`. Where this file and os.md disagree, os.md wins.

This file holds process knowledge only. Project facts, personal details, client material, and anything about minors or sensitive personal data stay out of this repo by design.

Evidence labels used below: **VERIFIED** (a source in this repo or a dated record confirms it), **INFERRED**, **UNKNOWN**.

## 1. Lineage

| Step | What | Status |
|---|---|---|
| juss-os v1 → v2 → v2.1 → v3 | Law layer built in successive drafts | VERIFIED (skill lineage metadata) |
| v3 review | Muse review (5 items) and Court C0–C4 | VERIFIED (lineage metadata) |
| v3 founder-accepted | 2026-10-03 04:51 ET | VERIFIED (agent architecture record) |
| v3.1 | truth / confess / runtime-first-class implementation | VERIFIED (lineage metadata) |
| v3.1.1 | public technical reply evidence gate | VERIFIED (lineage metadata) |
| Export to repo | juss-os exported to `main` as c77c4b8, founder-approved merge 2026-10-05 | VERIFIED (dated record) |
| Canonicalization | Formal FOUNDER ACCEPT / CANONICALIZE for an exact version | UNKNOWN until recorded against an exact SHA (see `references/acceptance.md`) |
| Title drift | `os.md` line 1 still reads `v3-DRAFT` while frontmatter says `v3.1.1` | VERIFIED, open; do not edit law text without approval |

**UNKNOWN:** the original conversations in which the ULTRATHINK skills were designed are not available to the agent that wrote this file. Rationale beyond what is written in the skill files and dated records below is UNKNOWN until the author adds it.

## 2. Vocabulary

- **ULTRATHINK**: the router. It picks which lenses run, at what depth, and aggregates results. It is not a source of truth.
- **/goalfix**: the repair loop. One cause, one reversible patch, narrowest test, real-path proof.
- **/godmode**: one governed build loop combining ULTRATHINK, goalfix, redteam, L99, OODA, confess, and truthmode. Commits on a fix branch by default; merge only on explicit approval.
- **/confess**: self-audit. Where did the agent say more than the evidence permits?
- **/truthmode**: evidence verifier. Claims get labels; missing evidence is never turned into certainty.
- **L99**: authority, state, evidence, rollback, compounding value.
- **OODA**: observe, orient, decide, act, verify, loop.
- **Lindy**: prefer boring, explicit, reversible, few-dependency choices; test the choice against future change.
- **Redteam I / II**: attack whether the change should exist, then how the chosen fix fails. A **Twin** attacks the first attack's framing.
- **Two ladders**: instruction precedence (repo docs → OS → chat → receipt → prior chats) is not evidence authority (runtime → deploy → branch@SHA → artifact → receipt → docs → chat → inference).
- **80/20**: prioritize the few changes that carry most of the value. Name recorded (2026-10-18). Source skill (`prioritize/80-20` in the founder-control-room skill suite) is not imported here: gap.
- **Hormozi**: offer and value-framing lens. Named as a strategic lens in memory (2026-10-18). Source skill (`delivery/hormozi`) is not imported here: gap.
- **lindymode**: the Lindy lens applied as a mode. Used in the `/goalfix` operating stack.
- **proofmode**: an evidence-plane mode, listed with truth and confess. Founder-control-room docs say it "changes evidence/uncertainty discipline only" (grep of `.md` files in founder-control-room, 2026-10-18). Its link to a required status check is a separate governance question and does not grant authority. A full definition is still UNKNOWN until the founder confirms it.
- **Mode and lens set (asked to remember, 2026-10-18)**: 80/20, OODA, Redteam, lindymode, proofmode, truthmode, confess, hormozi, plus garyvee, futureyou, steal, goal+loop, btw, Gates, Musk. Only the entries above with a stated definition are rules; the rest are names until imported.

## 3. Reasoning stack and depth

From `runtime-kernel` (verbatim idea, restated):

- **Light**: reversible, local, no prod, money, or user data. Socrates → goalfix → cheapest proof.
- **Standard**: touches deploy, auth, data, or a shared surface. Add MoSCoW, Redteam I, L99, OODA.
- **Full**: irreversible, public, money, minors' data, or an attribution dispute. Every layer, both Twins, independent verifier.

State the chosen depth and why in one line before starting.

Class separation (do not blend): Router (ULTRATHINK) · Reasoning (Socrates, 80/20, MoSCoW, Redteam, Lindy) · Governance (L99, DECLARE→…→DECIDE) · Loop (OODA, goalfix) · Instruments (Python, JS/TS, Playwright) · Truth (runtime readback). Reasoning suggests truth; instruments inspect it; runtime exposes it; governance authorizes. None substitutes for another.

## 4. Attribution invariant

Forensic WHO stays **UNKNOWN** until attribution evidence proves identity and action. An inventory of who *could* have acted is not an answer to who *did*. Attribution and authority are separate axes: an actor can be PROVEN as the executor while its authority is UNAUTHORIZED.

## 5. Council roles (process, not personal)

From the recorded council governance (2026-10-03):

- Founder = acceptance authority. Only the founder issues FOUNDER ACCEPT.
- Orchestrator (ChatGPT) = cross-model reconciler. Its output is input, not authority.
- Claude = canonical OS writer for the current phase only (phase-specific, not permanent).
- Muse = formal reviewer. DeepSeek = logic challenger. Perplexity = research challenger. Gemini = role unconfirmed.
- Every move declares PHASE / WRITE OWNER / REPO / BRANCH / TASK up front.

## 6. Activation plan (recorded 2026-10-06)

- **Path A, active invocation**: every repo task starts with goalfix or ULTRATHINK; every decision passes an authority and evidence check; every claim passes a freshness audit; every publish or deploy passes a safety gate; every project shift invokes the full reasoning stack. Success metric recorded: more than 80% of repo changes invoke an applicable skill, under 10% rollback.
- **Path B, export**: core skills packaged for persistent use across sessions.
- **Path C, decouple for council**: strip project-specific references and make each skill identical across models.
- Prerequisite recorded: audit each target repo's governance state (agent docs, skills folder, CI gates, authority docs) before porting the template.

## 7. Skill inventory and status

| Skill | Where | Status |
|---|---|---|
| juss-os | `.claude/skills/juss-os/` | In repo; canonical; v3.1.1 metadata |
| reasoning-stack | `.claude/skills/reasoning-stack/` | In repo |
| truthmode | `.claude/skills/truthmode/` | In repo |
| confess | `.claude/skills/confess/` | In repo |
| juss-af-skills-pack | `.claude/skills/juss-af-skills-pack/` | In repo |
| goalfix | `.claude/skills/goalfix/` | Imported this branch, verbatim from the founder's text |
| godmode | `.claude/skills/godmode/` | Imported this branch, verbatim |
| runtime-kernel | `.claude/skills/runtime-kernel/` | Imported this branch, verbatim. **Gap:** it references `scripts/check_receipt.py` and `references/receipt-schema.md`, which are not in the source. Do not claim receipt checking until those are supplied. |
| patch-implant-verify | `.claude/skills/patch-implant-verify/` | Imported this branch, verbatim |
| founder-action-implant-verify | `.claude/skills/founder-action-implant-verify/` | Imported this branch, verbatim |
| ultrathink (entry) | `.claude/skills/ultrathink/` | Imported 2026-10-18 verbatim from founder-control-room `.claude/skills/ultrathink/SKILL.md` (sha256 `1e80c8c088d1`). Claude Code entrypoint; it points to `ultrathink-devil`. |
| ultrathink-devil (canonical body) | `.claude/skills/ultrathink-devil/` | Imported 2026-10-18 verbatim from founder-control-room `.ai/skills/ultrathink-devil/SKILL.md` (`800d6be2525c`). Identical to founder-control-room `skills/ultrathink-devil/SKILL.md`. |
| l99-v21-transactional-authority | `.claude/skills/l99-v21-transactional-authority/` | Imported 2026-10-18 verbatim from founder-control-room `.agents/skills/l99-v21-transactional-authority/SKILL.md` (`c8ab5e6c1e17`). Matches the claude.ai v2.1.0 record on frontmatter, 18 checklist items, and 12 output sections. **Risk:** top-level `version`/`owner`/`status` keys are not valid for claude.ai skill upload (principles memory). Not CI-validated here. |
| sauce-guard | `.claude/skills/sauce-guard/` | Imported 2026-10-18 verbatim from founder-control-room `.agents/skills/sauce-guard/SKILL.md` (`9abea7529ca3`). |
| truth-decay | `.claude/skills/truth-decay/` | Imported 2026-10-18 verbatim from founder-control-room `.agents/skills/truth-decay/SKILL.md` (`9e40366fd1e6`). **Gap:** sibling `truth-decay-audit` (founder-control-room `.ai/skills/`, `10ed87bb4f59`) is not reconciled with it. |
| model-spend-discipline | `.claude/skills/model-spend-discipline/` | Hand-transcribed 2026-10-18 from the claude.ai chat record (conversation f3344382, the Write call). **Not byte-verified.** Contains an Anthropic adapter section; the skill's own "Never" rule says adapters belong in code. Flagged, not edited. |
| juss-founder-os | `.claude/skills/juss-founder-os/` | Imported 2026-10-18 verbatim from founder-control-room `.ai/skills/juss-founder-os/SKILL.md` (`f4f0fbabe22a`, 432 lines). **Not the same text** as founderOS (archived below). |
| founderOS (10-phase, 2026-08-18) | `docs/skills-archive/founderOS-2026-08-18/` | Archived. Hand-transcribed from the claude.ai chat record (conversation d5c6b68d). Superseded status is UNKNOWN; the founder decides which founderOS is canonical. |
| /l99 router contract | `docs/skills-archive/capability-mode-router/` | Archived byte-exact copy of founder-control-room `.ai-skills/gpts/capability-mode-router.md` (`2717754737e3`). The live source is founder-control-room. |
| repo-audit-fix-loop | not in repo | **Gap:** no body found in the repo, in claude.ai search, or in memory. Do not reconstruct it. |
| truth-decay-audit | not in repo | **Gap:** sibling in founder-control-room `.ai/skills/`. Reconciliation with `truth-decay` needed. |

Rule for closing a gap: import the skill's own SKILL.md verbatim, add it to this table with its status, and never reconstruct a skill body from a one-line summary.

## 8. Lessons (growth log, process-level, evidence-bound)

Each lesson is written as a rule. Add new lessons with a date and an evidence pointer; never delete an entry without a recorded reason.

1. **Escape sequences from generated text.** A templated writer produced a literal backslash-n where a newline belonged, and the bug recurred across several repos. Rule: when generating code or receipts, check bytes, not appearance.
2. **Direct-to-main commits skip the gate.** Several defects landed on main without a PR or CI run. Rule: branch, PR, head-pinned approval; never merge without the exact head approved.
3. **Live is not main.** A hosted build pipeline deployed non-main branches, so production ran code that main did not contain. Rule: verify the deployed build SHA against main, and lock production deploys to main.
4. **Cheap fingerprints before expensive reads.** Comparing repo heads (`git ls-remote --heads` hashed) detects movement without cloning. Rule: fingerprint first; spend context only on what moved.
5. **A passing workflow proves only its declared scope.** A green check on a skill's validator says nothing about deployment or runtime. Rule: state the scope of every green.
6. **Two-cause failures.** A red check can hide two causes. Rule: fix one cause, re-run, then read the next.
7. **Same-context verification is not independent.** A reviewer that shares the author's reasoning is not a twin. Rule: the Redteam Twin runs in a fresh context that sees the claim and evidence, not the earlier reasoning.
8. **A name match is not identity.** 2026-10-18: a 364-line claude.ai `founderOS` (2026-08-18) and a 432-line repo `juss-founder-os` share a purpose but not text; the repo copy has no PHASE headings. Rule: match skills by content or hash, never by name. Keep both and let the founder decide which is canonical. Evidence: `docs/skills-archive/README.md`; repo sha256 `f4f0fbabe22a`.
9. **Prefer the disk file to the transcript.** 2026-10-18: the repo copy of `l99-v21` (`c8ab5e6c1e17`) matched the claude.ai transcript record on frontmatter and counts. A transcript-sourced copy is labeled hand-transcribed and not byte-verified. Rule: every imported skill records its source path and a sha256 prefix.

## 9. Efficiency, accuracy, speed, growth, knowledge (project and OS)

Each pillar maps to a mechanism that can be checked, not a slogan:

- **Efficiency**: one pre-flight, one action, one verification; narrow reads first; stop at the first failed gate. OS: rules in juss-os. Project: the repo's own agent docs.
- **Accuracy**: every claim carries a label; a green check is stated with its scope; a value is never its own evidence. OS: the evidence ladder. Project: real-path proof for UI and runtime changes.
- **Speed**: fingerprint before reading; reach a lead once before spending on it; name dead ends instead of looping. OS: reachability gate. Project: one-cause patches.
- **Growth**: each confirmed defect becomes a rule in section 8 with evidence. OS: confess and truthmode feed corrections back. Project: retro entries in the project's own docs.
- **Knowledge**: this file plus the repo's own docs are the shared memory. An agent reads the target repo's docs before acting and never asks the founder to restate them. OS: the two ladders decide which source wins.

## 10. What this file does not do

- It does not change the law. Changes to `os.md` need the founder's approval on an exact version.
- It does not record project state. Project state lives in each project's repo docs.
- It does not grant authority. Nothing here merges, deploys, or publishes anything.
