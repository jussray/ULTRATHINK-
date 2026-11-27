#!/usr/bin/env python3
"""Check structure of cinematic QA evidence; never certify visual quality.

A 0 exit means every required check supplied PASS plus an evidence reference.
Even then, output is REVIEW_REQUIRED because evidence references are not verified.
"""
import json
import re
import sys
from pathlib import Path

CHECKS = (
    "scene_coherence", "brand_fidelity", "cross_state_continuity",
    "interaction", "mobile", "keyboard", "reduced_motion",
    "contrast", "performance",
)
STATES = frozenset({"PASS", "FAIL", "UNKNOWN", "BLOCKED"})
SHA40 = re.compile(r"^[0-9a-fA-F]{40}$")


def _str(v):
    return isinstance(v, str) and bool(v.strip())


def validate(packet):
    """Return (status, opaque field-path errors), without exposing user data."""
    errors = []
    if not isinstance(packet, dict):
        return "BLOCKED", ["packet: expected JSON object"]
    for field in ("product", "repository", "branch", "scene_thesis"):
        if not _str(packet.get(field)):
            errors.append(f"{field}: required")
    head = packet.get("exact_head")
    if not _str(head) or SHA40.fullmatch(head) is None:
        errors.append("exact_head: full commit SHA required")
    brand = packet.get("approved_reference")
    if not isinstance(brand, dict) or not all(
        _str(brand.get(f)) for f in ("reference_id", "approval_evidence_ref")
    ):
        errors.append("approved_reference: reference_id and approval_evidence_ref required")
    routes = packet.get("routes")
    if not isinstance(routes, list) or not routes:
        return "BLOCKED", errors + ["routes: nonempty list required"]
    for idx, route in enumerate(routes):
        where = f"routes[{idx}]"
        if not isinstance(route, dict):
            errors.append(f"{where}: expected object")
            continue
        if not _str(route.get("route_or_screen")):
            errors.append(f"{where}.route_or_screen: required")
        if not isinstance(route.get("states_covered"), list) or not route["states_covered"] or not all(
            _str(s) for s in route["states_covered"]
        ):
            errors.append(f"{where}.states_covered: nonempty string list required")
        captures = route.get("captures")
        if not isinstance(captures, list) or not captures:
            errors.append(f"{where}.captures: nonempty list required")
        else:
            viewports = set()
            for ci, capture in enumerate(captures):
                cwhere = f"{where}.captures[{ci}]"
                if not isinstance(capture, dict):
                    errors.append(f"{cwhere}: expected object")
                    continue
                if not _str(capture.get("evidence_ref")):
                    errors.append(f"{cwhere}.evidence_ref: required")
                if capture.get("exact_head") != head:
                    errors.append(f"{cwhere}.exact_head: does not match candidate")
                if capture.get("viewport") not in ("desktop", "mobile"):
                    errors.append(f"{cwhere}.viewport: desktop/mobile required")
                else:
                    viewports.add(capture["viewport"])
            if viewports != {"desktop", "mobile"}:
                errors.append(f"{where}.captures: desktop and mobile evidence required")
        checks = route.get("checks")
        if not isinstance(checks, dict):
            errors.append(f"{where}.checks: object required")
            continue
        for check in CHECKS:
            c = checks.get(check)
            path = f"{where}.checks.{check}"
            if not isinstance(c, dict) or c.get("status") not in STATES:
                errors.append(f"{path}: valid status required")
            elif c["status"] != "PASS":
                errors.append(f"{path}: not PASS")
            elif not _str(c.get("evidence_ref")):
                errors.append(f"{path}.evidence_ref: required for PASS")
    return ("REVIEW_REQUIRED" if not errors else "BLOCKED"), errors


def main(argv):
    if len(argv) != 2:
        print("Usage: validate_packet.py path/to/packet.json", file=sys.stderr)
        return 2
    try:
        packet = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        print(json.dumps({"status": "BLOCKED", "errors": ["packet: unreadable or invalid JSON"]}))
        return 2
    status, errors = validate(packet)
    print(json.dumps({"status": status, "packet_structure_complete": not errors, "errors": errors}))
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
