import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import worker, { parseFrontmatter, validateSkill, refreshCurrent } from '../src/worker.mjs';

const FIRST = 'f'.repeat(40);
const SECOND = 'e'.repeat(40);
const KERNEL_BLOB = 'a'.repeat(40);
const TOKEN = 'test-client-token-abcdefghijklmnopqrstuvwxyz';
const ADMIN = 'test-admin-token-abcdefghijklmnopqrstuvwxyz';
const WEBHOOK = 'test-github-webhook-signing-key';

const kernel = `---
name: juss-os
description: Juss operating system kernel.
metadata:
  version: v3.1.1
  status: MERGE-APPROVED EXPORT; CANONICALIZATION UNKNOWN pending exact FOUNDER ACCEPT
---
# Juss OS
Current kernel must not silently promote approval into acceptance.`;
const af = `---
name: juss-af-skills-pack
status: canonical-first-party
version: 1.0.1
description: >
  Creative production pack with an authority boundary.
triggers:
  - /afvideo
  - /makevideo
  - /MAKEVIDEO
  - /makeimage
  - /MAKEIMAGE
  - /advertise
  - /campaign
---
This pack is a subordinate module under \`juss-os\` and cannot override \`juss-os\` authority, phase, evidence, state, receipt, merge/deploy, or verification gates.`;
const truthmode = `---
name: truthmode
description: Evidence-bound truth mode.
metadata:
  version: v1
  parent: juss-os
---
# Truthmode`;
const refNames = ['os.md', 'runtime-first-class.md', 'acceptance.md', 'operator-addendum.md', 'public-technical-reply-evidence-gate.md'];
const originalAcceptance = '# Acceptance state\n- PR #1 was merged into `main` as c77c4b8815cffed8621ead988b61a1717a9c4ce9.\n**Merge approval is VERIFIED**. Founder acceptance has not happened.';

class KV {
  constructor() { this.records = new Map(); }
  async get(key, type) { const v = this.records.get(key); return v === undefined ? null : type === 'json' ? JSON.parse(v) : v; }
  async put(key, value) { this.records.set(key, value); }
  async delete(key) { this.records.delete(key); }
}

function makeFixture() {
  const files = new Map();
  let idx = 1;
  function setFile(path, content, overrideSha = null) {
    const sha = overrideSha || (idx++).toString(16).padStart(40, '0');
    files.set(path, { path, sha, type: 'blob', content });
  }
  setFile('.claude/skills/juss-os/SKILL.md', kernel, KERNEL_BLOB);
  setFile('.claude/skills/juss-af-skills-pack/SKILL.md', af);
  setFile('.claude/skills/truthmode/SKILL.md', truthmode);
  for (const name of refNames) setFile(`.claude/skills/juss-os/references/${name}`, name === 'acceptance.md' ? originalAcceptance : `# ${name}\nRequired reference for the kernel.`);
  return { files, head: FIRST, originalAcceptance };
}

function gitFetchFor(fixture) {
  return async function (input) {
    const url = new URL(String(input));
    const route = url.pathname.replace('/repos/jussray/ULTRATHINK-/', '');
    if (route.startsWith('commits/')) {
      const ref = route.slice('commits/'.length);
      if (ref === 'main' || ref === fixture.head || ref === FIRST || ref === SECOND) {
        return Response.json({ sha: ref === 'main' ? fixture.head : ref, commit: { tree: { sha: 'b'.repeat(40) } } });
      }
    }
    if (route.startsWith('git/trees/')) return Response.json({ tree: [...fixture.files.values()].map(({ path, sha, type }) => ({ path, sha, type })), truncated: false });
    if (route.startsWith('git/blobs/')) {
      const blob = [...fixture.files.values()].find(x => x.sha === route.slice('git/blobs/'.length));
      if (blob) return Response.json({ encoding: 'base64', content: Buffer.from(blob.content).toString('base64'), size: Buffer.byteLength(blob.content) });
    }
    return Response.json({ message: 'Not found' }, { status: 404 });
  };
}

function makeEnv() {
  return { SKILL_CACHE: new KV(), GITHUB_REPO: 'jussray/ULTRATHINK-', GITHUB_REF: 'main', GITHUB_TOKEN: 'SECRET_GITHUB_AUTH',
    COUNCIL_API_TOKENS_JSON: JSON.stringify({ chatgpt: TOKEN }), ADMIN_API_TOKEN: ADMIN,
    GITHUB_WEBHOOK_SECRET: WEBHOOK, RATE_LIMITER: { async limit() { return { success: true }; } }, ALLOWED_ORIGINS: 'https://council.example.test' };
}
function req(path, { method = 'GET', token = TOKEN, body, headers = {} } = {}) {
  return new Request(`https://distribution.juss.dev${path}`, { method, headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}), 'CF-Connecting-IP': '192.0.2.30',
    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers
  }, body: body === undefined ? undefined : JSON.stringify(body) });
}
async function call(env, path, options) {
  const response = await worker.fetch(req(path, options), env);
  const json = response.status === 204 ? null : await response.json();
  return { response, json };
}
function pushRequest(sha, { tamper = false, event = 'push' } = {}) {
  const body = JSON.stringify({ ref: 'refs/heads/main', after: sha, repository: { full_name: 'jussray/ULTRATHINK-' } });
  const signature = createHmac('sha256', WEBHOOK).update(tamper ? 'different body' : body).digest('hex');
  return new Request('https://distribution.juss.dev/api/v1/webhooks/github', {
    method: 'POST', headers: { 'X-GitHub-Event': event, 'X-Hub-Signature-256': `sha256=${signature}`, 'CF-Connecting-IP': '192.0.2.30' }, body
  });
}

// Run sequentially because global fetch is injected per test.
test('restricted YAML frontmatter validates the existing nested kernel metadata shape', () => {
  const f = parseFrontmatter(kernel);
  assert.equal(f.metadata.version, 'v3.1.1');
  assert.equal(f.metadata.status.startsWith('MERGE-APPROVED'), true);
  assert.deepEqual(parseFrontmatter(af).triggers, ['/afvideo', '/makevideo', '/MAKEVIDEO', '/makeimage', '/MAKEIMAGE', '/advertise', '/campaign']);
  assert.throws(() => parseFrontmatter('name: invalid'), /frontmatter_missing/);
  assert.throws(() => parseFrontmatter('---\nname: foo\nname: bar\n---'), /duplicate_yaml_key/);
  assert.throws(() => parseFrontmatter('---\nname: *alias\n---'), /unsupported_yaml_syntax/);
});

test('version and founder acceptance are independent of merge approval', () => {
  const refs = Object.fromEntries(refNames.map(x => [x, x === 'acceptance.md' ? originalAcceptance : '# ref']));
  const skill = validateSkill('juss-os', kernel, refs, KERNEL_BLOB, originalAcceptance);
  assert.equal(skill.version, '3.1.1');
  assert.equal(skill.status, 'draft');
  assert.equal(skill.canonical_by, null);
  const accepted = validateSkill('juss-os', kernel, refs, KERNEL_BLOB, `${originalAcceptance}\nFounder-Canonicalized: 2026-11-17T12:00:00Z | v3.1.1 @ ${KERNEL_BLOB}`);
  assert.equal(accepted.status, 'canonical');
  assert.equal(accepted.canonical_by, '2026-11-17T12:00:00Z');
  const unrelated = validateSkill('juss-os', kernel, refs, KERNEL_BLOB, `${originalAcceptance}\nFounder-Canonicalized: 2026-11-17T12:00:00Z | v3.1.1 @ ${'b'.repeat(40)}`);
  assert.equal(unrelated.status, 'draft');
});

test('unauthorized callers cannot fetch source; authenticated routes, version and validation work', async () => {
  const fixture = makeFixture(); const env = makeEnv(); const original = globalThis.fetch; globalThis.fetch = gitFetchFor(fixture);
  try {
    let result = await call(env, '/api/v1/skills', { token: null });
    assert.equal(result.response.status, 401);
    result = await call(env, '/api/v1/skills');
    assert.equal(result.response.status, 200);
    assert.equal(result.json.skills.length, 3);
    assert.equal(result.json.kernel_status, 'draft');
    assert.equal(result.json.skills.find(x => x.name === 'juss-os').sha, FIRST);
    assert.equal(JSON.stringify(result.json).includes('SECRET_GITHUB_AUTH'), false);
    result = await call(env, '/api/v1/skills/juss-af-skills-pack/latest');
    assert.equal(result.json.status, 'canonical-first-party');
    assert.equal(result.json.body.skill_md.includes('/MAKEIMAGE'), true);
    assert.equal(result.json.kernel_status, 'draft');
    result = await call(env, `/api/v1/skills/juss-os/sha/${FIRST}`);
    assert.equal(result.json.pinned, true);
    result = await call(env, '/api/v1/skills/juss-os/version/3.1.1');
    assert.equal(result.json.sha, FIRST);
    result = await call(env, '/api/v1/acceptance');
    assert.equal(result.json.kernel.merge_approved, true);
    assert.equal(result.json.kernel.founder_accepted, false);
    result = await call(env, '/api/v1/validate', { method: 'POST', body: { skill_name: 'juss-af-skills-pack', expected_status: 'canonical-first-party', expected_triggers: ['/afvideo', '/makevideo', '/MAKEVIDEO', '/makeimage', '/MAKEIMAGE', '/advertise', '/campaign'], kernel_binding_required: true } });
    assert.equal(result.json.valid, true);
    result = await call(env, '/api/v1/validate', { method: 'POST', body: { skill_name: 'juss-af-skills-pack', expected_triggers: ['/makevideo'] } });
    assert.equal(result.json.valid, false);
    result = await call(env, '/api/v1/skills/juss-os/sha/abc1234');
    assert.equal(result.response.status, 400);
    result = await call(env, '/api/v1/skills/unknown/latest');
    assert.equal(result.response.status, 404);
    result = await call(env, '/api/v1/skills', { headers: { Origin: 'https://untrusted.example.test' } });
    assert.equal(result.response.headers.get('Access-Control-Allow-Origin'), null);
    result = await call(env, '/api/v1/skills', { headers: { Origin: 'https://council.example.test' } });
    assert.equal(result.response.headers.get('Access-Control-Allow-Origin'), 'https://council.example.test');
  } finally { globalThis.fetch = original; }
});

test('signed webhook can canonicalize only the matching immutable SKILL blob while preserving historical SHA', async () => {
  const fixture = makeFixture(); const env = makeEnv(); const original = globalThis.fetch; globalThis.fetch = gitFetchFor(fixture);
  try {
    await refreshCurrent(env);
    let denied = await worker.fetch(pushRequest(SECOND, { tamper: true }), env);
    assert.equal(denied.status, 401);
    const acceptanceFile = fixture.files.get('.claude/skills/juss-os/references/acceptance.md');
    acceptanceFile.content += `\nFounder-Canonicalized: 2026-11-17T12:00:00Z | v3.1.1 @ ${KERNEL_BLOB}`;
    acceptanceFile.sha = 'd'.repeat(40);
    fixture.head = SECOND;
    const accepted = await worker.fetch(pushRequest(SECOND), env);
    assert.equal(accepted.status, 200);
    let result = await call(env, '/api/v1/acceptance');
    assert.equal(result.json.kernel.founder_accepted, true);
    assert.equal(result.json.kernel.status, 'canonical');
    result = await call(env, '/api/v1/skills/juss-os/version/3.1.1');
    assert.equal(result.json.sha, SECOND);
    result = await call(env, `/api/v1/skills/juss-os/sha/${FIRST}`);
    assert.equal(result.json.status, 'draft');
  } finally { globalThis.fetch = original; }
});

test('a bad new source cannot be published; clients see explicit stale marker', async () => {
  const fixture = makeFixture(); const env = makeEnv(); const original = globalThis.fetch; globalThis.fetch = gitFetchFor(fixture);
  try {
    await refreshCurrent(env);
    fixture.files.get('.claude/skills/juss-os/SKILL.md').content = kernel.replace('name: juss-os', 'name: another-os');
    fixture.files.get('.claude/skills/juss-os/SKILL.md').sha = 'c'.repeat(40);
    fixture.head = SECOND;
    const bad = await worker.fetch(pushRequest(SECOND), env);
    assert.equal(bad.status, 422);
    const result = await call(env, '/api/v1/skills');
    assert.equal(result.response.headers.get('X-Distribution-State'), 'stale');
    assert.equal(result.json.repo_sha, FIRST);
    assert.equal((await env.SKILL_CACHE.get('snapshot:current')), FIRST);
  } finally { globalThis.fetch = original; }
});

test('admin invalidation rejects wrong revision and missing security bindings fail closed', async () => {
  const fixture = makeFixture(); const env = makeEnv(); const original = globalThis.fetch; globalThis.fetch = gitFetchFor(fixture);
  try {
    let result = await call(env, '/api/v1/invalidate', { method: 'POST', body: { repo_sha: FIRST } });
    assert.equal(result.response.status, 401);
    result = await call(env, '/api/v1/invalidate', { method: 'POST', token: ADMIN, body: { repo_sha: SECOND } });
    assert.equal(result.response.status, 409);
    result = await call(env, '/api/v1/invalidate', { method: 'POST', token: ADMIN, body: { repo_sha: FIRST } });
    assert.equal(result.response.status, 200);
    const badEnv = { ...env, RATE_LIMITER: null };
    result = await call(badEnv, '/api/v1/skills');
    assert.equal(result.response.status, 503);
    const limited = { ...env, RATE_LIMITER: { async limit() { return { success: false }; } } };
    result = await call(limited, '/api/v1/skills');
    assert.equal(result.response.status, 429);
    const options = await call(env, '/api/v1/skills', { method: 'OPTIONS', token: null, headers: { Origin: 'https://council.example.test' } });
    assert.equal(options.response.status, 204);
  } finally { globalThis.fetch = original; }
});

test('reading an older pinned SHA does not roll the active version pointer backward', async () => {
  const fixture = makeFixture(); const env = makeEnv(); const original = globalThis.fetch; globalThis.fetch = gitFetchFor(fixture);
  try {
    await refreshCurrent(env);
    fixture.head = SECOND;
    const acceptanceFile = fixture.files.get('.claude/skills/juss-os/references/acceptance.md');
    acceptanceFile.content += `\nFounder-Canonicalized: 2026-11-17T12:00:00Z | v3.1.1 @ ${KERNEL_BLOB}`;
    acceptanceFile.sha = 'd'.repeat(40);
    await refreshCurrent(env);
    assert.equal((await env.SKILL_CACHE.get('version:juss-os:3.1.1', 'json')).repo_sha, SECOND);
    await env.SKILL_CACHE.delete(`skill:juss-os:${FIRST}`); // Force a historical immutable refetch.
    const pinned = await call(env, `/api/v1/skills/juss-os/sha/${FIRST}`);
    assert.equal(pinned.response.status, 200);
    assert.equal(pinned.json.repo_sha, FIRST);
    assert.equal((await env.SKILL_CACHE.get('version:juss-os:3.1.1', 'json')).repo_sha, SECOND);
    assert.equal((await env.SKILL_CACHE.get('snapshot:current')), SECOND);
  } finally { globalThis.fetch = original; }
});
