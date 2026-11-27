import copy
import unittest
from validate_packet import CHECKS, validate


class CinematicPacketTests(unittest.TestCase):
    def setUp(self):
        head = "a" * 40
        self.packet = {
            "product": "Test Product",
            "repository": "owner/test",
            "branch": "feature/test",
            "exact_head": head,
            "scene_thesis": "Single accessible story scene",
            "approved_reference": {
                "reference_id": "approved-source-local",
                "approval_evidence_ref": "approval-receipt-local",
            },
            "routes": [{
                "route_or_screen": "/",
                "states_covered": ["home", "loading", "error"],
                "captures": [
                    {"evidence_ref": "capture-desktop", "exact_head": head, "viewport": "desktop"},
                    {"evidence_ref": "capture-mobile", "exact_head": head, "viewport": "mobile"},
                ],
                "checks": {name: {"status": "PASS", "evidence_ref": name + "-proof"} for name in CHECKS},
            }],
        }

    def test_complete_packet_only_requires_independent_review(self):
        status, errors = validate(self.packet)
        self.assertEqual((status, errors), ("REVIEW_REQUIRED", []))

    def test_missing_proof_blocks(self):
        packet = copy.deepcopy(self.packet)
        packet["routes"][0]["checks"]["brand_fidelity"].pop("evidence_ref")
        status, errors = validate(packet)
        self.assertEqual(status, "BLOCKED")
        self.assertIn("routes[0].checks.brand_fidelity.evidence_ref: required for PASS", errors)

    def test_mismatched_capture_head_blocks(self):
        packet = copy.deepcopy(self.packet)
        packet["routes"][0]["captures"][0]["exact_head"] = "b" * 40
        status, errors = validate(packet)
        self.assertEqual(status, "BLOCKED")
        self.assertTrue(any("does not match" in err for err in errors))

    def test_mobile_capture_missing_blocks(self):
        packet = copy.deepcopy(self.packet)
        packet["routes"][0]["captures"].pop()
        status, errors = validate(packet)
        self.assertEqual(status, "BLOCKED")
        self.assertTrue(any("desktop and mobile" in err for err in errors))

    def test_unknown_check_is_not_pass(self):
        packet = copy.deepcopy(self.packet)
        packet["routes"][0]["checks"]["keyboard"]["status"] = "UNKNOWN"
        self.assertEqual(validate(packet)[0], "BLOCKED")

    def test_empty_and_malformed_packets_block(self):
        self.assertEqual(validate({})[0], "BLOCKED")
        self.assertEqual(validate(None)[0], "BLOCKED")
        packet = copy.deepcopy(self.packet)
        packet["exact_head"] = "deadbeef"
        self.assertEqual(validate(packet)[0], "BLOCKED")


if __name__ == "__main__":
    unittest.main()
