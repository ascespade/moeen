#!/usr/bin/env node
// Script to validate the new project structure

const fs = require('fs');
const path = require('path');

// console.log('🔍 Validating project structure...\n');

const checks = [
  // Route groups
  { path: 'src/app/(auth)', description: 'Auth route group' },
  { path: 'src/app/(admin)', description: 'Admin route group' },
  { path: 'src/app/(health)', description: 'Health route group' },
  { path: 'src/app/(marketing)', description: 'Marketing route group' },
  { path: 'src/app/(info)', description: 'Info route group' },
  { path: 'src/app/(legal)', description: 'Legal route group' },

  // Layouts
  { path: 'src/app/(auth)/layout.tsx', description: 'Auth layout' },
  { path: 'src/app/(admin)/layout.tsx', description: 'Admin layout' },
  { path: 'src/app/(health)/layout.tsx', description: 'Health layout' },

  // Pages
  { path: 'src/app/(auth)/login/page.tsx', description: 'Login page' },
  { path: 'src/app/(admin)/dashboard/page.tsx', description: 'Dashboard page' },
  { path: 'src/app/(marketing)/features/page.tsx', description: 'Features page' },
  { path: 'src/app/(info)/about/page.tsx', description: 'About page' },
  { path: 'src/app/(legal)/privacy/page.tsx', description: 'Privacy page' },

  // Components
  { path: 'src/components/common/OptimizedImage.tsx', description: 'OptimizedImage component' },

  // Migrations
  { path: 'supabase/migrations/002_performance_indexes.sql', description: 'Performance indexes migration' },

  // Constants
  { path: 'src/constants/routes.ts', description: 'Routes constants' }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const fullPath = path.join(process.cwd(), check.path);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    // console.log(`✅ ${check.description}`
    passed++;
  } else {
    // console.log(`❌ ${check.description} - NOT FOUND: ${check.path}`
    failed++;
  }
});

// console.log(`\n📊 Results: ${passed} passed, ${failed} failed`

if (failed === 0) {
  // console.log('🎉 All structure validations passed!');
  process.exit(0);
} else {
  // console.log('⚠️  Some validations failed. Please review.');
  process.exit(1);
}
