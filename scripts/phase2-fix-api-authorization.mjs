#!/usr/bin/env node
/**
 * Phase 2: Automated API Authorization Fix Script
 * إصلاح تلقائي لإضافة Authorization إلى جميع API Routes
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = join(__dirname, '..');

// Find all API route files
function findRouteFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      findRouteFiles(fullPath, files);
    } else if (entry.isFile() && entry.name === 'route.ts') {
      files.push(fullPath);
    }
  }

  return files;
}

const apiDir = join(workspaceRoot, 'src/app/api');
const routeFiles = findRouteFiles(apiDir);

console.log(`Found ${routeFiles.length} API route files`);

// Routes that should be public (no auth required)
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/health',
  '/api/test/health',
];

// Routes that need special handling
const specialRoutes = ['/api/contact', '/api/webhooks'];

let fixedCount = 0;
let skippedCount = 0;
let alreadyHasAuth = 0;

routeFiles.forEach(file => {
  const relativePath = file.replace(workspaceRoot, '');
  const routePath = relativePath
    .replace('/src/app', '')
    .replace('/route.ts', '');

  // Skip public routes
  if (publicRoutes.some(publicRoute => routePath.includes(publicRoute))) {
    skippedCount++;
    return;
  }

  // Skip webhooks (they use signature verification)
  if (routePath.includes('/webhooks/')) {
    skippedCount++;
    return;
  }

  const content = readFileSync(file, 'utf-8');

  // Check if already has authorization
  if (content.includes('requireAuth') || content.includes('authorize(')) {
    alreadyHasAuth++;
    return;
  }

  // Check if has HTTP methods
  const hasGET = content.includes('export async function GET');
  const hasPOST = content.includes('export async function POST');
  const hasPUT = content.includes('export async function PUT');
  const hasDELETE = content.includes('export async function DELETE');
  const hasPATCH = content.includes('export async function PATCH');

  if (!hasGET && !hasPOST && !hasPUT && !hasDELETE && !hasPATCH) {
    return;
  }

  // Determine required roles based on route path
  let requiredRoles = ['admin'];
  if (routePath.includes('/admin/')) {
    requiredRoles = ['admin', 'supervisor'];
  } else if (routePath.includes('/patients/')) {
    requiredRoles = ['admin', 'doctor', 'staff', 'supervisor'];
  } else if (routePath.includes('/doctors/')) {
    requiredRoles = ['admin', 'doctor', 'staff', 'supervisor'];
  } else if (routePath.includes('/appointments/')) {
    requiredRoles = ['admin', 'doctor', 'staff', 'supervisor', 'patient'];
  } else if (routePath.includes('/medical-records/')) {
    requiredRoles = ['admin', 'doctor', 'staff', 'supervisor'];
  }

  // Add imports if missing
  let newContent = content;

  if (!content.includes('import { requireAuth }')) {
    // Find last import statement
    const importRegex = /^import .+$/gm;
    const imports = content.match(importRegex) || [];
    const lastImportIndex = content.lastIndexOf(
      imports[imports.length - 1] || ''
    );

    if (lastImportIndex >= 0) {
      const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
      const importStatement = `import { requireAuth } from '@/lib/auth/authorize';\n`;
      newContent =
        content.slice(0, insertIndex) +
        importStatement +
        content.slice(insertIndex);
    } else {
      newContent =
        `import { requireAuth } from '@/lib/auth/authorize';\n\n` + content;
    }
  }

  // Add authorization to GET
  if (
    hasGET &&
    !content.includes('requireAuth') &&
    !content.match(/export async function GET[\s\S]*?requireAuth/)
  ) {
    const getMatch = content.match(/export async function GET\(([^)]*)\)\s*{/);
    if (getMatch) {
      const beforeGet = newContent.substring(
        0,
        getMatch.index + getMatch[0].length
      );
      const afterGet = newContent.substring(
        getMatch.index + getMatch[0].length
      );

      const authCode = `
  try {
    // Security: Require authentication
    const authResult = await requireAuth(${JSON.stringify(requiredRoles)})(${getMatch[1] || 'request'});
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
`;

      newContent = beforeGet + authCode + afterGet;
    }
  }

  // Add authorization to POST
  if (
    hasPOST &&
    !content.includes('requireAuth') &&
    !content.match(/export async function POST[\s\S]*?requireAuth/)
  ) {
    const postMatch = content.match(
      /export async function POST\(([^)]*)\)\s*{/
    );
    if (postMatch) {
      const beforePost = newContent.substring(
        0,
        postMatch.index + postMatch[0].length
      );
      const afterPost = newContent.substring(
        postMatch.index + postMatch[0].length
      );

      const authCode = `
  try {
    // Security: Require authentication
    const authResult = await requireAuth(${JSON.stringify(requiredRoles)})(${postMatch[1] || 'request'});
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
`;

      newContent = beforePost + authCode + afterPost;
    }
  }

  // Only write if we made changes
  if (newContent !== content) {
    writeFileSync(file, newContent, 'utf-8');
    fixedCount++;
    console.log(`✅ Fixed: ${routePath}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Fixed: ${fixedCount}`);
console.log(`   Already has auth: ${alreadyHasAuth}`);
console.log(`   Skipped (public): ${skippedCount}`);
console.log(`   Total: ${routeFiles.length}`);
