"""Exercise the validator's rejection boundary using isolated skill trees."""
import contextlib
import importlib.util
import io
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().with_name("validate_codex.py")
spec = importlib.util.spec_from_file_location("validate_codex", SCRIPT)
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)
SOURCE = SCRIPT.parent.parent / "SKILL.md"


class CodexContractTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.skill = Path(self.temp.name) / ".claude/skills/juss-command-codex/SKILL.md"
        self.skill.parent.mkdir(parents=True)
        self.text = SOURCE.read_text(encoding="utf-8")
        self.skill.write_text(self.text, encoding="utf-8")
        for relative in ("../juss-os/SKILL.md", "../juss-os/references/os.md"):
            target = self.skill.parent / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text((SOURCE.parent / relative).read_text(encoding="utf-8"), encoding="utf-8")

    def reject(self, text, message):
        self.skill.write_text(text, encoding="utf-8")
        with self.assertRaisesRegex(SystemExit, message):
            validator.main(self.skill)

    def test_complete_skill_passes(self):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            validator.main(self.skill)
        self.assertIn("PASS (14 commands)", output.getvalue())

    def test_canonical_status_cannot_be_inferred(self):
        self.reject(self.text.replace("status: draft-first-party", "status: canonical-first-party"), "status must")

    def test_required_kernel_files_are_real(self):
        for relative in ("../juss-os/SKILL.md", "../juss-os/references/os.md"):
            with self.subTest(relative=relative):
                target = self.skill.parent / relative
                content = target.read_text(encoding="utf-8")
                target.unlink()
                self.reject(self.text, "missing required kernel file")
                target.write_text(content, encoding="utf-8")

    def test_kernel_trigger_aliases_are_rejected(self):
        for trigger in ("ULTRATHINK", "/ULTRATHINK", "/ultrathink"):
            with self.subTest(trigger=trigger):
                self.reject(self.text.replace("triggers:\n", f"triggers:\n  - {trigger}\n"), "kernel-owned")

    def test_duplicate_command_is_rejected(self):
        command = self.text.split("### /swot\n", 1)[1].split("### /businessmodel", 1)[0]
        self.reject(self.text + "\n### /swot\n" + command, "duplicate command section")

    def test_empty_required_field_is_rejected(self):
        command, remaining = self.text.split("### /security\n", 1)
        current, rest = remaining.split("### /codereview\n", 1)
        for field in validator.FIELDS:
            with self.subTest(field=field):
                import re
                empty = re.sub(
                    rf"(\*\*{re.escape(field)}\*\*)[^\n]*(?:\n(?!\*\*).*)*",
                    r"\1\n",
                    current,
                )
                self.reject(command + "### /security\n" + empty + "### /codereview\n" + rest, "empty " + field)

    def test_missing_required_field_is_rejected(self):
        self.reject(self.text.replace("**REDTEAM:**", "**ATTACK:**", 1), "missing REDTEAM")

    def test_duplicate_required_field_is_rejected(self):
        self.reject(self.text.replace("**OUTPUT:** Quadrants", "**INTENT:** duplicate\n**OUTPUT:** Quadrants", 1), "duplicate INTENT")

    def test_empty_identity_is_rejected(self):
        self.reject(self.text.replace("owner: Juss", "owner:"), "empty frontmatter key")

    def test_kernel_evidence_states_cannot_be_removed(self):
        self.reject(self.text.replace("`[STALE]`", "`[OLD]`"), "missing kernel evidence state: STALE")


if __name__ == "__main__":
    unittest.main(verbosity=2)
