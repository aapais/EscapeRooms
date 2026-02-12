'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function listJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsFiles(p));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(p);
  }
  return out;
}

function fail(msg) {
  console.error('SECURITY_SCAN_FAIL:', msg);
  process.exitCode = 1;
}

const files = listJsFiles(SRC);

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');

  // 1) hardcoded secret patterns
  if (/JWT_SECRET\s*=\s*['"]/i.test(text)) {
    fail(`${path.relative(ROOT, file)}: hardcoded JWT_SECRET`);
  }

  // 2) obvious SQL string concatenation
  if (/SELECT\s+\*\s+FROM[\s\S]*\+\s*\w+/i.test(text)) {
    fail(`${path.relative(ROOT, file)}: possible SQL injection (string concat)`);
  }

  // 3) weak token pattern: `${id}.${secret}` style
  if (/token\s*=\s*`\$\{\s*\w+\s*\}\.\$\{\s*\w+\s*\}`/.test(text) || /token\s*=\s*\w+\s*\+\s*['"]\./.test(text)) {
    fail(`${path.relative(ROOT, file)}: weak token construction`);
  }

  // 4) plaintext password literals in seed
  if (/password:\s*['"][^'"]+['"]/i.test(text)) {
    fail(`${path.relative(ROOT, file)}: plaintext password seed found`);
  }
}

if (!process.exitCode) {
  console.log('SECURITY_SCAN_OK');
}
