'use strict';

const path = require('path');

async function main() {
  const { ESLint } = require('eslint');

  const root = path.resolve(__dirname, '..');
  const room2Root = path.join(root, 'rooms', 'room2-refactor-lab');
  const targetGlob = 'src/**/*.js';

  const eslint = new ESLint({
    cwd: room2Root,

    // Don't allow repo-provided config to weaken the gate.
    overrideConfigFile: true,

    overrideConfig: [
      {
        files: ['**/*.js'],
        languageOptions: {
          ecmaVersion: 2022,
          sourceType: 'commonjs'
        },
        rules: {
          complexity: ['error', 10]
        }
      }
    ]
  });

  const results = await eslint.lintFiles([targetGlob]);
  const errorCount = results.reduce((n, r) => n + (r.errorCount || 0), 0);

  if (errorCount > 0) {
    const formatter = await eslint.loadFormatter('stylish');
    const output = formatter.format(results);
    process.stderr.write(output);
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('ROOM2_GRADE_FAIL:', err && err.message ? err.message : String(err));
  process.exitCode = 1;
});
