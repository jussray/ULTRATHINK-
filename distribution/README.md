# Juss Distribution Service (implementation)

A single authenticated Cloudflare Worker endpoint for council skills sourced from `jussray/ULTRATHINK-`. This directory does not alter the Juss OS kernel or the founder acceptance record. **Source is implemented, but no production endpoint, credential binding, or deployment is implied by the code.**

## Source of truth and canonicalization

- Default repository: `jussray/ULTRATHINK-`, branch `main` (currently a **public** repository). The Worker may also use a private repo if its scoped `GITHUB_TOKEN` can read it.
- Each response includes a full **repository commit SHA** (`sha` / `repo_sha`) that immutably pins `SKILL.md` *and all bundled references*, and `source_sha` for the `SKILL.md` Git blob.
- `juss-os` remains `draft` until `.claude/skills/juss-os/references/acceptance.md` contains an exact **full source blob SHA** record:
  `Founder-Canonicalized: 2026-11-17T12:00:00Z | v3.1.1 @ <full SKILL.md blob SHA>`
- A merge record is **not** founder acceptance. The operator addendum is independently accepted but does not canonicalize the kernel.
- **Governance requirement before production canonicalization:** protect `acceptance.md` with founder-controlled review/permissions. Text inside an editable repository file is not cryptographic proof of the founder's identity by itself. A future signature-based acceptance workflow can harden this further. Do not loosen the canonicalization gate to work around missing permissions.
- Skills without explicit source status are conservatively returned as `draft`; `juss-os` legacy `metadata.version`/`metadata.status` are normalized without editing the kernel. Unsupported or malformed YAML is quarantined. The parser intentionally allows only the repository's narrow safe YAML subset, not arbitrary YAML language features.
- AF triggers are exactly `/afvideo`, `/makevideo`, `/MAKEVIDEO`, `/makeimage`, `/MAKEIMAGE`, `/advertise`, `/campaign`. Any non-AF `ULTRATHINK` triggers remain kernel-owned.

## Endpoints

All endpoints require auth except OPTIONS preflight (which exposes no data) and the GitHub webhook route (which requires raw-body HMAC):

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/skills` | Validated skill inventory with kernel status |
| GET | `/api/v1/skills/{name}/latest` | Current validated package |
| GET | `/api/v1/skills/{name}/sha/{40-char-repo-commit-sha}` | Immutable source snapshot |
| GET | `/api/v1/skills/{name}/version/{version}` | Resolved version binding |
| GET | `/api/v1/acceptance` | Kernel merge and founder-acceptance states |
| POST | `/api/v1/validate` | Compare status, trigger exact set, kernel boundary |
| POST | `/api/v1/invalidate` | Admin-authenticated main HEAD revalidation |
| POST | `/api/v1/webhooks/github` | GitHub-signed push-to-main revalidation |

A failed source refresh retains the last-known-good source revision, and `GET` responses include `X-Distribution-State: stale`. No rejected revision becomes current. Invalid skills are not served. The service logs diagnostic error codes, not response bodies or credentials.

## Deployment prerequisites (not yet configured)

1. Allocate a Cloudflare KV namespace, replace `REPLACE_WITH_EXISTING_OR_NEW_KV_NAMESPACE_ID` in `wrangler.jsonc`, and confirm a unique rate-limit namespace ID. No real account/namespace is assumed.
2. Add **Worker secrets** using your organization's approved secure process: `GITHUB_TOKEN` (fine-grained, read-only contents, scoped to the authoritative repo), `COUNCIL_API_TOKENS_JSON` (JSON object mapping council client IDs to unique 24+ character service tokens), `ADMIN_API_TOKEN` (separate), and `GITHUB_WEBHOOK_SECRET` (separate). Never commit values or put them in build artifacts.
3. Optionally configure `ALLOWED_ORIGINS` (comma-separated exact HTTPS browser origins). Model-to-server clients normally do not need CORS. **Never embed council bearer tokens in browser-side JavaScript.**
   - Optional FCR inventory-only integration: provide a separate provider-held `FCR_DISTRIBUTION_CLIENT_TOKEN` (minimum 24 characters, no whitespace) on **this** Worker and the identical value under `FCR_DISTRIBUTION_READ_TOKEN` on the canonical FCR Worker. This distinct credential authorizes only `GET /api/v1/skills`; it never grants access to skill bodies, acceptance, validation, invalidation, or webhooks. **Do not change, export, or replace `COUNCIL_API_TOKENS_JSON`**. The names are declarations only; secure provisioning and authenticated production proof remain separate gates. No URL- or caller-supplied token may be persisted to public source.

4. Configure GitHub push-to-main webhook endpoint with `application/json` and the exact matching webhook secret. The webhook is invalid unless `X-Hub-Signature-256` HMAC verifies over the raw body. Configure the Worker route/custom domain separately after explicit deployment approval.
5. Use a deployment gate: check the source file version, Node tests, Wrangler dry-run, and a served URL bound to the deployed SHA. Do not cut over council clients without authenticated and unauthorized real-path checks.

## Caching and safety

- Every GitHub refresh revalidates the source commit SHA, trees, frontmatter, reference dependencies, AF trigger contract and kernel binding. Publish writes immutable snapshots and version mappings before moving the `snapshot:current` pointer.
- Version reuse with changed executable skill/reference package content fails; the acceptance record is explicitly excluded from package identity, so approval alone does not require a new version.
- KV is eventually consistent across Cloudflare locations. In a propagation window, a client may observe old approved source; it must compare `repo_sha` and `X-Distribution-State`. Strong global read-after-write consistency is **not** claimed.
- `snapshot:last_good` is retained for recovery. Pinned SHA remains immutable, even when a newer revision is rejected.
- The rate-limit binding enforces 1000 requests/minute per IP **per Cloudflare locality**; this is not a global abuse-control guarantee. Production should add Cloudflare WAF/rate rules as appropriate.
- Use HTTPS only. All skill-body and acceptance responses use `Cache-Control: private, no-store` to avoid browser/CDN storing sensitive responses. Do not whitelist `*` for CORS.
- Hourly scheduled refresh helps recover from missed webhooks.

## Local verification

Run `node --check src/worker.mjs && npm test` inside this directory. Tests use Node's built-in runner with a bounded, mocked GitHub API + KV, exercising auth, acceptance, immutable pinning, webhook signatures, bad-source rollback, conservative normalization and rate-limit failure.

A separate Playwright API smoke check is supplied in `test/playwright-smoke.py`, using the local HTTP harness `test/dev-server.mjs`. It tests the **local mocked API**, not an actual Cloudflare deployment. A production Playwright check still requires the real deployment URL, SHA and secrets.

## Rollback

Do not delete canonical records. For a bad deploy, roll back the Worker deployment to the previous release. For a bad repo refresh, preserve `snapshot:last_good`, diagnose the rejected SHA, then publish only a validated source revision. If a version identity changed, increment the skill version. The service cannot and must not reverse founder acceptance itself.
