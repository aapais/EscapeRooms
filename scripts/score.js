'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    failOnIncomplete: false,
    outDir: path.join(ROOT, 'score-output')
  };

  for (const a of argv.slice(2)) {
    if (a === '--fail-on-incomplete') args.failOnIncomplete = true;
    else if (a.startsWith('--out=')) args.outDir = path.resolve(ROOT, a.slice('--out='.length));
  }

  return args;
}

function run(cmd) {
  const res = spawnSync(cmd, {
    cwd: ROOT,
    shell: true,
    stdio: 'pipe',
    encoding: 'utf8'
  });

  return {
    cmd,
    ok: res.status === 0,
    status: res.status,
    stdout: res.stdout || '',
    stderr: res.stderr || ''
  };
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function fileContains(relPath, needle) {
  const p = path.join(ROOT, relPath);
  if (!fs.existsSync(p)) return false;
  const text = fs.readFileSync(p, 'utf8');
  return text.includes(needle);
}

function listWorkflowFiles() {
  const dir = path.join(ROOT, '.github', 'workflows');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map(f => path.join('.github', 'workflows', f).replace(/\\/g, '/'));
}

function summarize(text, maxLen) {
  const t = String(text || '').trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen) + '\n... (truncated)';
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function getTeamMeta() {
  return {
    teamName: process.env.TEAM_NAME || process.env.GITHUB_REPOSITORY || 'unknown-team',
    teamId: process.env.TEAM_ID || 'n/a',
    runId: process.env.GITHUB_RUN_ID || 'local',
    sha: process.env.GITHUB_SHA || 'local',
    actor: process.env.GITHUB_ACTOR || process.env.USERNAME || 'local'
  };
}

function computeScore(results) {
  const room1 = results.room1.ok ? 25 : 0;
  const room2 = results.room2.ok ? 25 : 0;

  // Room 3: split points to avoid “all or nothing”
  const room3Tests = results.room3Tests.ok ? 5 : 0;
  const room3Scan = results.room3Scan.ok ? 20 : 0;

  // Final: baseline tests + evidence of modernisation artifacts
  const finalTests = results.finalTests.ok ? 10 : 0;
  const dockerfile = exists('rooms/final-modernisation/Dockerfile') ? 8 : 0;

  // CI pipeline: any workflow besides our autograder counts
  const workflows = listWorkflowFiles();
  const hasExtraWorkflow = workflows.some(f => !/score\.ya?ml$/.test(f));
  const ci = hasExtraWorkflow ? 7 : 0;

  // REST API hint: common filenames OR presence of /health route string
  const hasApiFile =
    exists('rooms/final-modernisation/src/server.js') ||
    exists('rooms/final-modernisation/src/api.js') ||
    exists('rooms/final-modernisation/src/app.js');
  const hasHealthString =
    fileContains('rooms/final-modernisation/src/server.js', '/health') ||
    fileContains('rooms/final-modernisation/src/api.js', '/health') ||
    fileContains('rooms/final-modernisation/src/app.js', '/health');
  const api = hasApiFile ? 10 : 0;
  const obs = hasHealthString ? 5 : 0;

  // Cap to 100, but keep deterministic
  const total = Math.min(100, room1 + room2 + room3Tests + room3Scan + finalTests + dockerfile + ci + api + obs);

  return {
    breakdown: {
      room1,
      room2,
      room3Tests,
      room3Scan,
      finalTests,
      dockerfile,
      ci,
      api,
      obs
    },
    total
  };
}

function main() {
  const args = parseArgs(process.argv);
  const results = {
    room1: run('npm run room1'),
    // Room 2 is graded via a trusted gate (independent of repo ESLint config)
    room2: run('node scripts/grade-room2.js && npm -w @escape/room2 exec -- jest --runInBand'),
    room3Tests: run('npm -w @escape/room3 test'),
    room3Scan: run('npm -w @escape/room3 run scan'),
    finalTests: run('npm -w @escape/final test')
  };

  const score = computeScore(results);

  const report = {
    generatedAt: new Date().toISOString(),
    team: getTeamMeta(),
    score,
    results: {
      room1: { ok: results.room1.ok, status: results.room1.status, stderr: summarize(results.room1.stderr, 4000) },
      room2: { ok: results.room2.ok, status: results.room2.status, stderr: summarize(results.room2.stderr, 4000) },
      room3Tests: { ok: results.room3Tests.ok, status: results.room3Tests.status, stderr: summarize(results.room3Tests.stderr, 4000) },
      room3Scan: { ok: results.room3Scan.ok, status: results.room3Scan.status, stderr: summarize(results.room3Scan.stderr, 4000) },
      finalTests: { ok: results.finalTests.ok, status: results.finalTests.status, stderr: summarize(results.finalTests.stderr, 4000) }
    }
  };

  ensureDir(args.outDir);
  const outJsonPath = path.join(args.outDir, 'score.json');
  fs.writeFileSync(outJsonPath, JSON.stringify(report, null, 2));

  // Human-friendly summary
  const b = report.score.breakdown;
  const lines = [
    `TOTAL: ${report.score.total}/100`,
    `Team: ${report.team.teamName}`,
    `Room1: ${b.room1}/25`,
    `Room2: ${b.room2}/25`,
    `Room3 Tests: ${b.room3Tests}/5`,
    `Room3 Scan: ${b.room3Scan}/20`,
    `Final Tests: ${b.finalTests}/10`,
    `Final Dockerfile: ${b.dockerfile}/8`,
    `Final CI: ${b.ci}/7`,
    `Final API: ${b.api}/10`,
    `Final Observability: ${b.obs}/5`,
    `Wrote: ${path.relative(ROOT, outJsonPath).replace(/\\/g, '/')}`
  ];

  console.log(lines.join('\n'));

  const summary = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(args.outDir, 'score.txt'), summary, 'utf8');

  const md = ['# Escape Room — Score', '', '```', summary.trimEnd(), '```', ''].join('\n');
  fs.writeFileSync(path.join(args.outDir, 'score.md'), md, 'utf8');

  const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (stepSummaryPath) {
    fs.appendFileSync(stepSummaryPath, md, 'utf8');
  }

  // Exit code:
  // - default: always 0 (so local runs don't feel "broken")
  // - strict: 0 only when total == 100
  if (args.failOnIncomplete) {
    process.exit(report.score.total === 100 ? 0 : 1);
  }
}

main();
