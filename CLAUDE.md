# CLAUDE.md: Claude Code entry

Read `AGENTS.md` first. This file adds only what Claude Code needs. Other runtimes use `AGENTS.md`.

## Claude Code specifics
- Skills under `.claude/skills/` are read when this repository is open in a Claude Code session. Confirm per session.
- Run the codex contract the same way CI does:
  - `python3 -I .claude/skills/juss-command-codex/scripts/validate_codex.py`
  - `python3 -I .claude/skills/juss-command-codex/scripts/test_validate_codex.py`
- Run the conformance checks the same way CI does: `python -m compileall -q .claude/skills/juss-os/scripts`, then from `.claude/skills/juss-os/scripts` run `python -m unittest -v test_modes.py test_evidence_ledger.py`.
- Read PRs with `gh api repos/jussray/ULTRATHINK-/pulls` and check runs with `gh api repos/jussray/ULTRATHINK-/commits/<sha>/check-runs`. Some sessions block the GraphQL-backed `gh pr` commands, so use the REST paths.
- Use a per-branch `git push --force-with-lease=<branch>:<sha>` pinned to the exact previous head. Fetch the branch after each push so local tracking matches.
