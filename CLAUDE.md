# CLAUDE.md — instructions for Claude (Claude Code and Claude chat)

Claude Code loads this file automatically at the repo root. Claude chat and the Claude app do not read repo files; they load the skills in `.claude/skills/` through skill installation, so this file is also the instruction set to paste into a Claude project if you use one.

## Load order (do this before any task)

1. `.claude/skills/juss-os/SKILL.md` (authority, phase seams, evidence, gates, report format)
2. `.claude/skills/juss-os/references/os.md` (the law; it wins over every other document here)
3. The target project's own agent docs (`CLAUDE.md`, `AGENTS.md`, `.claude/`). Project rules win over this file unless os.md is stricter.
4. `docs/ULTRATHINK_KNOWLEDGE.md` (lineage, vocabulary, skill inventory, lessons)
5. The specific skill for the job (table in `AGENTS.md`): `/goalfix`, `/godmode`, `/confess`, `/truthmode`, `ultrathink` (entry) → `ultrathink-devil`, `runtime-kernel`, `patch-implant-verify`, `founder-action-implant-verify`, `l99-v21-transactional-authority`, `sauce-guard`, `truth-decay`, `model-spend-discipline`, `juss-founder-os`, or `juss-af-skills-pack` for creative work.

Other agents read `AGENTS.md` (agent-neutral) and `docs/agents/` (ChatGPT, Codex, Claude chat). This file stays the Claude Code entry point.

Never ask the founder to restate what a repo document already says.

## Hard rules (from os.md; restated so they cannot be missed)

- Work on branches. Push and open PRs; never merge without the founder's approval of the exact PR and head SHA.
- No merge, deploy, publish, spend, delete, credential change, or migration without an explicit founder decision on record.
- No secrets, tokens, or credentials in code, logs, receipts, or commits. A proof cookie is an evidence marker, never a credential.
- One write owner per repo, branch, and task.
- Every receipt binds a fingerprint (repo + branch + head + subject + evidence + runtime-state marker) and a proof cookie.
- Report in this order: REALITY, FIX, PROOF, RISK, ROLLBACK, NEXT GATE.

## The five mandates

### Efficiency
- **Project:** open each task with the budget block: authoritative repo, target branch, goal, suspected failure area, first files or logs needed, stop condition. Read narrowly first.
- **OS:** one pre-flight, one action, one verification. Stop at the first failed gate. Two meaningful attempts per hypothesis, then BLOCKED (os.md, Hypotheses).
- **Checkable:** the task starts with the budget block. Broad reads without it are a defect.

### Accuracy
- **Project:** label every finding VERIFIED, INFERRED, UNKNOWN, or BLOCKED. State each green check with its scope. Real-path proof (Playwright for UI and runtime changes) before anything is called done.
- **OS:** a value is never its own evidence. Instruction precedence and evidence authority are separate ladders (os.md, Two ladders). No claim goes above its evidence (`/truthmode`).
- **Checkable:** each report line names the command, log, trace, or URL behind it.

### Speed
- **Project:** fingerprint the repo first (heads hash, PR state). If nothing moved, spend no further context. Patch one cause per turn.
- **OS:** reach a lead once before spending on it. Name a dead end as `DEAD END: <path> — <why>` and move on. Surface remaining context early instead of burning it silently.
- **Checkable:** dead ends are named, never retried in a loop.

### Growth
- **Project:** every confirmed defect gets a rule. Write it to the project's docs, or to section 8 of `docs/ULTRATHINK_KNOWLEDGE.md`, with a date and an evidence pointer.
- **OS:** a lesson changes the law only through a reviewed PR and the founder's acceptance. Never edit os.md silently.
- **Checkable:** every new rule has a date and evidence. A rule without evidence is a guess and does not get written down.

### Knowledge
- **Project:** read the project's docs and this repo's knowledge file before acting. Never invent project history. Mark any gap UNKNOWN.
- **OS:** the skill inventory in `docs/ULTRATHINK_KNOWLEDGE.md` section 7 says which skills exist and which are gaps. Do not treat a gap as a skill.
- **Checkable:** gaps are listed, not papered over.

## Claude-specific notes

- Claude Code has file and shell tools. Use them for repo work, and run the repo's own checks (see README, "Run" and "Verification").
- Claude chat has no repo access unless files are attached or a repo is connected. Say what you could not read; do not infer its contents.
- The skills must stay AI-agnostic. Do not add Claude-only tool names, APIs, or assumptions into a shared skill. Put Claude-specific notes in this file, not in the skills.

## Triggers

`/goalfix`, `/fixfast`, `/repair-verify-merge`, `ULTRATHINK`, `/godmode`, `/confess`, `/truthmode`, `/loop`, `cont`, `approved`, `review`, `merge`. A trigger starts the skill; it never grants merge or deploy authority.
