'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    dir: path.join(ROOT, 'scores'),
    format: 'table' // table|json
  };

  for (const a of argv.slice(2)) {
    if (a.startsWith('--dir=')) args.dir = path.resolve(ROOT, a.slice('--dir='.length));
    else if (a.startsWith('--format=')) args.format = a.slice('--format='.length);
  }

  return args;
}

function safeReadJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(text);
}

function listScoreJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Expect: scores/<team>/score.json OR scores/<team>/score-output/score.json
      const direct = path.join(p, 'score.json');
      const nested = path.join(p, 'score-output', 'score.json');
      if (fs.existsSync(direct)) out.push(direct);
      else if (fs.existsSync(nested)) out.push(nested);
      else {
        // recursive shallow search
        for (const f of ['score.json', path.join('score-output', 'score.json')]) {
          const candidate = path.join(p, f);
          if (fs.existsSync(candidate)) out.push(candidate);
        }
      }
    } else if (entry.isFile() && entry.name === 'score.json') {
      out.push(p);
    }
  }

  return out;
}

function padRight(s, n) {
  s = String(s);
  if (s.length >= n) return s;
  return s + ' '.repeat(n - s.length);
}

function main() {
  const args = parseArgs(process.argv);
  const files = listScoreJsonFiles(args.dir);

  const rows = [];
  for (const f of files) {
    try {
      const report = safeReadJson(f);
      const teamName = (report.team && report.team.teamName) || path.basename(path.dirname(f));
      const total = report.score && typeof report.score.total === 'number' ? report.score.total : null;
      const at = report.generatedAt || report.at || null;

      rows.push({
        team: teamName,
        total: total === null ? -1 : total,
        at: at || '',
        file: path.relative(ROOT, f).replace(/\\/g, '/')
      });
    } catch (e) {
      rows.push({
        team: path.basename(path.dirname(f)),
        total: -1,
        at: '',
        file: path.relative(ROOT, f).replace(/\\/g, '/'),
        error: String(e && e.message ? e.message : e)
      });
    }
  }

  rows.sort((a, b) => b.total - a.total || a.team.localeCompare(b.team));

  if (args.format === 'json') {
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));
    return;
  }

  const header = ['Rank', 'Team', 'Score', 'When', 'Source'];
  const widths = [4, 28, 5, 20, 40];

  console.log(
    header
      .map((h, i) => padRight(h, widths[i]))
      .join(' | ')
  );
  console.log('-'.repeat(widths.reduce((a, w) => a + w, 0) + (header.length - 1) * 3));

  rows.forEach((r, idx) => {
    const cols = [
      String(idx + 1),
      r.team,
      r.total >= 0 ? String(r.total) : 'ERR',
      r.at ? String(r.at).slice(0, 19).replace('T', ' ') : '',
      r.file
    ];

    console.log(cols.map((c, i) => padRight(c, widths[i])).join(' | '));
  });

  if (rows.length === 0) {
    console.log(`No scores found in: ${args.dir}`);
    console.log('Expected layout:');
    console.log('  scores/<team>/score-output/score.json');
  }
}

main();
