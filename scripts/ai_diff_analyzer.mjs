import { execSync } from 'child_process';
import fs from 'fs';

const from = process.env.DIFF_FROM || 'HEAD~1';
const to = process.env.DIFF_TO || 'HEAD';
let raw = '';
try {
  raw = execSync(`git diff --name-only ${from} ${to}`).toString().trim();
} catch (e) {
  raw = '';
}
const files = raw
  ? raw
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
  : [];

const affectedModules = files
  .filter(f => f.startsWith('src/'))
  .map(f => f.replace(/^src\//, '').split('/')[0])
  .filter(Boolean);

const unique = [...new Set(affectedModules)];
fs.writeFileSync(
  './diff_map.json',
  JSON.stringify({ files, modules: unique }, null, 2)
);
console.log(
  'Diff map saved:',
  JSON.stringify({ files, modules: unique }, null, 2)
);
