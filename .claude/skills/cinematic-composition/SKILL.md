---
name: cinematic-composition
description: Apply Juss & Co's one-cohesive-cinematic-composition standard to authorized product UI, creative, web and game work while retaining each product's original identity, accessibility, evidence and founder authority gates.
license: Proprietary — Juss / jussray
metadata:
  version: v1.0.0-candidate
  status: STAGED_NOT_CANONICAL
  owner: Juss (founder)
---

# Cinematic Composition — Portable Agent Skill

## Trigger

For each authorized app, web, game, route, screen, visual creative, UX audit, UI implementation or handoff, apply **one cohesive cinematic composition**. This is a craft and quality contract, not a license to rebrand, publish, change data, or act without authorization. Load stronger repository-local AGENTS.md and CLAUDE.md rules first. This skill is not installed in other runtimes merely by appearing in GitHub.

## Required process

1. **Source reality.** Identify the exact owner/repository/branch/head; inspect the actual page, app, assets, original founder-approved source visuals and local design tokens. Distinguish original canon from illustrations, guesses, sketches and mockups. If canon is missing, label BRAND_UNVERIFIED and hold design acceptance.
2. **Scene thesis.** State the dominant purpose, focal point, one primary action, atmospheric environment, lighting/depth, visual rhythm, hierarchy, contrast, typography, copy, spacing and motion/audio intent. Use a coherent product-specific art direction from first view to completion.
3. **Continuity.** Account for every *existing* route/state in scope (navigation, onboarding/auth, forms, main dashboard/scene, legal/trust where appropriate, loading/error/empty/success, mobile). Do not add pages or decorative chrome that undermine actual UX or a product's single CTA.
4. **Identity isolation.** Match the **specific** brand's approved colors, characters, imagery, style and voice. Never copy another portfolio product's palette or invent canonical references. No unlicensed or misleading media; no fake product data, endorsements, tests, users or availability.
5. **Usability and safety.** Test responsive layouts, semantic labels, focus and keyboard navigation, readable contrast, accessible touch targets, reduced motion, optimized images/animations, sound consent, graceful loading and failure. No flashing, forced autoplay or a background that hides content. Keep sensitive teen/family/customer data outside visual proof packets.
6. **Source-first repair.** Reuse real design tokens/components and preserve auth, payments, permissions, data authority, security and existing behavior. Make the smallest reversible coherent change in the authorized branch.
7. **Evidence and review.** For changed routes capture source visual reference, candidate exact head, actual desktop and mobile renders, interactive behavior, keyboard, motion reduction, contrast and performance results. Separate AUTHORED, TESTED, SCREENSHOT_OBSERVED, REVIEWED, MERGED, DEPLOYED, USER_OUTCOME. No evidence = UNKNOWN, not PASS.

## Packet and deterministic check

For work that asserts cinematic QA, use the local script at .claude/skills/cinematic-composition/scripts/validate_packet.py on a JSON packet and review its findings. The script checks **structure and evidence references only**; it cannot authenticate a screenshot, verify a visual reference's approval, or judge artistic quality. Even a structurally complete packet emits REVIEW_REQUIRED, not VISUALLY_VERIFIED or SHIP_APPROVED. The reviewer independently inspects the real artifacts, source rights, accessibility and exact-head alignment.

Run with:

    python3 .claude/skills/cinematic-composition/scripts/validate_packet.py path/to/packet.json
    python3 -m unittest discover -s .claude/skills/cinematic-composition/scripts -p 'test_*.py'

## Hand-off format

PRODUCT | REPOSITORY | BRANCH | EXACT_HEAD | APPROVED_REFERENCE | SCENE_THESIS | ROUTES/STATES | SOURCE_FILES | CAPTURE_REFS | ACCESSIBILITY_AND_PERFORMANCE | VERIFY_STATUS | MERGE_STATUS | DEPLOY_STATUS | NEXT_GATES.

No publication, deletion, merge, spending, provider access or external transmission authority follows from a skill, static lint result, draft branch, or rendered screenshot. Follow the founder's exact-head and privacy gates.
