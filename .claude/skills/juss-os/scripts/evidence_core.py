#!/usr/bin/env python3
"""Shared evidence/state primitives for ULTRATHINK modes. Stdlib only."""
from __future__ import annotations

from typing import Any, Iterable

EVIDENCE_LABELS = (
    "VERIFIED", "INFERRED", "PARTIAL", "UNKNOWN", "BLOCKED", "STALE", "DISPROVEN"
)
STATE_ORDER = (
    "PLANNED", "SOURCE IMPLEMENTED", "LOCALLY VERIFIED", "COMMITTED", "PR OPEN",
    "CI VERIFIED", "MERGED", "DEPLOYED", "RUNTIME VERIFIED", "OUTCOME VERIFIED",
)
SOURCE_RANK = {
    "runtime": 90,
    "deployment": 80,
    "branch_sha": 70,
    "artifact": 60,
    "receipt": 50,
    "repo_docs": 40,
    "chat": 20,
    "inference": 10,
}


def normalize_label(value: str | None) -> str:
    label = (value or "UNKNOWN").strip().upper()
    if label not in EVIDENCE_LABELS:
        raise ValueError(f"unsupported evidence label: {value!r}")
    return label


def normalize_state(value: str | None) -> str:
    state = (value or "PLANNED").strip().upper()
    if state not in STATE_ORDER:
        raise ValueError(f"unsupported lifecycle state: {value!r}")
    return state


def state_exceeds(claimed: str, proven: str) -> bool:
    return STATE_ORDER.index(normalize_state(claimed)) > STATE_ORDER.index(normalize_state(proven))


def evidence_strength(evidence: dict[str, Any]) -> int:
    base = SOURCE_RANK.get(str(evidence.get("source_kind", "inference")).lower(), 0)
    if evidence.get("direct") is False:
        base -= 20
    if evidence.get("fresh") is False:
        base -= 30
    return max(base, 0)


def classify_claim(evidence: Iterable[dict[str, Any]], blocked: bool = False) -> tuple[str, list[str]]:
    items = list(evidence)
    notes: list[str] = []
    if blocked and not items:
        return "BLOCKED", ["required evidence source is unavailable"]
    if not items:
        return "UNKNOWN", ["no evidence supplied"]

    opposing = [e for e in items if e.get("supports") is False and evidence_strength(e) >= 60]
    supporting = [e for e in items if e.get("supports") is True]
    fresh_direct = [e for e in supporting if e.get("direct", False) and e.get("fresh", True)]
    stale_only = supporting and all(e.get("fresh") is False for e in supporting)

    if opposing:
        notes.append("direct/authoritative evidence contradicts the claim")
        return "DISPROVEN", notes
    if fresh_direct:
        strongest = max(fresh_direct, key=evidence_strength)
        notes.append(f"direct evidence via {strongest.get('source_kind', 'unknown')}")
        return "VERIFIED", notes
    if stale_only:
        return "STALE", ["support exists only for an earlier state"]
    if supporting:
        strongest = max(supporting, key=evidence_strength)
        if evidence_strength(strongest) >= 40:
            return "PARTIAL", ["support exists but is not direct enough for VERIFIED"]
        return "INFERRED", ["support is inferential"]
    return "UNKNOWN", ["evidence supplied but none supports the claim"]


def diagnose_runtime_boundary(runtime: dict[str, Any] | None) -> dict[str, Any] | None:
    if not runtime:
        return None
    stages = list(runtime.get("stages") or [])
    last_idx = -1
    for idx, stage in enumerate(stages):
        if stage.get("received") is True and stage.get("evidence"):
            last_idx = idx
        else:
            break
    last = stages[last_idx]["name"] if last_idx >= 0 else "UNKNOWN"
    first_unproven = stages[last_idx + 1]["name"] if last_idx + 1 < len(stages) else "NONE"
    producer = runtime.get("producer") if runtime.get("producer_proven") is True else "UNKNOWN"
    return {
        "request": runtime.get("request", "UNKNOWN"),
        "response": runtime.get("response", "UNKNOWN"),
        "last_proven_received": last,
        "first_unproven_forward_transition": first_unproven,
        "who_produced_outcome": producer or "UNKNOWN",
        "attribution_rule": "message/status/provider wording alone never proves WHO",
    }
