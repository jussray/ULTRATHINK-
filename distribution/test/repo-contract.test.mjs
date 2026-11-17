import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateSkill } from '../src/worker.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.claude/skills');

test('checked-out skill tree remains compatible with distribution validation', { skip: !existsSync(root) }, () => {
  const refDir = path.join(root, 'juss-os/references');
  const acceptance = readFileSync(path.join(refDir, 'acceptance.md'), 'utf8');
  const good = [];
  for (const dir of readdirSync(root, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const file = path.join(root, dir.name, 'SKILL.md');
    if (!existsSync(file)) continue;
    const refs = {};
    const base = path.join(root, dir.name, 'references');
    if (existsSync(base)) for (const fileName of readdirSync(base)) if (fileName.endsWith('.md')) refs[fileName] = readFileSync(path.join(base, fileName), 'utf8');
    const result = validateSkill(dir.name, readFileSync(file, 'utf8'), refs, 'a'.repeat(40), acceptance);
    assert.equal(result.validation.passed, true, `${dir.name} must validate`);
    good.push(dir.name);
  }
  assert.ok(good.includes('juss-os'));
  assert.ok(good.includes('truthmode'));
  assert.ok(good.includes('juss-af-skills-pack'));
});
