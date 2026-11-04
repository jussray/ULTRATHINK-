"""Reject ambiguous or unaccounted receipt records before reporting OK."""
import pathlib
import tempfile
import unittest

import receipts_check

HEAD = "a" * 40


def valid_receipt(root):
    (root / "proof.txt").write_text("proof")
    digest = receipts_check.digest(root, ["proof.txt"])
    return (
        "RECEIPT-ID: r1\n"
        "PREDECESSOR: none\n"
        "SUCCESSOR: none\n"
        "CREATED-AT: 2026-11-03T12:00:00Z\n"
        f"AUTHORITY-DIGEST: jussray/example@{HEAD}\n"
        "EVIDENCE: proof.txt\n"
        f"EVIDENCE-DIGEST: {digest}\n"
    )


class ReceiptIntegrityTests(unittest.TestCase):
    def test_idless_markdown_cannot_be_ignored(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            (root / "r1.md").write_text(valid_receipt(root))
            (root / "untracked.md").write_text("AUTHORITY-DIGEST: bogus\n")
            code, _, _ = receipts_check.check(root, head=HEAD, eroot=root)
            self.assertEqual(code, 2)

    def test_duplicate_authority_field_cannot_be_ignored(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            (root / "r1.md").write_text(valid_receipt(root) + "AUTHORITY-DIGEST: jussray/example@" + "b" * 40 + "\n")
            code, _, _ = receipts_check.check(root, head=HEAD, eroot=root)
            self.assertEqual(code, 2)

    def test_unambiguous_receipt_still_passes(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            (root / "r1.md").write_text(valid_receipt(root))
            code, _, notes = receipts_check.check(root, head=HEAD, eroot=root)
            self.assertEqual(code, 0, notes)


if __name__ == "__main__":
    unittest.main()
