'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ROOM1 = path.join(ROOT, 'rooms', 'room1-archaeology');

function fail(msg) {
  console.error('ROOM1_DOCS_FAIL:', msg);
  process.exitCode = 1;
}

function fileOk(rel, { minChars, mustContainAny = [], mustContainAll = [] } = {}) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return { ok: false, reason: 'missing' };
  const text = fs.readFileSync(p, 'utf8');
  if (minChars && text.trim().length < minChars) return { ok: false, reason: 'too-short' };

  const lower = text.toLowerCase();
  for (const s of mustContainAll) {
    if (!lower.includes(String(s).toLowerCase())) return { ok: false, reason: `missing:${s}` };
  }
  if (mustContainAny.length > 0) {
    const any = mustContainAny.some(s => lower.includes(String(s).toLowerCase()));
    if (!any) return { ok: false, reason: 'missing:any-required' };
  }
  return { ok: true };
}

function countBullets(text) {
  return (text.match(/^\s*[-*]\s+/gm) || []).length;
}

function main() {
  // Deterministic deliverables (teams can create these files)
  // 1) OVERVIEW.md: one-page overview including purpose + inputs/outputs + how to run
  const overviewRel = 'rooms/room1-archaeology/OVERVIEW.md';
  const overview = fileOk(overviewRel, {
    minChars: 600,
    mustContainAll: ['prop', 'input', 'output', 'test'] // fuzzy but deterministic enough (PT/EN)
  });
  if (!overview.ok) {
    fail(`${overviewRel} ${overview.reason}`);
  }

  // 2) DEAD_CODE.md: short list with evidence (function names)
  const deadRel = 'rooms/room1-archaeology/DEAD_CODE.md';
  const deadPath = path.join(ROOT, deadRel);
  if (!fs.existsSync(deadPath)) {
    fail(`${deadRel} missing`);
  } else {
    const deadText = fs.readFileSync(deadPath, 'utf8');
    if (deadText.trim().length < 200) fail(`${deadRel} too-short`);
    if (countBullets(deadText) < 3) fail(`${deadRel} needs >= 3 bullet points`);

    // Require at least one of the known dead-code symbols to be referenced as evidence.
    const lower = deadText.toLowerCase();
    const evidence = ['_unusedlegacyreport', '_deprecatednormalizesku', '_legacycomputexdiscount'];
    if (!evidence.some(e => lower.includes(e))) {
      fail(`${deadRel} missing evidence (mention one of: ${evidence.join(', ')})`);
    }
  }
}

main();
