#!/usr/bin/env node

/**
 * Comprehensive Project Audit System
 * ???? ??? ???? ???????
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { glob } from 'glob';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const dbUrl = process.env.DATABASE_URL || 
  'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false, require: true }
});

const issues = {
  code: [],
  database: [],
  tests: [],
  structure: [],
  performance: [],
  security: []
};

const improvements = [];

// Run audits in parallel
async function runParallelAudits() {
  console.log('?? Starting Comprehensive Audit...\n');
  
  const audits = [
    auditCodeStructure(),
    auditDatabase(),
    auditMockData(),
    auditDuplication(),
    auditComplexity(),
    auditSecurity(),
    auditTests(),
    auditApiRoutes(),
    auditComponents(),
    auditTypes()
  ];

  await Promise.all(audits);
}

// 1. Audit Code Structure
async function auditCodeStructure() {
  console.log('?? Auditing code structure...');
  
  try {
    // Check for missing imports
    const tsFiles = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**'] });
    
    for (const file of tsFiles.slice(0, 50)) { // Sample check
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for relative imports more than 2 levels
      const relativeImports = content.match(/from ['"]\.\.\/\.\.\/\.\./g);
      if (relativeImports) {
        issues.structure.push({
          file,
          issue: 'Deep relative imports (>2 levels)',
          severity: 'medium',
          suggestion: 'Use path aliases (@/...) instead'
        });
      }
      
      // Check for unused imports (basic check)
      const imports = content.match(/^import .+ from ['"](.+)['"];?/gm) || [];
      const usedImports = imports.filter(imp => {
        const module = imp.match(/from ['"](.+)['"]/)?.[1];
        if (!module) return true;
        if (module.startsWith('@/')) return true;
        
        // Simple check if imported items are used
        const importedItems = imp.match(/import\s+\{([^}]+)\}/)?.[1]?.split(',').map(i => i.trim());
        if (importedItems) {
          return importedItems.some(item => content.includes(item));
        }
        return true;
      });
    }
  } catch (error) {
    console.error('Error auditing code structure:', error.message);
  }
}

// 2. Audit Database
async function auditDatabase() {
  console.log('???  Auditing database...');
  
  try {
    await client.connect();
    
    // Check for missing tables referenced in code
    const apiFiles = await glob('src/app/api/**/*.ts');
    const tableReferences = new Set();
    
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const tableMatches = content.match(/\.from\(['"]([a-z_]+)['"]\)/g) || [];
      tableMatches.forEach(match => {
        const table = match.match(/['"]([a-z_]+)['"]/)?.[1];
        if (table) tableReferences.add(table);
      });
    }
    
    // Check if tables exist
    const { rows: tables } = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    const existingTables = new Set(tables.map(t => t.table_name));
    
    for (const table of tableReferences) {
      if (!existingTables.has(table)) {
        issues.database.push({
          issue: `Table '${table}' referenced in code but doesn't exist`,
          severity: 'high',
          suggestion: 'Create the table or fix the reference'
        });
      }
    }
    
    // Check for missing indexes on frequently queried columns
    const { rows: columns } = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND column_name IN ('user_id', 'created_at', 'status', 'email')
    `);
    
    for (const col of columns) {
      const { rows: indexes } = await client.query(`
        SELECT COUNT(*) as count 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = $1 
        AND indexdef LIKE $2
      `, [col.table_name, `%${col.column_name}%`]);
      
      if (parseInt(indexes[0].count) === 0) {
        improvements.push({
          type: 'index',
          table: col.table_name,
          column: col.column_name,
          suggestion: `Add index on ${col.table_name}.${col.column_name}`
        });
      }
    }
    
    await client.end();
  } catch (error) {
    console.error('Error auditing database:', error.message);
  }
}

// 3. Audit Mock Data
async function auditMockData() {
  console.log('?? Auditing for mock data...');
  
  try {
    const files = await glob('src/**/*.{ts,tsx,js,jsx}', { ignore: ['**/node_modules/**', '**/__tests__/**'] });
    
    const mockPatterns = [
      /mock|fake|dummy|placeholder|test.*data|sample.*data/i,
      /const.*=.*\[.*\{.*name.*:.*['"]/,
      /hardcoded|static.*data/
    ];
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        for (const pattern of mockPatterns) {
          if (pattern.test(line) && !line.includes('//') && !line.includes('*')) {
            // Check if it's actually mock data
            if (line.includes('const') && (
              line.includes('[]') || 
              line.includes('[{') ||
              line.match(/\{.*:\s*['"]/)
            )) {
              issues.code.push({
                file,
                line: index + 1,
                issue: 'Potential mock/hardcoded data',
                severity: 'high',
                suggestion: 'Replace with real database query'
              });
            }
          }
        }
      });
      
      // Check for empty arrays being used as data
      if (content.includes('= []') && !content.includes('useState') && !content.includes('useQuery')) {
        const matches = content.match(/(const|let|var)\s+\w+\s*=\s*\[\]/g);
        if (matches && matches.length > 0) {
          improvements.push({
            type: 'data',
            file,
            suggestion: 'Consider initializing with actual data or loading state'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error auditing mock data:', error.message);
  }
}

// 4. Audit Duplication
async function auditDuplication() {
  console.log('?? Auditing for duplication...');
  
  try {
    const files = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**'] });
    const codeBlocks = new Map();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Extract function definitions
      const functions = content.match(/(?:export\s+)?(?:async\s+)?function\s+\w+[^{]*\{[^}]*\}/gs) || [];
      
      functions.forEach((func, index) => {
        const normalized = func.replace(/\s+/g, ' ').replace(/\w+/g, 'VAR');
        const hash = normalized.length + normalized.slice(0, 50);
        
        if (codeBlocks.has(hash)) {
          const existing = codeBlocks.get(hash);
          if (existing.file !== file) {
            issues.code.push({
              file,
              issue: 'Duplicate code block detected',
              severity: 'medium',
              suggestion: `Extract to shared utility. Similar code found in ${existing.file}`
            });
          }
        } else {
          codeBlocks.set(hash, { file, index });
        }
      });
    }
  } catch (error) {
    console.error('Error auditing duplication:', error.message);
  }
}

// 5. Audit Complexity
async function auditComplexity() {
  console.log('?? Auditing code complexity...');
  
  try {
    const files = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/*.test.*'] });
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check function length
      const functions = content.match(/(?:export\s+)?(?:async\s+)?function\s+\w+[^{]*\{([\s\S]*?)\}/g) || [];
      
      functions.forEach((func) => {
        const lines = func.split('\n').length;
        if (lines > 100) {
          issues.code.push({
            file,
            issue: `Function too long (${lines} lines)`,
            severity: 'medium',
            suggestion: 'Break down into smaller functions'
          });
        }
        
        // Check nesting depth
        let maxDepth = 0;
        let currentDepth = 0;
        for (const char of func) {
          if (char === '{') currentDepth++;
          if (char === '}') currentDepth--;
          maxDepth = Math.max(maxDepth, currentDepth);
        }
        
        if (maxDepth > 5) {
          issues.code.push({
            file,
            issue: `High nesting depth (${maxDepth} levels)`,
            severity: 'medium',
            suggestion: 'Simplify logic, use early returns'
          });
        }
      });
      
      // Check file size
      if (content.split('\n').length > 500) {
        issues.structure.push({
          file,
          issue: 'File too large (>500 lines)',
          severity: 'low',
          suggestion: 'Consider splitting into smaller modules'
        });
      }
    }
  } catch (error) {
    console.error('Error auditing complexity:', error.message);
  }
}

// 6. Audit Security
async function auditSecurity() {
  console.log('?? Auditing security...');
  
  try {
    const apiFiles = await glob('src/app/api/**/*.ts');
    
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for missing authentication
      if (content.includes('export async function') && 
          !content.includes('requireAuth') && 
          !content.includes('GET') && 
          !file.includes('public')) {
        issues.security.push({
          file,
          issue: 'API route may be missing authentication',
          severity: 'high',
          suggestion: 'Add requireAuth middleware'
        });
      }
      
      // Check for SQL injection risks
      if (content.includes('query') && content.includes('${') && !content.includes('$1')) {
        const sqlInterpolation = content.match(/\$\{[^}]+\}/g);
        if (sqlInterpolation) {
          issues.security.push({
            file,
            issue: 'Potential SQL injection risk',
            severity: 'critical',
            suggestion: 'Use parameterized queries ($1, $2, etc.)'
          });
        }
      }
      
      // Check for exposed secrets
      const secretPatterns = [
        /password\s*=\s*['"][^'"]+['"]/i,
        /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
        /secret\s*=\s*['"][^'"]+['"]/i
      ];
      
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          issues.security.push({
            file,
            issue: 'Potential hardcoded secret',
            severity: 'critical',
            suggestion: 'Move to environment variables'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error auditing security:', error.message);
  }
}

// 7. Audit Tests
async function auditTests() {
  console.log('?? Auditing tests...');
  
  try {
    const testFiles = await glob('**/*.{test,spec}.{ts,tsx,js,jsx}', { ignore: ['**/node_modules/**'] });
    const sourceFiles = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*'] });
    
    const testedFiles = new Set();
    testFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const imports = content.match(/from ['"]([^'"]+)['"]/g) || [];
      imports.forEach(imp => {
        const path = imp.match(/['"]([^'"]+)['"]/)?.[1];
        if (path && path.startsWith('@/')) {
          testedFiles.add(path.replace('@/', 'src/'));
        }
      });
    });
    
    const coverage = (testedFiles.size / sourceFiles.length) * 100;
    
    if (coverage < 50) {
      issues.tests.push({
        issue: `Low test coverage (${coverage.toFixed(1)}%)`,
        severity: 'medium',
        suggestion: 'Add more test files'
      });
    }
  } catch (error) {
    console.error('Error auditing tests:', error.message);
  }
}

// 8. Audit API Routes
async function auditApiRoutes() {
  console.log('?? Auditing API routes...');
  
  try {
    const apiFiles = await glob('src/app/api/**/route.ts');
    
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for proper error handling
      if (!content.includes('try') && content.includes('await')) {
        issues.code.push({
          file,
          issue: 'Missing error handling',
          severity: 'medium',
          suggestion: 'Add try-catch blocks'
        });
      }
      
      // Check for response consistency
      const hasGet = content.includes('export async function GET');
      const hasPost = content.includes('export async function POST');
      
      if (hasGet && !hasPost && content.includes('request.json()')) {
        issues.code.push({
          file,
          issue: 'Using request.json() in GET handler',
          severity: 'low',
          suggestion: 'GET requests should not read body'
        });
      }
    }
  } catch (error) {
    console.error('Error auditing API routes:', error.message);
  }
}

// 9. Audit Components
async function auditComponents() {
  console.log('?? Auditing components...');
  
  try {
    const componentFiles = await glob('src/components/**/*.{tsx,ts}', { ignore: ['**/node_modules/**'] });
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for prop types
      if (content.includes('interface Props') || content.includes('type Props')) {
        // Good
      } else if (content.includes('export') && content.includes('function')) {
        const params = content.match(/function\s+\w+\s*\(([^)]+)\)/);
        if (params && params[1].trim() && !params[1].includes(':')) {
          issues.code.push({
            file,
            issue: 'Component props not typed',
            severity: 'medium',
            suggestion: 'Add TypeScript types for props'
          });
        }
      }
      
      // Check for accessibility
      if (content.includes('<button') && !content.includes('aria-') && !content.includes('onClick')) {
        issues.code.push({
          file,
          issue: 'Button missing accessibility attributes',
          severity: 'low',
          suggestion: 'Add aria-label or aria-labelledby'
        });
      }
    }
  } catch (error) {
    console.error('Error auditing components:', error.message);
  }
}

// 10. Audit Types
async function auditTypes() {
  console.log('?? Auditing TypeScript types...');
  
  try {
    const tsFiles = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**'] });
    
    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for any types
      if (content.includes(': any') && !file.includes('.test.')) {
        issues.code.push({
          file,
          issue: 'Usage of "any" type',
          severity: 'medium',
          suggestion: 'Replace with proper TypeScript types'
        });
      }
      
      // Check for missing return types
      const functions = content.match(/(?:export\s+)?(?:async\s+)?function\s+\w+[^{]*\{/g) || [];
      functions.forEach(func => {
        if (!func.includes(':') && !func.includes('void') && !func.includes('Promise')) {
          issues.code.push({
            file,
            issue: 'Function missing return type',
            severity: 'low',
            suggestion: 'Add explicit return type'
          });
        }
      });
    }
  } catch (error) {
    console.error('Error auditing types:', error.message);
  }
}

// Generate Report
async function generateReport() {
  console.log('\n?? Generating Report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: Object.values(issues).flat().length,
      bySeverity: {
        critical: Object.values(issues).flat().filter(i => i.severity === 'critical').length,
        high: Object.values(issues).flat().filter(i => i.severity === 'high').length,
        medium: Object.values(issues).flat().filter(i => i.severity === 'medium').length,
        low: Object.values(issues).flat().filter(i => i.severity === 'low').length
      }
    },
    issues,
    improvements
  };
  
  const reportPath = path.join(process.cwd(), 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('='.repeat(60));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Issues: ${report.summary.totalIssues}`);
  console.log(`  - Critical: ${report.summary.bySeverity.critical}`);
  console.log(`  - High: ${report.summary.bySeverity.high}`);
  console.log(`  - Medium: ${report.summary.bySeverity.medium}`);
  console.log(`  - Low: ${report.summary.bySeverity.low}`);
  console.log(`\nImprovements: ${improvements.length}`);
  console.log(`\nFull report saved to: ${reportPath}`);
  console.log('='.repeat(60));
  
  return report;
}

// Main execution
async function main() {
  try {
    await runParallelAudits();
    const report = await generateReport();
    
    // Exit with error code if critical issues found
    if (report.summary.bySeverity.critical > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

main();
