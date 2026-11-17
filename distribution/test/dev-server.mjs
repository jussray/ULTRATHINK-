// Local HTTP adapter for Playwright smoke. This is NOT a Cloudflare runtime and never connects to GitHub.
import { createServer } from 'node:http';
import worker from '../src/worker.mjs';

const SHA = 'f'.repeat(40);
const body = { repo: 'jussray/ULTRATHINK-', repo_sha: SHA, service_version: '1.0.0',
  skills: { 'juss-os': { name: 'juss-os', version: '3.1.1', sha: SHA, source_sha: 'a'.repeat(40), status: 'draft', canonical_by: null,
    body: { skill_md: '---\nname: juss-os\n---', references: { 'os.md': 'local fixture' } }, validation: { passed: true, checks: [] }, triggers: [], fetched_at: '2026-11-17T00:00:00Z' } },
  acceptance: { kernel: { name: 'juss-os', version: '3.1.1', sha: SHA, status: 'draft', merge_approved: true, founder_accepted: false, founder_accepted_at: null, canonical_by: null } } };
const db = new Map([['snapshot:current', SHA], ['snapshot:last_good', SHA], [`snapshot:${SHA}`, JSON.stringify(body)], [`skill:juss-os:${SHA}`, JSON.stringify(body.skills['juss-os'])], ['version:juss-os:3.1.1', JSON.stringify({ repo_sha: SHA })]]);
const env = { GITHUB_REPO: 'jussray/ULTRATHINK-', GITHUB_REF: 'main', COUNCIL_API_TOKENS_JSON: JSON.stringify({ local: 'local-council-token-at-least-24-characters' }),
  ADMIN_API_TOKEN: 'admin-token-for-local-smoke-only', RATE_LIMITER: { async limit() { return { success: true }; } },
  SKILL_CACHE: { async get(key, format) { const v = db.get(key); return v == null ? null : format === 'json' ? JSON.parse(v) : v; }, async put(k, v) { db.set(k, v); } } };
const port = Number(process.env.PORT || 8799);
createServer(async (nodeRequest, nodeResponse) => {
  const chunks = []; for await (const chunk of nodeRequest) chunks.push(chunk);
  const request = new Request(`http://127.0.0.1:${port}${nodeRequest.url}`, { method: nodeRequest.method,
    headers: nodeRequest.headers, body: chunks.length ? Buffer.concat(chunks) : undefined });
  const response = await worker.fetch(request, env);
  nodeResponse.writeHead(response.status, Object.fromEntries(response.headers));
  nodeResponse.end(Buffer.from(await response.arrayBuffer()));
}).listen(port, '127.0.0.1', () => console.log(`local worker harness listening on ${port}`));
