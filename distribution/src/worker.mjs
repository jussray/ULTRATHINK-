// Juss Distribution Service v1.0. No GitHub credential or skill body is ever embedded in client code.
// Publication moves only validated, source-pinned snapshots; canonicalization requires an exact founder record.
const DEFAULT_REPO = 'jussray/ULTRATHINK-';
const API = '/api/v1';
const VERSION = '1.0.0';
const FULL_SHA = /^[0-9a-f]{40}$/;
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AF_TRIGGERS = ['/afvideo', '/makevideo', '/MAKEVIDEO', '/makeimage', '/MAKEIMAGE', '/advertise', '/campaign'];
const MAX_FILES = 120;
const MAX_FILE_BYTES = 256 * 1024;
const MAX_BODY_BYTES = 64 * 1024;

export class ServiceError extends Error {
  constructor(code, status = 500, details = null) {
    super(code);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function json(data, status = 200, options = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', ...(options.headers || {}) };
  return new Response(JSON.stringify(data), { status, headers });
}

function scalar(value) {
  const x = (value ?? '').trim();
  if (/^(?:[!&*]|\[|\{)/.test(x)) throw new ServiceError('unsupported_yaml_syntax', 422);
  if ((x.startsWith('"') && x.endsWith('"')) || (x.startsWith("'") && x.endsWith("'"))) return x.slice(1, -1);
  return x;
}

// Deliberately restricted, fail-closed YAML frontmatter subset that matches this repository:
// UTF-8 scalar mappings, two-space metadata mappings, trigger arrays, and folded descriptions.
// No YAML tags, aliases, anchors or executable constructors. Unsupported YAML is quarantined.
export function parseFrontmatter(source) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  if (lines[0] !== '---') throw new ServiceError('frontmatter_missing', 422);
  const end = lines.indexOf('---', 1);
  if (end < 2) throw new ServiceError('frontmatter_not_terminated', 422);
  const output = {};
  let current = null;
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (line.includes('\t')) throw new ServiceError('unsupported_yaml_syntax', 422);
    const top = /^([a-zA-Z][a-zA-Z0-9-]*):(?:\s+(.*))?$/.exec(line);
    if (top) {
      current = top[1];
      if (Object.hasOwn(output, current)) throw new ServiceError('duplicate_yaml_key', 422);
      const value = top[2] || '';
      if (value === '>') output[current] = '';
      else if (value === '|') output[current] = '';
      else if (!value && (current === 'metadata' || current === 'triggers')) output[current] = current === 'triggers' ? [] : {};
      else output[current] = scalar(value);
      continue;
    }
    const field = /^  ([a-zA-Z][a-zA-Z0-9-]*):(?:\s+(.*))?$/.exec(line);
    if (current === 'metadata' && field) {
      if (Object.hasOwn(output.metadata, field[1])) throw new ServiceError('duplicate_yaml_key', 422);
      output.metadata[field[1]] = scalar(field[2]);
      continue;
    }
    const item = /^  - (.+)$/.exec(line);
    if (current === 'triggers' && item) {
      output.triggers.push(scalar(item[1]));
      continue;
    }
    if (current === 'description' && /^\s{2,}\S/.test(line) && typeof output.description === 'string') {
      output.description += `${output.description ? ' ' : ''}${line.trim()}`;
      continue;
    }
    throw new ServiceError('unsupported_yaml_syntax', 422);
  }
  return output;
}

function normalizedVersion(front) {
  const v = String(front.version || front.metadata?.version || '').trim();
  if (!/^v?\d+(?:\.\d+){0,3}$/.test(v)) throw new ServiceError('invalid_skill_version', 422);
  return v.replace(/^v/, '');
}

function normalizedStatus(front) {
  const raw = String(front.status || front.metadata?.status || 'draft').toLowerCase();
  if (raw === 'canonical' || raw === 'canonical-first-party') return raw;
  if (raw.includes('draft') || raw.includes('merge-approved') || raw === '') return 'draft';
  throw new ServiceError('invalid_skill_status', 422);
}

function pathEntries(tree) {
  if (!Array.isArray(tree?.tree) || tree.truncated) throw new ServiceError('incomplete_repository_tree', 502);
  if (tree.tree.length > 3000) throw new ServiceError('repository_tree_too_large', 502);
  const candidates = tree.tree.filter(item => item.type === 'blob' && /^\.claude\/skills\/[a-z0-9-]+\/(SKILL\.md|references\/[a-zA-Z0-9._-]+\.md)$/.test(item.path));
  if (candidates.length > MAX_FILES) throw new ServiceError('too_many_skill_files', 502);
  return candidates;
}

function asUtf8Base64(value) {
  const binary = atob(value.replaceAll('\n', ''));
  if (binary.length > MAX_FILE_BYTES) throw new ServiceError('skill_file_too_large', 422);
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}

export function normalizeGithubRepo(value = DEFAULT_REPO) {
  // Only GitHub owner/repo or the exact HTTPS repository URL is accepted.
  // Do not allow arbitrary hosts, credentials, query strings, or API path injection.
  const match = /^(?:https:\/\/github\.com\/)?([A-Za-z0-9][A-Za-z0-9-]*)\/([A-Za-z0-9_.-]+)\/?$/i.exec(String(value || DEFAULT_REPO));
  if (!match || match[2] === '.' || match[2] === '..') throw new ServiceError('invalid_repo_configuration');
  return `${match[1]}/${match[2]}`;
}

async function github(env, resource) {
  const repo = normalizeGithubRepo(env.GITHUB_REPO);
  if (!env.GITHUB_TOKEN) throw new ServiceError('missing_github_token', 503);
  const response = await fetch(`https://api.github.com/repos/${repo}/${resource}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'juss-distribution-worker'
    }
  });
  if (!response.ok) throw new ServiceError(response.status === 404 ? 'source_revision_not_found' : 'github_unavailable', response.status === 404 ? 404 : 502);
  return response.json();
}

async function readTreeFile(env, file) {
  if (!FULL_SHA.test(file.sha || '')) throw new ServiceError('invalid_source_blob_sha', 502);
  const object = await github(env, `git/blobs/${file.sha}`);
  if (object.encoding !== 'base64' || typeof object.content !== 'string' || object.size > MAX_FILE_BYTES) throw new ServiceError('invalid_source_blob', 502);
  return asUtf8Base64(object.content);
}

async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');
}

function founderRecord(acceptanceText, version, blobSha) {
  const lines = acceptanceText.split(/\r?\n/);
  const prefix = /^Founder-Canonicalized:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s*\|\s*v?(\d+(?:\.\d+){0,3})\s*@\s*([0-9a-f]{40})$/;
  for (const line of lines) {
    const match = prefix.exec(line.trim());
    if (match && match[2] === version && match[3] === blobSha && !Number.isNaN(Date.parse(match[1]))) return match[1];
  }
  return null;
}

export function validateSkill(name, source, references, sourceSha, acceptance = '') {
  if (!SKILL_NAME.test(name) || !FULL_SHA.test(sourceSha)) throw new ServiceError('invalid_skill_identity', 422);
  const front = parseFrontmatter(source);
  const checks = [];
  function test(check, passes) {
    checks.push({ name: check, result: passes ? 'pass' : 'fail' });
    if (!passes) throw new ServiceError(`validation_${check}`, 422);
  }
  test('frontmatter_valid', !!front.name && !!front.description && !!(front.version || front.metadata?.version));
  test('skill_identity_match', front.name === name);
  const version = normalizedVersion(front);
  let status = normalizedStatus(front);
  const canonicalBy = name === 'juss-os' ? founderRecord(acceptance, version, sourceSha) : null;
  if (name === 'juss-os') {
    for (const file of ['os.md', 'runtime-first-class.md', 'acceptance.md', 'operator-addendum.md', 'public-technical-reply-evidence-gate.md']) {
      test(`required_${file}`, typeof references[file] === 'string' && references[file].length > 0);
    }
    status = canonicalBy ? 'canonical' : 'draft';
  } else {
    // Inheritance may be expressed in the skill's explicit contract rather than frontmatter.
    // Require both an affirmative kernel load and a strict precedence rule; a name mention is not binding.
    const inheritanceSection = source.split(/^## Inheritance\s*$/m)[1]?.split(/^## /m)[0] || '';
    const explicitLoad = /\bload the [`']juss-os[`'] skill\b/i.test(inheritanceSection) &&
      /\bstricter rule wins\b/i.test(inheritanceSection);
    const bound = (front.metadata?.parent === 'juss-os') ||
      /under [`']?juss-os[`']?/i.test(source) ||
      /subordinate.+juss-os/i.test(source) ||
      explicitLoad;
    test('law_binding_exists', bound);
  }
  if (name === 'juss-af-skills-pack') {
    const triggers = front.triggers;
    test('triggers_exact_set', Array.isArray(triggers) && triggers.length === AF_TRIGGERS.length && new Set(triggers).size === AF_TRIGGERS.length && triggers.every(t => AF_TRIGGERS.includes(t)));
    test('no_generic_ultrathink', !triggers.some(t => t.toLowerCase() === '/ultrathink'));
    test('kernel_boundary_contract', source.includes('cannot override `juss-os` authority, phase, evidence, state, receipt, merge/deploy, or verification gates.'));
  }
  checks.push({ name: 'canonicalization_exact_founder_record', result: canonicalBy ? 'pass' : 'not-accepted' });
  return { name, version, status, sha: sourceSha, canonical_by: canonicalBy, triggers: front.triggers || [], body: { skill_md: source, references }, validation: { passed: true, checks } };
}

function acceptanceState(kernel, acceptanceText, repoSha) {
  const evidence = /as\s+([0-9a-f]{40})/.exec(acceptanceText);
  const mergeApproved = !!(evidence && /Merge approval is VERIFIED|Merge approval is \*\*VERIFIED\*\*/i.test(acceptanceText));
  return {
    kernel: {
      name: kernel.name, version: kernel.version, sha: kernel.sha, repo_sha: repoSha,
      status: kernel.status,
      merge_approved: mergeApproved, merge_approved_at: null,
      founder_accepted: !!kernel.canonical_by, founder_accepted_at: kernel.canonical_by,
      canonical_by: kernel.canonical_by,
      evidence: { merge_commit: mergeApproved ? evidence[1] : null, acceptance_md_content_hash: null }
    }
  };
}

export async function assembleSnapshot(env, ref = null) {
  const requestedRef = ref || env.GITHUB_REF || 'main';
  if (ref && !FULL_SHA.test(ref)) throw new ServiceError('invalid_revision', 400);
  const commit = await github(env, `commits/${requestedRef}`);
  const repoSha = commit.sha;
  const treeSha = commit.commit?.tree?.sha;
  if (!FULL_SHA.test(repoSha || '') || !FULL_SHA.test(treeSha || '') || (ref && repoSha !== ref)) throw new ServiceError('invalid_github_commit', 502);
  const files = pathEntries(await github(env, `git/trees/${treeSha}?recursive=1`));
  const groups = new Map();
  for (const f of files) {
    const match = /^\.claude\/skills\/([a-z0-9-]+)\/(.+)$/.exec(f.path);
    if (!match) continue;
    if (!groups.has(match[1])) groups.set(match[1], { skill: null, references: [] });
    if (match[2] === 'SKILL.md') groups.get(match[1]).skill = f;
    else groups.get(match[1]).references.push(f);
  }
  if (!groups.has('juss-os') || !groups.get('juss-os').skill) throw new ServiceError('kernel_missing', 422);
  const allFiles = [...groups.values()].flatMap(g => g.skill ? [g.skill, ...g.references] : []);
  const contents = new Map();
  // Concurrent but bounded GitHub reads; any source file failure prevents publication.
  for (let start = 0; start < allFiles.length; start += 8) {
    const chunk = allFiles.slice(start, start + 8);
    const fetched = await Promise.all(chunk.map(f => readTreeFile(env, f)));
    chunk.forEach((f, i) => contents.set(f.path, fetched[i]));
  }
  const kernelGroup = groups.get('juss-os');
  const acceptanceFile = kernelGroup.references.find(f => f.path.endsWith('/acceptance.md'));
  const acceptanceText = acceptanceFile ? contents.get(acceptanceFile.path) : '';
  const skills = {};
  const quarantined = [];
  for (const [name, group] of groups) {
    if (!group.skill) continue;
    const refs = Object.fromEntries(group.references.map(f => [f.path.split('/').at(-1), contents.get(f.path)]));
    try {
      const skill = validateSkill(name, contents.get(group.skill.path), refs, group.skill.sha, acceptanceText);
      skill.source_sha = skill.sha;
      skill.sha = repoSha; // Commit SHA pins SKILL.md plus every required reference atomically.
      skill.repo_sha = repoSha;
      const identityRefs = Object.fromEntries(Object.entries(skill.body.references).filter(([key]) => key !== 'acceptance.md'));
      skill.package_sha256 = await sha256(JSON.stringify({ skill_md: skill.body.skill_md, references: identityRefs }));
      skill.fetched_at = new Date().toISOString();
      skills[name] = skill;
    } catch (e) {
      if (name === 'juss-os') throw e;
      quarantined.push({ skill: name, code: e.code || 'validation_failed' });
    }
  }
  for (const issue of quarantined) console.error('distribution quarantine', issue.skill, issue.code);
  const acceptance = acceptanceState(skills['juss-os'], acceptanceText, repoSha);
  acceptance.kernel.evidence.acceptance_md_content_hash = `sha256:${await sha256(acceptanceText)}`;
  return { repo: normalizeGithubRepo(env.GITHUB_REPO), repo_sha: repoSha, service_version: VERSION, skills, acceptance, quarantined };
}

async function storeSnapshot(env, snapshot, setCurrent = false) {
  if (!env.SKILL_CACHE) throw new ServiceError('missing_kv_binding', 503);
  const { repo_sha: repoSha, skills } = snapshot;
  // Historical SHA lookups must never mutate the live version-to-commit mapping.
  // Preflight mutable version mappings before publishing a new current snapshot.
  if (setCurrent) {
    for (const skill of Object.values(skills)) {
      const previous = await env.SKILL_CACHE.get(`version:${skill.name}:${skill.version}`, 'json');
      if (previous && previous.package_sha256 !== skill.package_sha256) throw new ServiceError('version_requires_bump', 409, { skill: skill.name });
    }
  }
  await env.SKILL_CACHE.put(`snapshot:${repoSha}`, JSON.stringify(snapshot));
  for (const skill of Object.values(skills)) {
    await env.SKILL_CACHE.put(`skill:${skill.name}:${repoSha}`, JSON.stringify(skill));
  }
  if (setCurrent) {
    for (const skill of Object.values(skills)) {
      await env.SKILL_CACHE.put(`version:${skill.name}:${skill.version}`, JSON.stringify({ repo_sha: repoSha, package_sha256: skill.package_sha256 }));
    }
    await env.SKILL_CACHE.put('snapshot:current', repoSha);
    await env.SKILL_CACHE.put('snapshot:last_good', repoSha);
  }
}

export async function refreshCurrent(env, requestedSha = null) {
  try {
    const fresh = await assembleSnapshot(env);
    if (requestedSha && fresh.repo_sha !== requestedSha) throw new ServiceError('repository_head_mismatch', 409);
    await storeSnapshot(env, fresh, true);
    if (env.SKILL_CACHE.delete) await env.SKILL_CACHE.delete('snapshot:degraded');
    return fresh;
  } catch (error) {
    if (env.SKILL_CACHE) await env.SKILL_CACHE.put('snapshot:degraded', JSON.stringify({ code: error.code || 'internal_error', at: new Date().toISOString() }));
    throw error;
  }
}

async function currentSnapshot(env) {
  if (!env.SKILL_CACHE) throw new ServiceError('missing_kv_binding', 503);
  const head = await env.SKILL_CACHE.get('snapshot:current');
  if (head) {
    const snapshot = await env.SKILL_CACHE.get(`snapshot:${head}`, 'json');
    if (snapshot) return { snapshot, stale: !!(await env.SKILL_CACHE.get('snapshot:degraded')) };
  }
  try { return { snapshot: await refreshCurrent(env), stale: false }; }
  catch (error) {
    console.error('distribution refresh failed', error.code || 'internal_error');
    const backupSha = await env.SKILL_CACHE.get('snapshot:last_good');
    const backup = backupSha && await env.SKILL_CACHE.get(`snapshot:${backupSha}`, 'json');
    if (!backup) throw error;
    return { snapshot: backup, stale: true };
  }
}

function skillList(snapshot) {
  return {
    skills: Object.values(snapshot.skills).map(s => ({
      name: s.name, status: s.status, version: s.version, sha: s.sha, source_sha: s.source_sha,
      repo_sha: snapshot.repo_sha, canonical_by: s.canonical_by, last_validated: s.fetched_at,
      endpoint: `${API}/skills/${s.name}/latest`
    })).sort((a, b) => a.name.localeCompare(b.name)),
    repo: snapshot.repo, repo_sha: snapshot.repo_sha, kernel_status: snapshot.acceptance.kernel.status, service_version: VERSION
  };
}

function compareFixedTime(a, b) {
  const left = new Uint8Array(a); const right = new Uint8Array(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) diff |= (left[i] || 0) ^ (right[i] || 0);
  return diff === 0;
}

async function tokenMatch(request, expected) {
  if (!expected) return false;
  const match = /^Bearer (\S+)$/.exec(request.headers.get('Authorization') || '');
  if (!match) return false;
  const [given, correct] = await Promise.all([crypto.subtle.digest('SHA-256', new TextEncoder().encode(match[1])), crypto.subtle.digest('SHA-256', new TextEncoder().encode(expected))]);
  return compareFixedTime(given, correct);
}

async function authenticate(request, env, admin = false) {
  if (admin) return await tokenMatch(request, env.ADMIN_API_TOKEN);
  let tokens;
  try { tokens = JSON.parse(env.COUNCIL_API_TOKENS_JSON || '{}'); } catch { throw new ServiceError('invalid_auth_configuration', 503); }
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens) || !Object.keys(tokens).length) throw new ServiceError('missing_council_tokens', 503);
  for (const [client, secret] of Object.entries(tokens)) {
    if (typeof secret !== 'string' || secret.length < 24) throw new ServiceError('invalid_auth_configuration', 503);
    if (await tokenMatch(request, secret)) return client;
  }
  return false;
}

async function limitRequest(request, env) {
  if (!env.RATE_LIMITER) throw new ServiceError('missing_rate_limit_binding', 503);
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const outcome = await env.RATE_LIMITER.limit({ key: `ip:${ip}` });
  if (!outcome.success) throw new ServiceError('rate_limited', 429);
}

async function parseJsonBody(request) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > MAX_BODY_BYTES) throw new ServiceError('body_too_large', 413);
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) throw new ServiceError('body_too_large', 413);
  try { return JSON.parse(body); }
  catch { throw new ServiceError('invalid_json', 400); }
}

async function verifyWebhook(request, env) {
  if (!env.GITHUB_WEBHOOK_SECRET) throw new ServiceError('missing_webhook_secret', 503);
  const header = request.headers.get('X-Hub-Signature-256') || '';
  if (!/^sha256=[0-9a-f]{64}$/.test(header)) return null;
  const raw = await request.arrayBuffer();
  if (raw.byteLength > MAX_BODY_BYTES) throw new ServiceError('body_too_large', 413);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.GITHUB_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = await crypto.subtle.sign('HMAC', key, raw);
  const given = Uint8Array.from(header.slice(7).match(/.{2}/g), x => parseInt(x, 16));
  if (!compareFixedTime(expected, given)) return null;
  try { return JSON.parse(new TextDecoder().decode(raw)); } catch { throw new ServiceError('invalid_json', 400); }
}

function withCors(response, origin, env) {
  const origins = (env.ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  if (origin && origins.includes(origin)) {
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    headers.set('Vary', 'Origin');
    return new Response(response.body, { status: response.status, headers });
  }
  return response;
}

async function route(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  await limitRequest(request, env);
  if (request.method === 'POST' && path === `${API}/webhooks/github`) {
    const payload = await verifyWebhook(request, env);
    if (!payload) throw new ServiceError('invalid_webhook_signature', 401);
    if (request.headers.get('X-GitHub-Event') !== 'push' || payload.ref !== `refs/heads/${env.GITHUB_REF || 'main'}` || payload.repository?.full_name?.toLowerCase() !== normalizeGithubRepo(env.GITHUB_REPO).toLowerCase()) return json({ ignored: true }, 202);
    if (!FULL_SHA.test(payload.after || '')) throw new ServiceError('invalid_webhook_revision', 400);
    const snapshot = await refreshCurrent(env, payload.after);
    return json({ refreshed: true, repo_sha: snapshot.repo_sha, published_skills: Object.keys(snapshot.skills).length });
  }
  if (request.method === 'POST' && path === `${API}/invalidate`) {
    if (!await authenticate(request, env, true)) throw new ServiceError('unauthorized', 401);
    const body = await parseJsonBody(request);
    if (!FULL_SHA.test(body?.repo_sha || '')) throw new ServiceError('invalid_revision', 400);
    const snapshot = await refreshCurrent(env, body.repo_sha);
    return json({ refreshed: true, repo_sha: snapshot.repo_sha, published_skills: Object.keys(snapshot.skills).length });
  }
  // Dedicated, optional server-to-server read capability for FCR. It is not a
  // council token and grants no acceptance, skill body, validation, or admin access.
  const fcrReadToken = env.FCR_DISTRIBUTION_CLIENT_TOKEN;
  const fcrInventoryOnly = request.method === 'GET'
    && path === `${API}/skills`
    && typeof fcrReadToken === 'string'
    && fcrReadToken.length >= 24
    && !/\\s/.test(fcrReadToken)
    && await tokenMatch(request, fcrReadToken);
  if (!fcrInventoryOnly && !await authenticate(request, env)) throw new ServiceError('unauthorized', 401);
  if (request.method === 'GET' && (path === `${API}/skills` || path === `${API}/acceptance` || path.endsWith('/latest'))) {
    const { snapshot, stale } = await currentSnapshot(env);
    const headers = stale ? { 'X-Distribution-State': 'stale', 'X-Served-Repo-SHA': snapshot.repo_sha } : { 'X-Distribution-State': 'current' };
    if (path === `${API}/skills`) return json(skillList(snapshot), 200, { headers });
    if (path === `${API}/acceptance`) return json(snapshot.acceptance, 200, { headers });
    const m = /^\/api\/v1\/skills\/([a-z0-9-]+)\/latest$/.exec(path);
    if (!m) throw new ServiceError('not_found', 404);
    const skill = snapshot.skills[m[1]];
    if (!skill) throw new ServiceError('skill_not_found', 404);
    return json({ ...skill, kernel_status: snapshot.acceptance.kernel.status, stale }, 200, { headers });
  }
  const pinned = /^\/api\/v1\/skills\/([a-z0-9-]+)\/(sha|version)\/([A-Za-z0-9.\-]+)$/.exec(path);
  if (request.method === 'GET' && pinned) {
    const [, name, mode, selector] = pinned;
    if (!SKILL_NAME.test(name)) throw new ServiceError('invalid_skill_identity', 400);
    let repoSha = selector;
    if (mode === 'sha' && !FULL_SHA.test(repoSha)) throw new ServiceError('invalid_revision', 400);
    if (mode === 'version') {
      if (!/^\d+(?:\.\d+){0,3}$/.test(selector)) throw new ServiceError('invalid_version', 400);
      const lookup = await env.SKILL_CACHE.get(`version:${name}:${selector}`, 'json');
      if (!lookup) throw new ServiceError('skill_version_not_found', 404);
      repoSha = lookup.repo_sha;
    }
    let skill = await env.SKILL_CACHE.get(`skill:${name}:${repoSha}`, 'json');
    if (!skill && mode === 'sha') {
      const snapshot = await assembleSnapshot(env, repoSha);
      await storeSnapshot(env, snapshot, false);
      skill = snapshot.skills[name];
    }
    if (!skill) throw new ServiceError('skill_not_found', 404);
    return json({ ...skill, pinned: true });
  }
  if (request.method === 'POST' && path === `${API}/validate`) {
    const body = await parseJsonBody(request);
    if (!body || typeof body.skill_name !== 'string' || !SKILL_NAME.test(body.skill_name)) throw new ServiceError('invalid_skill_identity', 400);
    const { snapshot } = await currentSnapshot(env);
    const skill = snapshot.skills[body.skill_name];
    if (!skill) throw new ServiceError('skill_not_found', 404);
    const checks = [];
    function compare(check, passes) { checks.push({ check, result: passes ? 'pass' : 'fail' }); }
    compare('name_matches', skill.name === body.skill_name);
    if (body.expected_status !== undefined) compare('status_matches', skill.status === body.expected_status);
    if (body.expected_triggers !== undefined) {
      if (!Array.isArray(body.expected_triggers) || !body.expected_triggers.every(x => typeof x === 'string')) throw new ServiceError('invalid_triggers', 400);
      compare('triggers_exact_set', body.expected_triggers.length === skill.triggers.length && new Set(body.expected_triggers).size === body.expected_triggers.length && body.expected_triggers.every(x => skill.triggers.includes(x)));
    }
    if (body.kernel_binding_required) compare('kernel_boundary_contract', skill.name !== 'juss-os' && skill.validation.checks.some(x => x.name === 'law_binding_exists' && x.result === 'pass'));
    if (body.skill_name === 'juss-af-skills-pack') compare('no_generic_ultrathink', !skill.triggers.some(t => t.toLowerCase() === '/ultrathink'));
    return json({ valid: checks.every(c => c.result === 'pass'), skill: skill.name, repo_sha: snapshot.repo_sha, kernel_status: snapshot.acceptance.kernel.status, checks });
  }
  throw new ServiceError('not_found', 404);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    try { return withCors(await route(request, env), origin, env); }
    catch (error) {
      const code = error instanceof ServiceError ? error.code : 'internal_error';
      const status = error instanceof ServiceError ? error.status : 500;
      console.error('distribution request failure', code);
      return withCors(json({ error: code }, status), origin, env);
    }
  },
  async scheduled(_event, env) {
    try { await refreshCurrent(env); }
    catch (error) { console.error('distribution scheduled refresh failed', error.code || 'internal_error'); }
  }
};
