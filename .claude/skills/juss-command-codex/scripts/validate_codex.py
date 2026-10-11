"""Contract check for the Juss Command Codex.

Usage: python3 validate_codex.py [path/to/SKILL.md]
Exits non-zero with the first violation. Pure stdlib, no network.
"""
import re
import sys
from pathlib import Path

DEFAULT = Path(__file__).resolve().parent.parent / "SKILL.md"
FIELDS = ("INTENT:", "INPUT:", "METHOD:", "OUTPUT:", "GATE:", "REDTEAM:", "PASS IF:")
BOUNDARY = (
    "This codex is a subordinate command module under `juss-os`.",
    "Before running it inside a Juss repository, load `../juss-os/SKILL.md` and `../juss-os/references/os.md`.",
    "It cannot override `juss-os` authority, phase, evidence, state, receipt, merge/deploy, or verification gates.",
)
CLOSING = ("TRUTH CHECK:", "RISK:", "NEXT GATE:")
STATUSES = {"draft-first-party"}
EVIDENCE_STATES = ("VERIFIED", "INFERRED", "PARTIAL", "UNKNOWN", "BLOCKED", "STALE", "DISPROVEN")


def fail(msg: str) -> None:
    raise SystemExit(f"codex contract FAIL: {msg}")


def main(path: Path) -> None:
    if not path.is_file():
        fail(f"missing {path}")
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        fail("frontmatter must begin with ---")
    try:
        end = lines.index("---", 1)
    except ValueError:
        fail("frontmatter must end with ---")
    front = lines[1:end]

    def scalar(key: str) -> str:
        for line in front:
            if line.startswith(f"{key}:"):
                value = line[len(key) + 1:].strip()
                if not value:
                    fail(f"empty frontmatter key: {key}")
                return value
        fail(f"missing frontmatter key: {key}")

    if scalar("name") != "juss-command-codex":
        fail("unexpected name")
    if scalar("status") not in STATUSES:
        fail(f"status must be one of {sorted(STATUSES)}")
    scalar("version")
    scalar("owner")

    try:
        start = front.index("triggers:") + 1
    except ValueError:
        fail("missing triggers block")
    triggers = []
    for line in front[start:]:
        if line.startswith("  - "):
            triggers.append(line[4:].strip())
        elif line.strip():
            break
    if any(trigger.lstrip("/").casefold() == "ultrathink" for trigger in triggers):
        fail("generic ULTRATHINK must stay kernel-owned")
    if len(triggers) != len(set(triggers)):
        fail("duplicate trigger")

    for statement in BOUNDARY:
        if statement not in text:
            fail(f"missing kernel boundary: {statement}")
    for relative in ("../juss-os/SKILL.md", "../juss-os/references/os.md"):
        if not (path.parent / relative).is_file():
            fail(f"missing required kernel file: {relative}")
    for state in EVIDENCE_STATES:
        if f"`[{state}]`" not in text:
            fail(f"missing kernel evidence state: {state}")
    for marker in CLOSING:
        if marker not in text:
            fail(f"global law missing closing block marker: {marker}")

    body = re.sub(r"^```[^\n]*\n.*?^```\s*$", "", "\n".join(lines[end + 1:]), flags=re.M | re.S)
    sections = re.split(r"^### (/\S+)\s*$", body, flags=re.M)
    # sections = [pre, name1, body1, name2, body2, ...]; skip the template block (fenced)
    commands = {}
    for name, chunk in zip(sections[1::2], sections[2::2]):
        if name == "/<name>":
            continue
        if name in commands:
            fail(f"duplicate command section: {name}")
        commands[name] = chunk.split("\n## ", 1)[0]
    if set(commands) != set(triggers):
        fail(f"triggers {sorted(triggers)} != command sections {sorted(commands)}")
    for name, chunk in commands.items():
        fields = list(re.finditer(r"^\*\*(INTENT:|INPUT:|METHOD:|OUTPUT:|GATE:|REDTEAM:|PASS IF:)\*\*", chunk, re.M))
        observed = [match.group(1) for match in fields]
        for field in FIELDS:
            if field not in observed:
                fail(f"{name} missing {field}")
            if observed.count(field) != 1:
                fail(f"{name} duplicate {field}")
        for index, match in enumerate(fields):
            stop = fields[index + 1].start() if index + 1 < len(fields) else len(chunk)
            if not chunk[match.end():stop].strip().strip("- "):
                fail(f"{name} empty {match.group(1)}")

    print(f"Juss Command Codex contract: PASS ({len(commands)} commands)")


if __name__ == "__main__":
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT)
