# Codex — agent doc for the ULTRATHINK repo

Codex is designed to read `AGENTS.md` at the repo root. Read that file first; it carries the law summary, hard rules, skill table, and five mandates. This doc adds only what is specific to running Codex on this repo. Whether your Codex build reads `AGENTS.md` automatically is UNKNOWN until you confirm it in a session.

## Load order

1. `AGENTS.md` (root)
2. `.claude/skills/juss-os/references/os.md` (the law; it wins)
3. `docs/ULTRATHINK_KNOWLEDGE.md` (lineage, skill inventory, lessons)
4. The skill for the job (see the table in `AGENTS.md`)

## Run the repo's own checks (verified in this session)

These are the same checks CI runs (`.github/workflows/ultrathink-conformance.yml`):

```
python3 -m compileall -q .claude/skills/juss-os/scripts
cd .claude/skills/juss-os/scripts && python3 -m unittest -v test_modes.py test_evidence_ledger.py
```

Result on the branch that added this doc: compile OK; 27 tests OK. Run them again before any report that cites them.

The skill-contract check for `juss-af-skills-pack` (`.github/workflows/validate-skills.yml`) is a Python snippet inside that workflow. Run it by copying the snippet, not by inventing a command.

## Codex-specific limits

- **Playwright:** UI or runtime changes need real-path proof. If Playwright is not available in the sandbox, mark the change UNVERIFIED. Do not call it done.
- **Network:** if the sandbox blocks a host, mark the dependent check BLOCKED. Do not substitute mocked results.
- **Git:** work on a branch, commit with the attribution the founder's repo rules require, and stop before merge. Open the PR only when asked.
- **Sandbox writes:** write only inside the repo working tree.

## How this doc lifts the five pillars

- **Efficiency:** Codex runs one pre-flight (`git status`, branch, HEAD), one action, then the checks above. It stops at the first failing gate.
- **Accuracy:** each report line names the command and its output. A green check is stated with its scope, for example "27 unit tests, conformance only; no Playwright".
- **Speed:** Codex fingerprints the repo before reading (`git rev-parse HEAD`, branch) and names dead ends instead of retrying them.
- **Growth:** a defect Codex confirms becomes a dated entry in section 8 of `docs/ULTRATHINK_KNOWLEDGE.md`, with the command that showed it. Codex proposes the entry; the founder accepts it through a reviewed PR.
- **Knowledge:** Codex reads the target repo's docs and the skill inventory before acting. A gap in section 7 is reported, not built around.

## Report

Return only: REALITY, FIX, PROOF, RISK, ROLLBACK, NEXT GATE. NEXT GATE is one exact founder decision.
