#!/usr/bin/env node

/**
 * Apply Workflows and Permissions System
 * ????? ???? ????????? ??????????
 *
 * This script applies all workflows and permissions to the system
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Applying Workflows and Permissions System...\n');

// Check if permissions.ts exists
const permissionsPath = join(projectRoot, 'src/lib/permissions.ts');
if (!existsSync(permissionsPath)) {
  console.error('? permissions.ts not found!');
  process.exit(1);
}

// Check if workflows/index.ts exists
const workflowsPath = join(projectRoot, 'src/lib/workflows/index.ts');
if (!existsSync(workflowsPath)) {
  console.error('? workflows/index.ts not found!');
  process.exit(1);
}

console.log('? Permissions system found');
console.log('? Workflows system found');

// List of API routes that need permission checks
const apiRoutesToUpdate = [
  'src/app/api/patients/route.ts',
  'src/app/api/doctors/route.ts',
  'src/app/api/appointments/route.ts',
  'src/app/api/sessions/route.ts',
  'src/app/api/payments/process/route.ts',
  'src/app/api/prescriptions/route.ts',
  'src/app/api/medical-records/route.ts',
];

console.log('\n?? Checking API routes...');

let updatedCount = 0;
let skippedCount = 0;

for (const routePath of apiRoutesToUpdate) {
  const fullPath = join(projectRoot, routePath);

  if (!existsSync(fullPath)) {
    console.log(`??  Skipping ${routePath} (not found)`);
    skippedCount++;
    continue;
  }

  try {
    let content = readFileSync(fullPath, 'utf-8');
    let modified = false;

    // Check if PermissionManager is already imported
    if (!content.includes('PermissionManager')) {
      // Add import if not present
      if (content.includes('import { authorize }')) {
        content = content.replace(
          "import { authorize } from '@/lib/auth/authorize';",
          "import { authorize } from '@/lib/auth/authorize';\nimport { PermissionManager } from '@/lib/permissions';"
        );
        modified = true;
      } else if (content.includes('import { requireAuth }')) {
        content = content.replace(
          "import { requireAuth } from '@/lib/auth/authorize';",
          "import { requireAuth } from '@/lib/auth/authorize';\nimport { PermissionManager } from '@/lib/permissions';"
        );
        modified = true;
      }
    }

    // Add permission check for GET endpoints
    if (
      content.includes('export async function GET') &&
      !content.includes('PermissionManager.hasPermission')
    ) {
      // Find the GET function and add permission check after auth check
      const getFunctionRegex =
        /export async function GET\([^)]*\)[^{]*\{[^}]*try[^{]*\{/s;
      const match = content.match(getFunctionRegex);

      if (match) {
        // Add permission check after auth
        const authCheck = content.match(
          /const.*auth.*=.*await.*authorize|requireAuth/s
        );
        if (authCheck) {
          // Find the position after auth check
          const authIndex = content.indexOf(authCheck[0]);
          const afterAuth = content.substring(authIndex);
          const nextBrace = afterAuth.indexOf('}');

          if (nextBrace > 0) {
            const insertPoint = authIndex + nextBrace + 1;
            const permissionCheck = `
    
    // Check permissions using PermissionManager
    const canRead = PermissionManager.hasPermission(
      user.role as any,
      '${routePath.split('/').pop()?.replace('.ts', '') || 'resource'}',
      'read',
      { userId: user.id }
    );

    if (!canRead) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
`;
            content =
              content.substring(0, insertPoint) +
              permissionCheck +
              content.substring(insertPoint);
            modified = true;
          }
        }
      }
    }

    // Add permission check for POST endpoints
    if (
      content.includes('export async function POST') &&
      !content.includes('PermissionManager.hasPermission')
    ) {
      const postFunctionRegex =
        /export async function POST\([^)]*\)[^{]*\{[^}]*try[^{]*\{/s;
      const match = content.match(postFunctionRegex);

      if (match) {
        const authCheck = content.match(
          /const.*auth.*=.*await.*authorize|requireAuth/s
        );
        if (authCheck) {
          const authIndex = content.indexOf(authCheck[0]);
          const afterAuth = content.substring(authIndex);
          const nextBrace = afterAuth.indexOf('}');

          if (nextBrace > 0) {
            const insertPoint = authIndex + nextBrace + 1;
            const permissionCheck = `
    
    // Check permissions using PermissionManager
    const canCreate = PermissionManager.hasPermission(
      user.role as any,
      '${routePath.split('/').pop()?.replace('.ts', '') || 'resource'}',
      'create',
      { userId: user.id }
    );

    if (!canCreate) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
`;
            content =
              content.substring(0, insertPoint) +
              permissionCheck +
              content.substring(insertPoint);
            modified = true;
          }
        }
      }
    }

    if (modified) {
      writeFileSync(fullPath, content, 'utf-8');
      console.log(`? Updated ${routePath}`);
      updatedCount++;
    } else {
      console.log(
        `??  Skipped ${routePath} (already has permissions or no auth)`
      );
      skippedCount++;
    }
  } catch (error) {
    console.error(`? Error updating ${routePath}:`, error.message);
  }
}

// List of pages that need UnifiedProtectedRoute
const pagesToUpdate = [
  'src/app/(doctor)/doctor-dashboard/page.tsx',
  'src/app/(patient)/patient-dashboard/page.tsx',
  'src/app/(staff)/staff-dashboard/page.tsx',
  'src/app/(supervisor)/supervisor-dashboard/page.tsx',
];

console.log('\n?? Checking pages...');

for (const pagePath of pagesToUpdate) {
  const fullPath = join(projectRoot, pagePath);

  if (!existsSync(fullPath)) {
    console.log(`??  Skipping ${pagePath} (not found)`);
    skippedCount++;
    continue;
  }

  try {
    let content = readFileSync(fullPath, 'utf-8');
    let modified = false;

    // Check if UnifiedProtectedRoute is already imported
    if (!content.includes('UnifiedProtectedRoute')) {
      // Add import
      if (content.includes("'use client';")) {
        content = content.replace(
          "'use client';",
          "'use client';\n\nimport UnifiedProtectedRoute from '@/components/auth/UnifiedProtectedRoute';"
        );
        modified = true;
      } else if (content.includes('import')) {
        const firstImport = content.match(/^import.*$/m);
        if (firstImport) {
          content = content.replace(
            firstImport[0],
            firstImport[0] +
              "\nimport UnifiedProtectedRoute from '@/components/auth/UnifiedProtectedRoute';"
          );
          modified = true;
        }
      }
    }

    // Determine allowed roles based on page path
    let allowedRoles = ['admin'];
    if (pagePath.includes('doctor')) {
      allowedRoles = ['doctor', 'therapist'];
    } else if (pagePath.includes('patient')) {
      allowedRoles = ['patient'];
    } else if (pagePath.includes('staff')) {
      allowedRoles = ['staff', 'nurse'];
    } else if (pagePath.includes('supervisor')) {
      allowedRoles = ['supervisor', 'admin'];
    }

    // Wrap the main return with UnifiedProtectedRoute
    if (!content.includes('<UnifiedProtectedRoute')) {
      const exportDefaultMatch = content.match(
        /export default function[^{]*\{[\s\S]*?return\s*\(/
      );
      if (exportDefaultMatch) {
        const returnIndex = content.indexOf('return (');
        if (returnIndex > 0) {
          const returnContent = content.substring(returnIndex);
          const openingTag = `    <UnifiedProtectedRoute allowedRoles={[${allowedRoles.map(r => `'${r}'`).join(', ')}]}>\n`;
          const closingTag = '\n    </UnifiedProtectedRoute>';

          // Find the closing of the return statement
          let braceCount = 0;
          let closingIndex = returnIndex;
          for (let i = returnIndex; i < content.length; i++) {
            if (content[i] === '(') braceCount++;
            if (content[i] === ')') {
              braceCount--;
              if (braceCount === 0) {
                closingIndex = i + 1;
                break;
              }
            }
          }

          content =
            content.substring(0, returnIndex + 8) +
            openingTag +
            content.substring(returnIndex + 8, closingIndex).trim() +
            closingTag +
            content.substring(closingIndex);
          modified = true;
        }
      }
    }

    if (modified) {
      writeFileSync(fullPath, content, 'utf-8');
      console.log(`? Updated ${pagePath}`);
      updatedCount++;
    } else {
      console.log(`??  Skipped ${pagePath} (already protected)`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`? Error updating ${pagePath}:`, error.message);
  }
}

console.log('\n?? Summary:');
console.log(`   ? Updated: ${updatedCount} files`);
console.log(`   ??  Skipped: ${skippedCount} files`);
console.log('\n? Workflows and Permissions System Applied!');
