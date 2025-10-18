#!/usr/bin/env node
/**
 * 🚨 Critical Fix - إصلاح الأخطاء الحرجة التي تمنع البناء
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n🚨 Critical Fix Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP = 'tmp/backup-critical-' + Date.now();
execSync(`mkdir -p ${BACKUP} && cp -r src ${BACKUP}/`, { stdio: 'pipe' });
console.log('✅ Backup created\n');

let fixed = 0;

// Fix 1: admin/dashboard/page.tsx - array syntax
const dashPath = 'src/app/(admin)/admin/dashboard/page.tsx';
if (fs.existsSync(dashPath)) {
  let dash = fs.readFileSync(dashPath, 'utf8');
  
  // Fix: mockRecentActivities should start with [{
  if (dash.includes('const mockRecentActivities: RecentActivity[] = [') && 
      dash.includes('    id: "1",')) {
    // Array starts but first element doesn't have {
    dash = dash.replace(
      /(const mockRecentActivities: RecentActivity\[\] = \[)\s*id: "/g,
      '$1\n  {\n    id: "'
    );
    
    // Add closing } for each element
    const lines = dash.split('\n');
    const newLines = [];
    let inArray = false;
    let needsClosing = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('const mockRecentActivities')) {
        inArray = true;
      }
      
      if (inArray && line.trim().startsWith('id:')) {
        needsClosing = true;
      }
      
      if (inArray && needsClosing && line.trim().startsWith('}')) {
        needsClosing = false;
      }
      
      if (inArray && needsClosing && i + 1 < lines.length && 
          (lines[i+1].trim().startsWith('id:') || lines[i+1].includes('];'))) {
        newLines.push(line);
        newLines.push('  },');
        needsClosing = false;
        continue;
      }
      
      newLines.push(line);
    }
    
    dash = newLines.join('\n');
    fs.writeFileSync(dashPath, dash);
    console.log('✅ Fixed admin/dashboard/page.tsx - array syntax');
    fixed++;
  }
}

// Fix 2: admin/payments/invoices/page.tsx - missing "use client"
const invoicesPath = 'src/app/(admin)/admin/payments/invoices/page.tsx';
if (fs.existsSync(invoicesPath)) {
  let invoices = fs.readFileSync(invoicesPath, 'utf8');
  
  if (!invoices.trimStart().startsWith('"use client"') && 
      !invoices.trimStart().startsWith("'use client'")) {
    invoices = '"use client";\n\n' + invoices;
    fs.writeFileSync(invoicesPath, invoices);
    console.log('✅ Fixed admin/payments/invoices/page.tsx - added "use client"');
    fixed++;
  }
}

// Fix 3: admin/audit-logs/page.tsx - array syntax
const auditPath = 'src/app/(admin)/admin/audit-logs/page.tsx';
if (fs.existsSync(auditPath)) {
  let audit = fs.readFileSync(auditPath, 'utf8');
  
  if (audit.includes('const mockAuditLogs: AuditLog[] = [') && 
      audit.includes('    id: "1",')) {
    // Same fix as dashboard
    const lines = audit.split('\n');
    const newLines = [];
    let inArray = false;
    let needsClosing = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('const mockAuditLogs')) {
        inArray = true;
        newLines.push(line);
        if (i + 1 < lines.length && lines[i+1].trim().startsWith('id:')) {
          newLines.push('  {');
          needsClosing = true;
        }
        continue;
      }
      
      if (inArray && needsClosing && 
          (lines[i+1]?.trim().startsWith('id:') || lines[i+1]?.includes('];'))) {
        newLines.push(line);
        newLines.push('  },');
        if (lines[i+1]?.trim().startsWith('id:')) {
          newLines.push('  {');
        } else {
          needsClosing = false;
        }
        continue;
      }
      
      newLines.push(line);
    }
    
    audit = newLines.join('\n');
    fs.writeFileSync(auditPath, audit);
    console.log('✅ Fixed admin/audit-logs/page.tsx - array syntax');
    fixed++;
  }
}

console.log(`\n✅ Fixed ${fixed} critical files\n`);

// Verify
console.log('🧪 Verifying build...\n');
try {
  execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
  console.log('✅ Build SUCCESS!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎉 المشروع شغال!\n');
  process.exit(0);
} catch (err) {
  console.log('⚠️  Build still has issues\n');
  const errors = (err.stdout || '').toString().match(/Error:/g) || [];
  console.log(`   ${errors.length} errors remaining\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}
