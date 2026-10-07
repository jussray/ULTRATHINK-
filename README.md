# ULTRATHINK

Evidence-first operating system for Juss-owned agent work.

This repository is the first-party export home for reusable Juss operating skills. Repository export status and formal kernel canonicalization are separate facts; the current acceptance record remains authoritative for that distinction.

## Start here

1. Load `.claude/skills/juss-os/SKILL.md` first for authority, evidence, lifecycle, rollback, receipt, merge/deploy, and verification gates.
2. Read `.claude/skills/juss-os/references/os.md`, `runtime-first-class.md`, and `acceptance.md` for the inherited law, runtime-attribution boundary, and acceptance state.
3. Read the target repository's own `CLAUDE.md`, `AGENTS.md`, and `.claude/` instructions. Stricter project rules win.
4. Load specialized skills only when their bounded job applies.
5. Never inherit verification, runtime attribution, or authority from another repository, project, model, receipt, or environment.

## What is implemented

### `juss-os`

Path: `.claude/skills/juss-os/`

Law/runtime-governance kernel for agent work across Juss-owned repositories and the AI council. Current metadata is `v3.1.1` with status `MERGE-APPROVED EXPORT; CANONICALIZATION UNKNOWN pending exact FOUNDER ACCEPT`.

### `/truthmode`

Path: `.claude/skills/truthmode/`

First-class evidence verifier for atomic claims, contradictions, drift, and Runtime First-Class attribution. It preserves exact request/response evidence, identifies the last proven receiver and first unproven forward transition, and keeps forensic **WHO = UNKNOWN** until the producing actor is directly proven.

### `/confess`

Path: `.claude/skills/confess/`

First-class agent self-audit for assumptions, inherited claims, attempts, failures, blockers, contradictions, and lifecycle overclaim. It compares what was claimed with the highest state actually proven.

### `reasoning-stack`

Path: `.claude/skills/reasoning-stack/`

Decision lenses behind ULTRATHINK: OODA, Socratic falsification, MoSCoW, 80/20, Lindy twin, Redteam twin, L99, 5W1H, and language/runtime discipline. These are activated when they can change the next action, not run ceremonially.

### `juss-af-skills-pack`

Path: `.claude/skills/juss-af-skills-pack/`

First-party creative-production module for Juss-owned products and campaigns. It runs **under `juss-os`** and cannot override kernel authority, phase, evidence, state, receipt, merge/deploy, or verification gates.

Bounded creative triggers:

- `/afvideo`
- `/makevideo` and `/MAKEVIDEO`
- `/makeimage` and `/MAKEIMAGE`
- `/advertise`
- `/campaign`

Generic `ULTRATHINK` remains kernel-owned and does not directly trigger the creative module.

### `juss-command-codex`

Path: `.claude/skills/juss-command-codex/`

Portable governed slash-command library (v0.1.0, `draft-first-party`). Twelve commands — `/swot`, `/businessmodel`, `/landingpage`, `/userstory`, `/bugreport`, `/changelog`, `/coldemail`, `/casestudy`, `/database`, `/architecture`, `/security`, `/codereview` — each a spec with intent, input, method, output contract, gate, redteam, and pass-if tests. It runs under `juss-os` inside repositories and stands alone as plain markdown on any council model. `scripts/validate_codex.py` enforces the contract in CI.

## Runtime attribution rule

For runtime outcomes, preserve the exact request and exact observed response as immutable evidence. Diagnose the **last execution boundary proven to have received the request** and the **first forward transition that cannot be proven**. Do not attribute the result to a provider, proxy, worker, origin, model, or other actor from status codes, branding, message text, or provider-looking error wording alone.

Prospective authority and forensic attribution stay separate. An executor may be proven while authority remains `UNAUTHORIZED` or `UNKNOWN`.

## Run

```bash
cd .claude/skills/juss-os/scripts
python -m unittest -v test_modes.py
python .claude/skills/juss-os/scripts/ultrathink.py truthmode --input /path/to/truth.json
python .claude/skills/juss-os/scripts/ultrathink.py confess --input /path/to/confess.json
```

Both mode CLIs return JSON and non-zero exit codes when evidence is unresolved or lifecycle overclaim is detected, so they can gate CI/agent workflows.

Receipt-chain verification:

```bash
python3 .claude/skills/juss-os/scripts/receipts_check.py <receipts-dir> --head <SHA> --evidence-root <dir>
```

Only checker exit `0` counts as verified continuity.

## Verification

Two GitHub Actions workflows currently protect skill behavior:

- `.github/workflows/ultrathink-conformance.yml` compiles the mode scripts and runs the Python conformance tests when ULTRATHINK skill/runtime files change.
- `.github/workflows/validate-skills.yml` validates the Juss AF integration contract, including skill identity/status, the exact creative trigger set, exclusion of generic `ULTRATHINK`, the required `juss-os` boundary, and required kernel/law files.

A passing workflow proves only its declared scope. It does not prove deployment, runtime behavior, or another project's state.

## Status semantics

PR #1's merge was founder-approved. That is distinct from the kernel's explicit `FOUNDER ACCEPT` / `CANONICALIZE` act. See `.claude/skills/juss-os/references/acceptance.md`; canonicalization remains **UNKNOWN** until explicitly recorded for an exact version/SHA.

## Operating principle

```text
Reach the authority. Establish the baseline. Find one cause. Make one reversible change.
Prove the real path. Write the receipt. Stop at the next gate.
```

Repo home is not runtime proof. A skill file is not deployment proof. A receipt is not authority. A merge is not outcome verification.
