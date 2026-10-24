"""Dangling-reference checks for ULTRATHINK skill docs.

Run from .claude/skills/juss-os/scripts: python3 -m unittest -v test_skill_refs.py
"""
import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
SKILLS = REPO / ".claude" / "skills"
PATH_REF = re.compile(r"`([\w./<>-]+\.(?:md|py))`")
EXTERNAL = {"CLAUDE.md", "AGENTS.md"}  # target-repo files, resolved in each target repo


class SkillPathRefs(unittest.TestCase):
    def test_backticked_paths_resolve_from_skill_or_repo_root(self):
        broken = []
        for skill in sorted(SKILLS.glob("*/SKILL.md")):
            for ref in PATH_REF.findall(skill.read_text(encoding="utf-8")):
                if "<" in ref or ref in EXTERNAL:
                    continue
                if not ((skill.parent / ref).exists() or (REPO / ref).exists()):
                    broken.append(f"{skill.relative_to(REPO)}: {ref}")
        self.assertEqual([], broken)


if __name__ == "__main__":
    unittest.main()
