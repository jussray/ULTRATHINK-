# ULTRATHINK

Evidence-first operating system for Juss-owned agent work.

## What is implemented

- `juss-os`: authority, evidence, lifecycle gates, rollback, receipts, real-path proof
- `/truthmode`: first-class claim verifier, contradiction/drift detection, Runtime First-Class boundary attribution
- `/confess`: first-class agent self-audit for assumptions, inherited claims, failures, blockers, and lifecycle overclaim
- `reasoning-stack`: OODA, Socratic falsification, MoSCoW, 80/20, Lindy twin, Redteam twin, L99, and 5W1H
- stdlib-only Python mode dispatcher and conformance tests
- GitHub Actions conformance workflow

## Run

```bash
cd .claude/skills/juss-os/scripts
python -m unittest -v test_modes.py
python ultrathink.py truthmode --input /path/to/truth.json
python ultrathink.py confess --input /path/to/confess.json
```

Both mode CLIs return JSON and non-zero exit codes when evidence is unresolved or overclaim is detected, so they can gate CI/agent workflows.

## Status semantics

PR #1's merge was founder-approved. That is distinct from the v3 kernel's explicit `FOUNDER ACCEPT` canonicalization token. See `.claude/skills/juss-os/references/acceptance.md`; canonicalization remains UNKNOWN until explicitly recorded for an exact version/SHA.
