# AGENTS.md: ULTRATHINK entry contract

Applies to every agent working in this repository, on any runtime: Claude Code, Cowork, Claude chat, ChatGPT, Muse, DeepSeek and Perplexity.

## Read order
1. This file. Claude Code also reads `CLAUDE.md`, which adds only Claude Code specifics.
2. `.claude/skills/juss-os/SKILL.md`, then `references/os.md`, `runtime-first-class.md` and `acceptance.md`.
3. The target repository's own agent docs (`CLAUDE.md`, `AGENTS.md`, `.claude/`). Stricter rules win.
4. Only the specialized skill whose job applies.

Never ask the founder to restate any of these files.

## Skills in this repository

| Skill | Trigger(s) | Owns | Status |
| --- | --- | --- | --- |
| `juss-os` | none (kernel) | authority, evidence, gates, receipts | on main |
| `futureyou-me-v10` | `/futureyou`, `/intent`, `/handoff` | intake, routing, 5W1H, Attack Ten taxonomy, handoff receipt, approval scope | open draft PR #5, not on main |
| `godmode-devil-ultrathink` | `/godmode`, `/devil` | challenge, fix, verify, commit with evidence | on main (PR #7, merged 2026-10-22) |
| `juss-command-codex` | `/swot` to `/codereview`, `/attack`, `/5w1h` | named one-shot command specs | open PR #4, not on main |
| `confess`, `truthmode`, `reasoning-stack`, `juss-af-skills-pack` | see each file | self-audit, evidence, decision lenses, creative module | on main |

Bare `ULTRATHINK` is kernel-owned. No skill other than `juss-os` claims it.

## Approvals
Read the Resuming section of `futureyou-me-v10` before any push, PR, merge, deploy or publish. Approval scope is defined there, not here.

## Runtime adapters

| Runtime | How a skill is loaded | Shell, git and network | Proof an agent may claim |
| --- | --- | --- | --- |
| Claude Code | Skills under `.claude/skills/` are read when the repository is open. Confirm per session. | Shell, git and `gh` in a repository session | local command output, CI and PR readback |
| Cowork | Add the `SKILL.md` to the Cowork skill library. Loading mechanics UNKNOWN in this session; confirm in the product. | Unknown per session. Check before claiming a command ran. | only what the session actually ran; otherwise UNVERIFIED |
| Claude chat | Attach the `SKILL.md` to a project, or paste it as the project instruction | none by default | reply text only |
| ChatGPT | Paste as custom instructions, or attach as a knowledge file | code execution only where enabled | reply text; command output only where actually run |
| Muse, DeepSeek, Perplexity | Paste as the system or project instruction | Unknown. Check before claiming. | reply text only |

## Runtime rules (every runtime)
1. If a tool a step needs is absent, say so and mark the proof UNVERIFIED or BLOCKED. Never write "passing".
2. Write receipts where the runtime can write them. Where it cannot, put the receipt in the reply and mark it NOT PERSISTED.
3. A refused push produces the patch in the reply, marked PUSH BLOCKED.
4. Keep one installed copy of each skill per runtime. A copy that disagrees with the repository is stale, and the repository wins.

## Keeping this file true
- A skill's status becomes "on main" only after its PR merges, and that merge must be approved on the exact PR and head.
- Re-check every status against GitHub before editing this table.
