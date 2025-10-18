#!/usr/bin/env node
const fs = require('fs');

console.log('\n🔷 Fixing TypeScript Errors...\n');

// Fix 1: Supabase API routes - missing await/createClient
const apiFiles = [
  'src/app/api/sessions/available-slots/route.ts',
  'src/app/api/supervisor/call-request/route.ts'
];

for (const file of apiFiles) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Ensure import exists
    if (!content.includes('createClient')) {
      content = `import { createClient } from '@/lib/supabase/server';\n` + content;
    }
    
    // Fix: const supabase = createClient without ()
    content = content.replace(/const supabase\s*=\s*createClient(?!\()/g, 'const supabase = createClient()');
    
    // Fix missing await
    content = content.replace(/const supabase\s*=\s*createClient\(\);(?!\s*const)/g, 'const supabase = await createClient();');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`   ✅ ${file}`);
    }
  } catch (err) {
    console.log(`   ⚠️  ${file}`);
  }
}

// Fix 2: Auth module - remove missing exports
const authFile = 'src/lib/auth/index.ts';
try {
  let content = fs.readFileSync(authFile, 'utf8');
  const original = content;
  
  // Comment out missing exports
  content = content.replace(/export\s*{\s*requirePermission[^}]*}\s*from\s*['"]\.\/authorize['"];?/g, '// export { requirePermission } from "./authorize"; // Commented - not implemented');
  content = content.replace(/export\s*{\s*requireAdmin[^}]*}\s*from\s*['"]\.\/authorize['"];?/g, '// export { requireAdmin } from "./authorize"; // Commented - not implemented');
  content = content.replace(/export\s*{\s*AuthorizationCheck[^}]*}\s*from\s*['"]\.\/authorize['"];?/g, '// export { AuthorizationCheck } from "./authorize"; // Commented - not implemented');
  content = content.replace(/export\s*\*\s*from\s*['"]\.\/rbac['"];?/g, '// export * from "./rbac"; // Commented - not implemented');
  
  if (content !== original) {
    fs.writeFileSync(authFile, content);
    console.log(`\n   ✅ ${authFile}`);
  }
} catch (err) {
  console.log(`\n   ⚠️  ${authFile}`);
}

// Fix 3: Logger error calls
const loggerFiles = [
  'src/lib/database/connection-pool.ts',
  'src/lib/deployment/docker.ts',
  'src/lib/testing/test-utils.ts'
];

console.log('');
for (const file of loggerFiles) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Fix logger.error(error) → logger.error(String(error))
    content = content.replace(/logger\.error\(\s*error\s*\)/g, 'logger.error(error instanceof Error ? error.message : String(error))');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`   ✅ ${file}`);
    }
  } catch (err) {
    console.log(`   ⚠️  ${file}`);
  }
}

// Fix 4: Possibly undefined
const undefinedFiles = [
  {
    file: 'src/app/(admin)/admin/therapists/schedules/page.tsx',
    search: /schedules\.find/g,
    replace: 'schedules?.find'
  },
  {
    file: 'src/app/(admin)/settings/api-keys/page.tsx',
    search: /testResults\.find/g,
    replace: 'testResults?.find'
  },
  {
    file: 'src/app/api/sessions/available-slots/route.ts',
    search: /hours\s*\+\s*mins/g,
    replace: '(hours ?? 0) + (mins ?? 0)'
  }
];

console.log('');
for (const fix of undefinedFiles) {
  try {
    let content = fs.readFileSync(fix.file, 'utf8');
    const original = content;
    
    content = content.replace(fix.search, fix.replace);
    
    if (content !== original) {
      fs.writeFileSync(fix.file, content);
      console.log(`   ✅ ${fix.file}`);
    }
  } catch (err) {
    console.log(`   ⚠️  ${fix.file}`);
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n✅ TypeScript fixes applied!\n');
PYTHON
