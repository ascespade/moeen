// scripts/generate-barrels.js
import fs from 'fs';
import path from 'path';

const src = path.resolve(process.cwd(), 'src');
const targetDirs = ['components', 'hooks', 'utils', 'context'];

for (const dir of targetDirs) {
  const fullPath = path.join(src, dir);
  if (!fs.existsSync(fullPath)) continue;

  const files = fs
    .readdirSync(fullPath)
    .filter((f) => ['.ts', '.tsx', '.js'].includes(path.extname(f)))
    .filter((f) => !['index.ts', 'index.tsx', 'index.js'].includes(f));

  if (files.length === 0) continue;

  const exports = files
    .map((f) => `export * from './${path.basename(f, path.extname(f))}';`
    .join('\n');

  fs.writeFileSync(path.join(fullPath, 'index.ts'), exports + '\n');
  // console.log(`📦 Barrel generated: ${dir}/index.ts`
}
