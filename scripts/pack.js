'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'legacy-escape-room');

// Cleanup previous run
if (fs.existsSync(path.join(ROOT, 'dist'))) {
  fs.rmSync(path.join(ROOT, 'dist'), { recursive: true, force: true });
}

const EXCLUDE = new Set([
  'node_modules',
  '.git',
  '.github',
  'score-output',
  'scores',
  'dist',
  'coverage'
]);

// Recursive copy function
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      if (EXCLUDE.has(child)) return;
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Packaging to: ${DIST}`);
copyRecursive(ROOT, DIST);

console.log('\nDone!');
console.log(`Your clean offline folder is ready at: dist/legacy-escape-room`);
console.log('You can now zip this folder and share it with participants.');
