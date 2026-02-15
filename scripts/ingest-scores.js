'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SCORES_DIR = path.join(ROOT, 'scores');

const inDir = process.argv[2];

if (!inDir) {
  console.error('Usage: node scripts/ingest-scores.js <input-dir>');
  process.exit(1);
}

const absInDir = path.resolve(inDir);
if (!fs.existsSync(absInDir)) {
  console.error(`Input dir not found: ${absInDir}`);
  process.exit(1);
}

// Ensure ./scores exists
fs.mkdirSync(SCORES_DIR, { recursive: true });

// Iterate over each team folder in input
const entries = fs.readdirSync(absInDir, { withFileTypes: true });

let ingests = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const teamName = entry.name;
  const teamPath = path.join(absInDir, teamName);

  // Look for score.json in likely places
  const candidates = [
    path.join(teamPath, 'score.json'),
    path.join(teamPath, 'score-output', 'score.json')
  ];

  let foundSrc = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      foundSrc = c;
      break;
    }
  }

  if (foundSrc) {
    const destDir = path.join(SCORES_DIR, teamName, 'score-output');
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(foundSrc, path.join(destDir, 'score.json'));
    console.log(`Ingested: ${teamName}`);
    ingests++;
  }
}

console.log(`\nIngested scores for ${ingests} teams.`);
console.log('Running leaderboard...');

try {
  execSync('npm run leaderboard', { cwd: ROOT, stdio: 'inherit' });
} catch (e) {
  console.error('Failed to run leaderboard script.');
  process.exit(1);
}
