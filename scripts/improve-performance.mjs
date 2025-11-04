#!/usr/bin/env node

/**
 * Improve Performance
 * ????? ??????
 * Target: 23.3% ? 90%+
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Improving Performance...\n');

// 1. Add dynamic imports to heavy components
const heavyComponents = [
  'src/components/dashboard/charts/AdvancedCharts.tsx',
  'src/components/dashboard/widgets/ChartWidget.tsx',
  'src/components/admin/settings/ModuleSettings.tsx',
];

for (const component of heavyComponents) {
  const filePath = join(projectRoot, component);
  if (existsSync(filePath)) {
    let content = readFileSync(filePath, 'utf-8');
    if (!content.includes('next/dynamic') && content.includes('export default')) {
      // Check if it's a client component
      if (content.includes("'use client'")) {
        const dynamicImport = `import dynamic from 'next/dynamic';\n`;
        const originalExport = content.match(/export default function (\w+)/);
        if (originalExport) {
          const componentName = originalExport[1];
          const newExport = `const ${componentName} = dynamic(() => import('./${componentName}'), { ssr: false });\n\nexport default ${componentName};`;
          // For now, just add the import - full refactoring needs more context
          console.log(`  ??  Consider adding dynamic import to: ${component}`);
        }
      }
    }
  }
}

// 2. Check and update next.config.js for performance
const nextConfigPath = join(projectRoot, 'next.config.js');
if (existsSync(nextConfigPath)) {
  let config = readFileSync(nextConfigPath, 'utf-8');
  let modified = false;

  if (!config.includes('swcMinify')) {
    config = config.replace(/module.exports = \{/, `module.exports = {\n  swcMinify: true,`);
    modified = true;
  }

  if (!config.includes('compress')) {
    config = config.replace(/module.exports = \{/, `module.exports = {\n  compress: true,`);
    modified = true;
  }

  if (modified) {
    writeFileSync(nextConfigPath, config, 'utf-8');
    console.log('  ? Updated next.config.js for performance');
  }
}

// 3. Add revalidate to API routes
const apiRoutes = await glob('src/app/api/**/route.ts', { cwd: projectRoot });
let apiFixed = 0;

for (const route of apiRoutes.slice(0, 20)) {
  const filePath = join(projectRoot, route);
  try {
    let content = readFileSync(filePath, 'utf-8');
    if (!content.includes('export const revalidate') && content.includes('export async function GET')) {
      // Add revalidate before GET function
      content = content.replace(
        /export async function GET/g,
        'export const revalidate = 60;\n\nexport async function GET'
      );
      writeFileSync(filePath, content, 'utf-8');
      apiFixed++;
      if (apiFixed <= 5) {
        console.log(`  ? Added revalidate to: ${route}`);
      }
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary: Added revalidate to ${apiFixed} API routes\n`);
