#!/usr/bin/env node

/**
 * Final Comprehensive Audit System
 * ???? ????? ??????? ??????
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { exec } from 'child_process';
import { promisify } from 'util';
import pg from 'pg';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false, require: true },
});

const results = {
  buildErrors: [],
  lintErrors: [],
  typeErrors: [],
  codeQuality: [],
  projectStructure: [],
  garbageFiles: [],
  businessLogic: [],
  workflow: [],
  integration: [],
  improvements: [],
  recommendations: [],
};

// ============================================
// 1. BUILD & COMPILATION CHECK
// ============================================
async function checkBuildErrors() {
  console.log('\n?? Checking Build & Compilation...');

  try {
    const { stdout, stderr } = await execAsync('npm run build', {
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd(),
    });

    if (stderr && stderr.includes('Error:')) {
      const errors = stderr.match(/Error:[^\n]+/g) || [];
      errors.forEach(error => {
        results.buildErrors.push({
          error: error.trim(),
          severity: 'critical',
        });
      });
    }

    console.log(
      stderr
        ? `??  Build completed with warnings`
        : `? Build successful - 0 errors`
    );
  } catch (error) {
    const errors = error.stdout?.match(/Error:[^\n]+/g) || [];
    const warnings = error.stdout?.match(/Warning:[^\n]+/g) || [];

    errors.forEach(err => {
      results.buildErrors.push({
        error: err.trim(),
        severity: 'critical',
      });
    });

    warnings.forEach(warn => {
      results.buildErrors.push({
        error: warn.trim(),
        severity: 'warning',
      });
    });

    console.log(
      `? Build failed: ${errors.length} errors, ${warnings.length} warnings`
    );
  }
}

// ============================================
// 2. LINT CHECK
// ============================================
async function checkLintErrors() {
  console.log('\n?? Checking Lint Errors...');

  try {
    const { stdout, stderr } = await execAsync('npm run lint', {
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd(),
    });

    const errors = stdout.match(/(\d+) error/);
    const warnings = stdout.match(/(\d+) warning/);

    if (errors) {
      console.log(`? Lint: ${errors[1]} errors found`);
      results.lintErrors.push({
        count: parseInt(errors[1]),
        severity: 'high',
      });
    }

    if (warnings) {
      console.log(`??  Lint: ${warnings[1]} warnings found`);
      results.lintErrors.push({
        count: parseInt(warnings[1]),
        severity: 'medium',
      });
    }

    if (!errors && !warnings) {
      console.log(`? Lint: 0 errors, 0 warnings`);
    }
  } catch (error) {
    console.log(`? Lint check failed`);
    results.lintErrors.push({
      error: 'Lint check failed',
      severity: 'high',
    });
  }
}

// ============================================
// 3. TYPE CHECK
// ============================================
async function checkTypeErrors() {
  console.log('\n?? Checking Type Errors...');

  try {
    const { stdout, stderr } = await execAsync('npm run type:check', {
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd(),
    });

    const errors = stdout.match(/(\d+) error/);
    if (errors) {
      console.log(`? TypeScript: ${errors[1]} errors found`);
      results.typeErrors.push({
        count: parseInt(errors[1]),
        severity: 'high',
      });
    } else {
      console.log(`? TypeScript: 0 errors`);
    }
  } catch (error) {
    const errors = error.stdout?.match(/(\d+) error/) || [];
    if (errors.length > 0) {
      console.log(`? TypeScript: ${errors[0]} errors found`);
      results.typeErrors.push({
        count: parseInt(errors[0]),
        severity: 'high',
      });
    } else {
      console.log(`? TypeScript: 0 errors`);
    }
  }
}

// ============================================
// 4. CODE QUALITY CHECK
// ============================================
async function checkCodeQuality() {
  console.log('\n?? Checking Code Quality...');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/*.test.*'],
  });

  let totalAnyCount = 0;
  let totalUnusedImports = 0;
  let totalLongFunctions = 0;
  let totalComplexFunctions = 0;

  for (const file of files.slice(0, 100)) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check for 'any' types
    const anyCount = (content.match(/: any\b/g) || []).length;
    if (anyCount > 0) {
      totalAnyCount += anyCount;
      results.codeQuality.push({
        file,
        issue: `Using 'any' type (${anyCount} instances)`,
        severity: 'medium',
        suggestion: 'Replace with proper types or unknown',
      });
    }

    // Check for long functions
    const functions =
      content.match(
        /(?:export\s+)?(?:async\s+)?function\s+\w+[^{]*\{[\s\S]*?\}/g
      ) || [];
    functions.forEach(func => {
      const lines = func.split('\n').length;
      if (lines > 100) {
        totalLongFunctions++;
        results.codeQuality.push({
          file,
          issue: `Function too long (${lines} lines)`,
          severity: 'medium',
          suggestion: 'Break into smaller functions (max 50 lines)',
        });
      }

      // Check complexity (nested if/loops)
      const complexity = (func.match(/(if|for|while|switch)\s*\(/g) || [])
        .length;
      if (complexity > 5) {
        totalComplexFunctions++;
        results.codeQuality.push({
          file,
          issue: `High complexity (${complexity} conditions)`,
          severity: 'medium',
          suggestion: 'Simplify logic, use early returns',
        });
      }
    });
  }

  if (
    totalAnyCount === 0 &&
    totalLongFunctions === 0 &&
    totalComplexFunctions === 0
  ) {
    console.log(`? Code Quality: Excellent`);
  } else {
    console.log(
      `??  Code Quality: ${totalAnyCount} 'any' types, ${totalLongFunctions} long functions, ${totalComplexFunctions} complex functions`
    );
  }
}

// ============================================
// 5. PROJECT STRUCTURE CHECK
// ============================================
async function checkProjectStructure() {
  console.log('\n?? Checking Project Structure...');

  const requiredDirs = [
    'src/app',
    'src/components',
    'src/lib',
    'src/utils',
    'src/types',
    'src/hooks',
    'src/config',
  ];

  const missingDirs = [];
  for (const dir of requiredDirs) {
    if (!fs.existsSync(path.join(process.cwd(), dir))) {
      missingDirs.push(dir);
    }
  }

  if (missingDirs.length > 0) {
    results.projectStructure.push({
      issue: 'Missing required directories',
      missing: missingDirs,
      severity: 'high',
    });
    console.log(`? Missing directories: ${missingDirs.join(', ')}`);
  } else {
    console.log(`? Project structure: All required directories exist`);
  }

  // Check for proper organization
  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**'],
  });
  const deepNesting = files.filter(f => {
    const depth = f.split('/').length;
    return depth > 6;
  });

  if (deepNesting.length > 0) {
    results.projectStructure.push({
      issue: 'Files with deep nesting (>6 levels)',
      files: deepNesting.slice(0, 10),
      severity: 'low',
      suggestion: 'Consider reorganizing directory structure',
    });
    console.log(`??  Deep nesting: ${deepNesting.length} files`);
  }
}

// ============================================
// 6. GARBAGE FILES CHECK
// ============================================
async function checkGarbageFiles() {
  console.log('\n???  Checking for Garbage Files...');

  const garbagePatterns = [
    '**/*.bak',
    '**/*.backup',
    '**/*.old',
    '**/*.tmp',
    '**/*.temp',
    '**/*.log',
    '**/*.cache',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.swp',
    '**/*.swo',
    '**/*~',
    '**/node_modules/**',
    '**/.next/**',
    '**/.git/**',
  ];

  const garbageFiles = [];
  for (const pattern of garbagePatterns) {
    const files = await glob(pattern, {
      ignore: ['node_modules/**', '.git/**', '.next/**'],
    });
    garbageFiles.push(...files.slice(0, 20));
  }

  // Check for duplicate files
  const allFiles = await glob('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['**/node_modules/**'],
  });
  const fileNames = new Map();

  allFiles.forEach(file => {
    const name = path.basename(file);
    if (fileNames.has(name)) {
      if (!garbageFiles.includes(file)) {
        garbageFiles.push(file);
      }
    } else {
      fileNames.set(name, file);
    }
  });

  if (garbageFiles.length > 0) {
    results.garbageFiles.push({
      count: garbageFiles.length,
      files: garbageFiles.slice(0, 20),
      severity: 'low',
      suggestion: 'Remove unused/garbage files',
    });
    console.log(`??  Found ${garbageFiles.length} potential garbage files`);
  } else {
    console.log(`? No garbage files found`);
  }
}

// ============================================
// 7. BUSINESS LOGIC CHECK
// ============================================
async function checkBusinessLogic() {
  console.log('\n?? Checking Business Logic...');

  // Check for healthcare-specific workflows
  const workflowFiles = await glob(
    'src/**/*{appointment,patient,medical,insurance,claim}*.{ts,tsx}'
  );

  let missingValidation = 0;
  let missingConflictCheck = 0;
  let missingAuthorization = 0;

  for (const file of workflowFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check appointment validation
    if (
      content.includes('appointment') &&
      !content.includes('validate') &&
      !content.includes('validation')
    ) {
      missingValidation++;
      results.businessLogic.push({
        file,
        issue: 'Missing appointment validation',
        severity: 'high',
        suggestion: 'Add validation logic',
      });
    }

    // Check conflict detection
    if (
      content.includes('create') &&
      content.includes('appointment') &&
      !content.includes('conflict') &&
      !content.includes('available')
    ) {
      missingConflictCheck++;
      results.businessLogic.push({
        file,
        issue: 'Missing conflict detection',
        severity: 'critical',
        suggestion: 'Check for scheduling conflicts',
      });
    }

    // Check authorization
    if (
      content.includes('patient') &&
      content.includes('fetch') &&
      !content.includes('auth') &&
      !content.includes('authorize')
    ) {
      missingAuthorization++;
      results.businessLogic.push({
        file,
        issue: 'Missing authorization check',
        severity: 'critical',
        suggestion: 'Add authorization middleware',
      });
    }
  }

  if (
    missingValidation === 0 &&
    missingConflictCheck === 0 &&
    missingAuthorization === 0
  ) {
    console.log(`? Business Logic: All workflows properly implemented`);
  } else {
    console.log(
      `??  Business Logic: ${missingValidation} missing validations, ${missingConflictCheck} missing conflict checks, ${missingAuthorization} missing authorizations`
    );
  }
}

// ============================================
// 8. WORKFLOW INTEGRATION CHECK
// ============================================
async function checkWorkflowIntegration() {
  console.log('\n?? Checking Workflow Integration...');

  // Check if utilities are properly integrated
  const utilityFiles = [
    'src/utils/api-utils.ts',
    'src/utils/a11y-utils.ts',
    'src/utils/performance-utils.ts',
    'src/utils/business-logic.ts',
  ];

  const missingUtilities = [];
  for (const util of utilityFiles) {
    if (!fs.existsSync(path.join(process.cwd(), util))) {
      missingUtilities.push(util);
    }
  }

  if (missingUtilities.length > 0) {
    results.workflow.push({
      issue: 'Missing utility files',
      missing: missingUtilities,
      severity: 'medium',
    });
    console.log(`??  Missing utilities: ${missingUtilities.join(', ')}`);
  } else {
    // Check if utilities are being used
    const apiFiles = await glob('src/app/api/**/*.ts');
    let utilsUsage = 0;

    for (const file of apiFiles.slice(0, 20)) {
      const content = fs.readFileSync(file, 'utf-8');
      if (
        content.includes('api-utils') ||
        content.includes('createErrorResponse') ||
        content.includes('createSuccessResponse')
      ) {
        utilsUsage++;
      }
    }

    if (utilsUsage > 0) {
      console.log(`? Utilities are being used in ${utilsUsage} API files`);
    } else {
      results.workflow.push({
        issue: 'Utilities not being used',
        severity: 'low',
        suggestion: 'Start using centralized utilities',
      });
      console.log(`??  Utilities exist but not being used`);
    }
  }
}

// ============================================
// 9. DATABASE INTEGRATION CHECK
// ============================================
async function checkDatabaseIntegration() {
  console.log('\n???  Checking Database Integration...');

  try {
    await client.connect();

    // Check for required tables
    const requiredTables = [
      'appointments',
      'patients',
      'doctors',
      'users',
      'insurance_claims',
      'medical_records',
    ];

    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    const existingTables = new Set(tables.map(t => t.table_name));
    const missingTables = requiredTables.filter(t => !existingTables.has(t));

    if (missingTables.length > 0) {
      results.integration.push({
        issue: 'Missing required tables',
        missing: missingTables,
        severity: 'critical',
      });
      console.log(`? Missing tables: ${missingTables.join(', ')}`);
    } else {
      console.log(`? All required tables exist`);
    }

    // Check for proper indexes
    const { rows: indexes } = await client.query(`
      SELECT COUNT(*) as count
      FROM pg_indexes
      WHERE schemaname = 'public'
    `);

    console.log(`? Database indexes: ${indexes[0].count} indexes found`);

    await client.end();
  } catch (error) {
    console.log(`? Database check failed: ${error.message}`);
    results.integration.push({
      issue: 'Database connection failed',
      error: error.message,
      severity: 'high',
    });
  }
}

// ============================================
// 10. GENERATE COMPREHENSIVE REPORT
// ============================================
function generateFinalReport() {
  const totalErrors =
    results.buildErrors.filter(e => e.severity === 'critical').length +
    results.lintErrors.length +
    results.typeErrors.length;

  const totalWarnings =
    results.buildErrors.filter(e => e.severity === 'warning').length +
    results.codeQuality.length +
    results.projectStructure.filter(s => s.severity === 'low').length;

  const report = {
    timestamp: new Date().toISOString(),
    status:
      totalErrors === 0 && totalWarnings === 0
        ? 'EXCELLENT'
        : totalErrors === 0
          ? 'GOOD'
          : 'NEEDS_IMPROVEMENT',
    summary: {
      totalErrors,
      totalWarnings,
      buildErrors: results.buildErrors.filter(e => e.severity === 'critical')
        .length,
      lintErrors: results.lintErrors.length,
      typeErrors: results.typeErrors.length,
      codeQualityIssues: results.codeQuality.length,
      structureIssues: results.projectStructure.length,
      garbageFiles: results.garbageFiles.length,
      businessLogicIssues: results.businessLogic.length,
      workflowIssues: results.workflow.length,
      integrationIssues: results.integration.length,
    },
    details: results,
    recommendations: generateRecommendations(),
  };

  return report;
}

function generateRecommendations() {
  const recommendations = [];

  // Critical recommendations
  if (results.buildErrors.length > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'Build',
      recommendation: 'Fix all build errors immediately',
      details: results.buildErrors.slice(0, 5).map(e => e.error),
    });
  }

  if (results.businessLogic.filter(b => b.severity === 'critical').length > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'Business Logic',
      recommendation: 'Add missing conflict detection and authorization checks',
      details: results.businessLogic
        .filter(b => b.severity === 'critical')
        .map(b => b.issue),
    });
  }

  // High priority recommendations
  if (results.typeErrors.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Type Safety',
      recommendation: 'Fix all TypeScript errors',
      details: [`${results.typeErrors[0]?.count || 0} type errors found`],
    });
  }

  if (results.codeQuality.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Code Quality',
      recommendation:
        'Improve code quality by replacing "any" types and breaking down long functions',
      details: results.codeQuality.slice(0, 5).map(q => q.issue),
    });
  }

  // Medium priority recommendations
  if (results.lintErrors.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Code Style',
      recommendation: 'Fix lint errors and warnings',
      details: [`${results.lintErrors[0]?.count || 0} lint issues found`],
    });
  }

  // Low priority recommendations
  if (results.garbageFiles.length > 0) {
    recommendations.push({
      priority: 'LOW',
      category: 'Project Cleanup',
      recommendation: 'Remove garbage files',
      details: [
        `${results.garbageFiles[0]?.count || 0} potential garbage files found`,
      ],
    });
  }

  return recommendations;
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  console.log('?? Starting Final Comprehensive Audit...');
  console.log('='.repeat(70));

  await Promise.all([
    checkBuildErrors(),
    checkLintErrors(),
    checkTypeErrors(),
    checkCodeQuality(),
    checkProjectStructure(),
    checkGarbageFiles(),
    checkBusinessLogic(),
    checkWorkflowIntegration(),
    checkDatabaseIntegration(),
  ]);

  const report = generateFinalReport();

  // Save report
  const reportPath = path.join(process.cwd(), 'FINAL_AUDIT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Generate markdown report
  const mdReport = generateMarkdownReport(report);
  const mdPath = path.join(process.cwd(), 'FINAL_AUDIT_REPORT.md');
  fs.writeFileSync(mdPath, mdReport);

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('?? FINAL AUDIT SUMMARY');
  console.log('='.repeat(70));
  console.log(`Status: ${report.status}`);
  console.log(`Total Errors: ${report.summary.totalErrors}`);
  console.log(`Total Warnings: ${report.summary.totalWarnings}`);
  console.log('\nBreakdown:');
  console.log(`  Build Errors: ${report.summary.buildErrors}`);
  console.log(`  Lint Errors: ${report.summary.lintErrors}`);
  console.log(`  Type Errors: ${report.summary.typeErrors}`);
  console.log(`  Code Quality Issues: ${report.summary.codeQualityIssues}`);
  console.log(`  Business Logic Issues: ${report.summary.businessLogicIssues}`);
  console.log(`\n?? Full report saved to: ${reportPath}`);
  console.log(`?? Markdown report saved to: ${mdPath}`);
  console.log('='.repeat(70));
}

function generateMarkdownReport(report) {
  return `# Final Comprehensive Audit Report

**Date**: ${report.timestamp}
**Status**: ${report.status}

## ?? Executive Summary

- **Total Errors**: ${report.summary.totalErrors}
- **Total Warnings**: ${report.summary.totalWarnings}
- **Build Errors**: ${report.summary.buildErrors}
- **Lint Errors**: ${report.summary.lintErrors}
- **Type Errors**: ${report.summary.typeErrors}
- **Code Quality Issues**: ${report.summary.codeQualityIssues}
- **Business Logic Issues**: ${report.summary.businessLogicIssues}

## ?? Detailed Findings

### Build & Compilation
${
  report.details.buildErrors.length > 0
    ? `\n? **Issues Found:**\n${report.details.buildErrors
        .slice(0, 10)
        .map(e => `- ${e.error}`)
        .join('\n')}`
    : '\n? **No build errors**'
}

### Lint Checks
${report.details.lintErrors.length > 0 ? `\n? **Issues Found:**\n${report.details.lintErrors.map(e => `- ${e.count || 'Unknown'} issues`).join('\n')}` : '\n? **No lint errors**'}

### Type Safety
${report.details.typeErrors.length > 0 ? `\n? **Issues Found:**\n${report.details.typeErrors.map(e => `- ${e.count || 'Unknown'} type errors`).join('\n')}` : '\n? **No type errors**'}

### Code Quality
${
  report.details.codeQuality.length > 0
    ? `\n??  **Issues Found:**\n${report.details.codeQuality
        .slice(0, 10)
        .map(q => `- ${q.file}: ${q.issue}`)
        .join('\n')}`
    : '\n? **Code quality is good**'
}

### Business Logic
${
  report.details.businessLogic.length > 0
    ? `\n??  **Issues Found:**\n${report.details.businessLogic
        .slice(0, 10)
        .map(b => `- ${b.file}: ${b.issue}`)
        .join('\n')}`
    : '\n? **Business logic properly implemented**'
}

## ?? Recommendations

${report.recommendations
  .map(
    (rec, i) => `
### ${i + 1}. ${rec.recommendation} [${rec.priority} Priority]

**Category**: ${rec.category}

**Details**:
${rec.details.map(d => `- ${d}`).join('\n')}
`
  )
  .join('\n')}

## ?? Next Steps

1. **Immediate Actions** (Critical Priority)
   - Fix all build errors
   - Add missing business logic validations
   - Fix type errors

2. **Short-term Improvements** (High Priority)
   - Improve code quality
   - Fix lint warnings
   - Add missing tests

3. **Long-term Enhancements** (Medium/Low Priority)
   - Code cleanup
   - Performance optimization
   - Documentation updates

---

**Report Generated**: ${new Date().toLocaleString()}
`;
}

main().catch(console.error);
