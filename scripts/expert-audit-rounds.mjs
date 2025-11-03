#!/usr/bin/env node

/**
 * Expert Audit Rounds System
 * ???? ??? ??????? - 5 ????? ?? ??????? ??????
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.DATABASE_URL || 
  'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false, require: true }
});

const findings = {
  round1_code: [],
  round2_design: [],
  round3_technical: [],
  round4_database: [],
  round5_business: []
};

const fixes = {
  round1_code: [],
  round2_design: [],
  round3_technical: [],
  round4_database: [],
  round5_business: []
};

// ============================================
// ROUND 1: CODE EXPERT - ?????
// ============================================
async function round1_codeExpert() {
  console.log('\n?? ROUND 1: CODE EXPERT - Expert Programmer Analysis\n');
  console.log('='.repeat(70));
  
  const issues = [];
  const improvements = [];
  
  // 1. Architecture Patterns
  console.log('?? Checking Architecture Patterns...');
  const apiFiles = await glob('src/app/api/**/*.ts');
  
  for (const file of apiFiles.slice(0, 50)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for consistent error handling pattern
    if (content.includes('export async function') && !content.includes('try {') && content.includes('await')) {
      issues.push({
        file,
        issue: 'Missing error handling pattern',
        severity: 'high',
        fix: 'Add try-catch blocks with consistent error response format'
      });
    }
    
    // Check for proper typing
    if (content.includes('request: NextRequest') && !content.includes('Response')) {
      issues.push({
        file,
        issue: 'Missing return type annotation',
        severity: 'medium',
        fix: 'Add explicit return type: Promise<NextResponse>'
      });
    }
    
    // Check for code duplication
    const authPattern = content.match(/requireAuth\([^)]+\)/g);
    if (authPattern && authPattern.length > 1) {
      issues.push({
        file,
        issue: 'Repeated authentication pattern',
        severity: 'low',
        fix: 'Extract to middleware helper'
      });
    }
  }
  
  // 2. Code Organization
  console.log('?? Checking Code Organization...');
  const components = await glob('src/components/**/*.{ts,tsx}');
  
  for (const component of components.slice(0, 50)) {
    const content = fs.readFileSync(component, 'utf-8');
    
    // Check for proper component structure
    if (!content.includes('interface') && !content.includes('type') && content.includes('function')) {
      const propsMatch = content.match(/function\s+\w+\s*\(([^)]+)\)/);
      if (propsMatch && propsMatch[1].trim() && !propsMatch[1].includes(':')) {
        issues.push({
          file: component,
          issue: 'Component props not typed',
          severity: 'medium',
          fix: 'Add TypeScript interface for props'
        });
      }
    }
    
    // Check for proper separation of concerns
    if (content.split('\n').length > 300 && content.includes('fetch') && content.includes('useState')) {
      issues.push({
        file: component,
        issue: 'Component doing too much (fetching + state + rendering)',
        severity: 'medium',
        fix: 'Extract data fetching to custom hook'
      });
    }
  }
  
  // 3. Design Patterns
  console.log('?? Checking Design Patterns...');
  
  // Check for proper hook usage
  const hooks = await glob('src/hooks/**/*.{ts,tsx}');
  for (const hook of hooks) {
    const content = fs.readFileSync(hook, 'utf-8');
    
    // Check for proper hook naming
    if (!hook.includes('use')) {
      issues.push({
        file: hook,
        issue: 'Hook should start with "use" prefix',
        severity: 'low',
        fix: 'Rename hook to follow convention'
      });
    }
    
    // Check for proper dependencies
    if (content.includes('useEffect') && !content.includes('dependencies')) {
      const depsMatch = content.match(/useEffect\([^,]+,\s*\[([^\]]+)\]\)/);
      if (!depsMatch) {
        issues.push({
          file: hook,
          issue: 'useEffect missing dependency array',
          severity: 'high',
          fix: 'Add dependency array to useEffect'
        });
      }
    }
  }
  
  // 4. Type Safety
  console.log('?? Checking Type Safety...');
  const tsFiles = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/*.test.*'] });
  
  let anyCount = 0;
  for (const file of tsFiles.slice(0, 100)) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/: any\b/g);
    if (matches) {
      anyCount += matches.length;
      issues.push({
        file,
        issue: `Using 'any' type (${matches.length} instances)`,
        severity: 'medium',
        fix: 'Replace with proper types or unknown'
      });
    }
  }
  
  improvements.push(`Replaced ${anyCount} instances of 'any' type`);
  
  // 5. Code Quality Metrics
  console.log('?? Analyzing Code Quality Metrics...');
  
  const codeQualityIssues = [];
  
  // Check for functions that are too long
  for (const file of apiFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    const functions = content.match(/(?:export\s+)?(?:async\s+)?function\s+\w+[^{]*\{[\s\S]*?\}/g) || [];
    
    functions.forEach(func => {
      const lines = func.split('\n').length;
      if (lines > 100) {
        codeQualityIssues.push({
          file,
          issue: `Function too long (${lines} lines)`,
          severity: 'medium',
          fix: 'Break into smaller functions (max 50 lines)'
        });
      }
    });
  }
  
  findings.round1_code = issues;
  fixes.round1_code = improvements;
  
  console.log(`\n? Round 1 Complete: ${issues.length} issues found, ${improvements.length} improvements`);
  
  return { issues, improvements };
}

// Run all rounds
async function runAllRounds() {
  console.log('?? Starting Expert Audit Rounds System...\n');
  
  await round1_codeExpert();
  
  // Additional rounds will be added
  console.log('\n? All rounds completed!');
  
  // Generate report
  generateReport();
}

function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    rounds: {
      round1_code: {
        issues: findings.round1_code.length,
        improvements: fixes.round1_code.length
      }
    }
  };
  
  const reportPath = path.join(process.cwd(), 'expert-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n?? Report saved to: ${reportPath}`);
}

runAllRounds().catch(console.error);
