#!/usr/bin/env node

/**
 * Add revalidate to API routes
 * ????? revalidate ?? API routes
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Adding revalidate to API routes...\n');

const apiRoutes = await glob('src/app/api/**/route.ts', { cwd: projectRoot });
let fixedCount = 0;

for (const route of apiRoutes) {
  const filePath = join(projectRoot, route);
  try {
    let content = readFileSync(filePath, 'utf-8');

    // Skip if already has revalidate
    if (content.includes('export const revalidate')) continue;

    // Only add to GET routes
    if (!content.includes('export async function GET')) continue;

    // Add revalidate before GET function
    content = content.replace(
      /export async function GET/g,
      'export const revalidate = 60;\n\nexport async function GET'
    );

    writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
    if (fixedCount <= 10) {
      console.log(`  ? Added revalidate to: ${route}`);
    }
  } catch (error) {
    // Skip
  }
}

console.log(`\n?? Summary: Added revalidate to ${fixedCount} API routes\n`);
