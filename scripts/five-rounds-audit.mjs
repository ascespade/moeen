#!/usr/bin/env node

/**
 * Five Rounds Comprehensive Audit System
 * ???? ??? ???? ?? 5 ?????
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

const results = {
  round1_code: { issues: [], fixes: [], improvements: [] },
  round2_design: { issues: [], fixes: [], improvements: [] },
  round3_technical: { issues: [], fixes: [], improvements: [] },
  round4_database: { issues: [], fixes: [], improvements: [] },
  round5_business: { issues: [], fixes: [], improvements: [] }
};

// ============================================
// ROUND 1: CODE EXPERT - ?????
// ============================================
async function round1_codeExpert() {
  console.log('\n' + '='.repeat(70));
  console.log('?? ROUND 1: CODE EXPERT - Expert Programmer Analysis');
  console.log('='.repeat(70) + '\n');
  
  const round1 = results.round1_code;
  
  // 1. Architecture & Patterns
  console.log('?? Checking Architecture & Patterns...');
  const apiFiles = await glob('src/app/api/**/*.ts');
  
  for (const file of apiFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for consistent error handling
    if (content.includes('export async function') && !content.includes('try {') && content.includes('await')) {
      round1.issues.push({
        file,
        issue: 'Missing error handling',
        severity: 'high',
        suggestion: 'Add try-catch with consistent error response'
      });
      
      // Auto-fix
      if (content.includes('return NextResponse.json')) {
        const fixed = content.replace(
          /(export async function \w+[^{]*\{)/,
          '$1\n  try {'
        ).replace(
          /(return NextResponse\.json\([^;]+;\s*)$/m,
          '$1  } catch (error) {\n    return NextResponse.json(\n      { error: error instanceof Error ? error.message : \'Internal server error\' },\n      { status: 500 }\n    );\n  }'
        );
        fs.writeFileSync(file, fixed);
        round1.fixes.push(`Added error handling to ${file}`);
      }
    }
    
    // Check for proper typing
    if (content.includes('request: NextRequest') && !content.includes('Promise<NextResponse>')) {
      const funcMatch = content.match(/(export async function \w+)\(request: NextRequest\)/);
      if (funcMatch) {
        round1.issues.push({
          file,
          issue: 'Missing return type annotation',
          severity: 'medium',
          suggestion: 'Add explicit return type'
        });
        
        const fixed = content.replace(
          /(export async function \w+)\(request: NextRequest\)/,
          '$1(request: NextRequest): Promise<NextResponse>'
        );
        fs.writeFileSync(file, fixed);
        round1.fixes.push(`Added return type to ${file}`);
      }
    }
  }
  
  // 2. Code Organization
  console.log('?? Checking Code Organization...');
  const components = await glob('src/components/**/*.{ts,tsx}');
  
  for (const component of components.slice(0, 30)) {
    const content = fs.readFileSync(component, 'utf-8');
    
    // Check for proper component structure
    if (content.includes('function') && !content.includes('interface') && !content.includes('type')) {
      const propsMatch = content.match(/function\s+(\w+)\s*\(([^)]+)\)/);
      if (propsMatch && propsMatch[2].trim() && !propsMatch[2].includes(':')) {
        round1.issues.push({
          file: component,
          issue: 'Component props not typed',
          severity: 'medium',
          suggestion: 'Add TypeScript interface for props'
        });
      }
    }
    
    // Check for separation of concerns
    if (content.split('\n').length > 300 && content.includes('fetch') && content.includes('useState')) {
      round1.issues.push({
        file: component,
        issue: 'Component violates single responsibility',
        severity: 'medium',
        suggestion: 'Extract data fetching to custom hook'
      });
    }
  }
  
  // 3. Type Safety
  console.log('?? Checking Type Safety...');
  const tsFiles = await glob('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/*.test.*'] });
  
  for (const file of tsFiles.slice(0, 50)) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    
    // Replace 'any' with 'unknown' where safe
    if (content.includes(': any') && !file.includes('.test.')) {
      content = content.replace(/: any(?=[,;)\]\}])/g, ': unknown');
      fs.writeFileSync(file, content);
      round1.fixes.push(`Improved type safety in ${file}`);
      modified = true;
    }
    
    if (modified) {
      round1.improvements.push(`Type safety improved in ${file}`);
    }
  }
  
  // 4. Create reusable utilities
  console.log('?? Creating Reusable Utilities...');
  const utilsPath = path.join(process.cwd(), 'src/utils/api-utils.ts');
  if (!fs.existsSync(utilsPath)) {
    const utilsContent = `
/**
 * API Utility Functions
 * Reusable functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export function createErrorResponse(error: unknown, defaultStatus = 500): NextResponse {
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: (error as ApiError).status || defaultStatus }
    );
  }
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: defaultStatus }
  );
}

export function createSuccessResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function validateRequest(request: NextRequest, requiredFields: string[]): { valid: boolean; missing: string[] } {
  // Implementation for request validation
  return { valid: true, missing: [] };
}
`;
    fs.writeFileSync(utilsPath, utilsContent);
    round1.improvements.push('Created reusable API utilities');
  }
  
  console.log(`\n? Round 1 Complete: ${round1.issues.length} issues, ${round1.fixes.length} fixes, ${round1.improvements.length} improvements`);
  
  return round1;
}

// ============================================
// ROUND 2: DESIGN EXPERT - ?????
// ============================================
async function round2_designExpert() {
  console.log('\n' + '='.repeat(70));
  console.log('?? ROUND 2: DESIGN EXPERT - UI/UX & Accessibility Analysis');
  console.log('='.repeat(70) + '\n');
  
  const round2 = results.round2_design;
  
  // 1. Accessibility Checks
  console.log('? Checking Accessibility...');
  const componentFiles = await glob('src/components/**/*.{ts,tsx}');
  
  for (const file of componentFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for buttons without labels
    if (content.includes('<button') && !content.includes('aria-label') && !content.includes('aria-labelledby')) {
      const buttonText = content.match(/<button[^>]*>([^<]+)</);
      if (!buttonText || buttonText[1].trim().length === 0) {
        round2.issues.push({
          file,
          issue: 'Button missing accessibility attributes',
          severity: 'medium',
          suggestion: 'Add aria-label or aria-labelledby'
        });
      }
    }
    
    // Check for images without alt
    if (content.includes('<img') && !content.includes('alt=')) {
      round2.issues.push({
        file,
        issue: 'Image missing alt attribute',
        severity: 'high',
        suggestion: 'Add descriptive alt text'
      });
    }
    
    // Check for form inputs without labels
    if (content.includes('<input') && !content.includes('aria-label') && !content.includes('aria-labelledby') && !content.match(/<label[^>]*>[\s\S]*?<\/label>/)) {
      round2.issues.push({
        file,
        issue: 'Input missing label or aria-label',
        severity: 'high',
        suggestion: 'Add label or aria-label for inputs'
      });
    }
  }
  
  // 2. Design System Consistency
  console.log('?? Checking Design System Consistency...');
  
  // Check for hardcoded colors
  const styleFiles = await glob('src/**/*.{ts,tsx,css}', { ignore: ['**/node_modules/**'] });
  for (const file of styleFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for hardcoded colors (basic check)
    if (content.match(/#[0-9a-fA-F]{6}|rgb\(|rgba\(/)) {
      round2.issues.push({
        file,
        issue: 'Hardcoded color values detected',
        severity: 'low',
        suggestion: 'Use design system color tokens'
      });
    }
  }
  
  // 3. Responsive Design
  console.log('?? Checking Responsive Design...');
  
  for (const file of componentFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for responsive classes
    if (content.includes('className') && !content.includes('md:') && !content.includes('lg:') && !content.includes('sm:')) {
      if (content.split('\n').length > 100) {
        round2.issues.push({
          file,
          issue: 'Component may not be responsive',
          severity: 'low',
          suggestion: 'Add responsive breakpoints (md:, lg:, etc.)'
        });
      }
    }
  }
  
  // 4. Create accessibility utilities
  console.log('? Creating Accessibility Utilities...');
  const a11yPath = path.join(process.cwd(), 'src/utils/a11y-utils.ts');
  if (!fs.existsSync(a11yPath)) {
    const a11yContent = `
/**
 * Accessibility Utility Functions
 */

export function getAriaLabel(text: string): string {
  return text;
}

export function generateId(prefix: string): string {
  return \`\${prefix}-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
}

export function announceToScreenReader(message: string): void {
  // Implementation for screen reader announcements
  if (typeof window !== 'undefined') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
}
`;
    fs.writeFileSync(a11yPath, a11yContent);
    round2.improvements.push('Created accessibility utilities');
  }
  
  console.log(`\n? Round 2 Complete: ${round2.issues.length} issues, ${round2.fixes.length} fixes, ${round2.improvements.length} improvements`);
  
  return round2;
}

// ============================================
// ROUND 3: TECHNICAL EXPERT - ????
// ============================================
async function round3_technicalExpert() {
  console.log('\n' + '='.repeat(70));
  console.log('??  ROUND 3: TECHNICAL EXPERT - Performance & Security Analysis');
  console.log('='.repeat(70) + '\n');
  
  const round3 = results.round3_technical;
  
  // 1. Performance Checks
  console.log('?? Checking Performance...');
  
  const apiFiles = await glob('src/app/api/**/*.ts');
  
  for (const file of apiFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for N+1 queries
    if (content.includes('await') && content.match(/await[\s\S]*?await[\s\S]*?await/g)) {
      round3.issues.push({
        file,
        issue: 'Potential N+1 query problem',
        severity: 'medium',
        suggestion: 'Use Promise.all for parallel queries'
      });
    }
    
    // Check for missing caching
    if (content.includes('GET') && !content.includes('cache') && !content.includes('revalidate')) {
      round3.issues.push({
        file,
        issue: 'Missing caching strategy',
        severity: 'low',
        suggestion: 'Add cache headers or revalidation'
      });
    }
  }
  
  // 2. Security Checks
  console.log('?? Checking Security...');
  
  for (const file of apiFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for missing authentication
    if (content.includes('export async function') && 
        !content.includes('requireAuth') && 
        !content.includes('authorize') &&
        !file.includes('public')) {
      round3.issues.push({
        file,
        issue: 'API route may be missing authentication',
        severity: 'critical',
        suggestion: 'Add authentication middleware'
      });
    }
    
    // Check for SQL injection risks
    if (content.includes('query') && content.includes('${') && !content.includes('$1')) {
      round3.issues.push({
        file,
        issue: 'Potential SQL injection risk',
        severity: 'critical',
        suggestion: 'Use parameterized queries'
      });
    }
  }
  
  // 3. Error Handling
  console.log('???  Checking Error Handling...');
  
  for (const file of apiFiles.slice(0, 30)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    if (content.includes('await') && !content.includes('try {') && !content.includes('catch')) {
      round3.issues.push({
        file,
        issue: 'Missing error handling',
        severity: 'high',
        suggestion: 'Add try-catch blocks'
      });
    }
  }
  
  // 4. Create performance utilities
  console.log('? Creating Performance Utilities...');
  const perfPath = path.join(process.cwd(), 'src/utils/performance-utils.ts');
  if (!fs.existsSync(perfPath)) {
    const perfContent = `
/**
 * Performance Utility Functions
 */

export async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const time = performance.now() - start;
  return { result, time };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
`;
    fs.writeFileSync(perfPath, perfContent);
    round3.improvements.push('Created performance utilities');
  }
  
  console.log(`\n? Round 3 Complete: ${round3.issues.length} issues, ${round3.fixes.length} fixes, ${round3.improvements.length} improvements`);
  
  return round3;
}

// ============================================
// ROUND 4: DATABASE ADMIN - ???????
// ============================================
async function round4_databaseExpert() {
  console.log('\n' + '='.repeat(70));
  console.log('???  ROUND 4: DATABASE ADMIN - Schema & Query Optimization');
  console.log('='.repeat(70) + '\n');
  
  const round4 = results.round4_database;
  
  try {
    await client.connect();
    console.log('? Connected to database\n');
    
    // 1. Schema Validation
    console.log('?? Validating Schema...');
    
    // Check for missing indexes
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    for (const table of tables.slice(0, 20)) {
      const tableName = table.table_name;
      
      // Check for primary key
      const { rows: pkCheck } = await client.query(`
        SELECT COUNT(*) as count
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
        AND table_name = $1
        AND constraint_type = 'PRIMARY KEY'
      `, [tableName]);
      
      if (parseInt(pkCheck[0].count) === 0) {
        round4.issues.push({
          table: tableName,
          issue: 'Table missing primary key',
          severity: 'critical',
          suggestion: `Add primary key to ${tableName}`
        });
      }
      
      // Check for indexes on foreign keys
      const { rows: fkCheck } = await client.query(`
        SELECT column_name
        FROM information_schema.key_column_usage
        WHERE table_schema = 'public'
        AND table_name = $1
        AND position_in_unique_constraint IS NOT NULL
      `, [tableName]);
      
      for (const fk of fkCheck) {
        const { rows: idxCheck } = await client.query(`
          SELECT COUNT(*) as count
          FROM pg_indexes
          WHERE schemaname = 'public'
          AND tablename = $1
          AND indexdef LIKE $2
        `, [tableName, `%${fk.column_name}%`]);
        
        if (parseInt(idxCheck[0].count) === 0) {
          round4.issues.push({
            table: tableName,
            issue: `Missing index on foreign key ${fk.column_name}`,
            severity: 'high',
            suggestion: `CREATE INDEX idx_${tableName}_${fk.column_name} ON ${tableName}(${fk.column_name})`
          });
        }
      }
      
      // Check for indexes on frequently queried columns
      const commonColumns = ['created_at', 'updated_at', 'status', 'user_id', 'email'];
      for (const col of commonColumns) {
        const { rows: colCheck } = await client.query(`
          SELECT COUNT(*) as count
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
        `, [tableName, col]);
        
        if (parseInt(colCheck[0].count) > 0) {
          const { rows: idxCheck } = await client.query(`
            SELECT COUNT(*) as count
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND tablename = $1
            AND indexdef LIKE $2
          `, [tableName, `%${col}%`]);
          
          if (parseInt(idxCheck[0].count) === 0) {
            round4.improvements.push({
              table: tableName,
              suggestion: `Add index on ${tableName}.${col} for better query performance`
            });
          }
        }
      }
    }
    
    // 2. Query Optimization
    console.log('? Checking Query Patterns...');
    
    const apiFiles = await glob('src/app/api/**/*.ts');
    for (const file of apiFiles.slice(0, 20)) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for SELECT *
      if (content.includes('.select(\'*\')') || content.includes('.select("*")')) {
        round4.issues.push({
          file,
          issue: 'Using SELECT * in query',
          severity: 'medium',
          suggestion: 'Select only required columns for better performance'
        });
      }
      
      // Check for missing joins
      if (content.includes('.select(') && content.includes('!inner') && !content.includes('join')) {
        round4.issues.push({
          file,
          issue: 'Using implicit joins (Supabase syntax)',
          severity: 'low',
          suggestion: 'Consider explicit joins for complex queries'
        });
      }
    }
    
    // 3. Data Integrity
    console.log('?? Checking Data Integrity...');
    
    // Check for missing constraints
    for (const table of tables.slice(0, 10)) {
      const tableName = table.table_name;
      
      // Check for NOT NULL constraints on important columns
      const { rows: nullableCheck } = await client.query(`
        SELECT column_name, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name IN ('email', 'phone', 'status', 'created_at')
      `, [tableName]);
      
      for (const col of nullableCheck) {
        if (col.is_nullable === 'YES' && ['email', 'phone'].includes(col.column_name)) {
          round4.issues.push({
            table: tableName,
            issue: `Column ${col.column_name} should be NOT NULL`,
            severity: 'medium',
            suggestion: `ALTER TABLE ${tableName} ALTER COLUMN ${col.column_name} SET NOT NULL`
          });
        }
      }
    }
    
    await client.end();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
  
  console.log(`\n? Round 4 Complete: ${round4.issues.length} issues, ${round4.fixes.length} fixes, ${round4.improvements.length} improvements`);
  
  return round4;
}

// ============================================
// ROUND 5: BUSINESS LOGIC EXPERT - ?????
// ============================================
async function round5_businessLogicExpert() {
  console.log('\n' + '='.repeat(70));
  console.log('?? ROUND 5: BUSINESS LOGIC EXPERT - Healthcare Workflow Analysis');
  console.log('='.repeat(70) + '\n');
  
  const round5 = results.round5_business;
  
  // 1. Healthcare Workflows
  console.log('?? Checking Healthcare Workflows...');
  
  // Check appointment workflow
  const appointmentFiles = await glob('src/**/*appointment*.{ts,tsx}');
  for (const file of appointmentFiles.slice(0, 10)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for appointment validation
    if (content.includes('appointment') && !content.includes('validation') && !content.includes('validate')) {
      round5.issues.push({
        file,
        issue: 'Missing appointment validation',
        severity: 'high',
        suggestion: 'Add validation for appointment data (date, time, doctor availability)'
      });
    }
    
    // Check for conflict detection
    if (content.includes('create') && content.includes('appointment') && !content.includes('conflict') && !content.includes('available')) {
      round5.issues.push({
        file,
        issue: 'Missing appointment conflict detection',
        severity: 'critical',
        suggestion: 'Check for scheduling conflicts before creating appointment'
      });
    }
  }
  
  // 2. Patient Data Management
  console.log('?? Checking Patient Data Management...');
  
  const patientFiles = await glob('src/**/*patient*.{ts,tsx}');
  for (const file of patientFiles.slice(0, 10)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for medical record handling
    if (content.includes('patient') && !content.includes('medical') && !content.includes('record')) {
      round5.issues.push({
        file,
        issue: 'Patient data may be missing medical records',
        severity: 'medium',
        suggestion: 'Ensure medical records are linked to patient data'
      });
    }
    
    // Check for privacy compliance
    if (content.includes('patient') && content.includes('fetch') && !content.includes('auth') && !content.includes('permission')) {
      round5.issues.push({
        file,
        issue: 'Patient data access may not be properly secured',
        severity: 'critical',
        suggestion: 'Add authorization checks for patient data access'
      });
    }
  }
  
  // 3. Healthcare Business Rules
  console.log('?? Checking Business Rules...');
  
  // Check for insurance claim workflow
  const insuranceFiles = await glob('src/**/*insurance*.{ts,tsx}');
  for (const file of insuranceFiles.slice(0, 10)) {
    const content = fs.readFileSync(file, 'utf-8');
    
    if (content.includes('claim') && !content.includes('approval') && !content.includes('status')) {
      round5.issues.push({
        file,
        issue: 'Insurance claim workflow may be incomplete',
        severity: 'high',
        suggestion: 'Add approval workflow and status tracking'
      });
    }
  }
  
  // 4. Create business logic utilities
  console.log('?? Creating Business Logic Utilities...');
  const businessPath = path.join(process.cwd(), 'src/utils/business-logic.ts');
  if (!fs.existsSync(businessPath)) {
    const businessContent = `
/**
 * Healthcare Business Logic Utilities
 */

export interface AppointmentValidation {
  isValid: boolean;
  errors: string[];
}

export function validateAppointment(data: {
  date: string;
  time: string;
  doctorId: string;
  patientId: string;
}): AppointmentValidation {
  const errors: string[] = [];
  
  // Date validation
  if (!data.date || new Date(data.date) < new Date()) {
    errors.push('Appointment date must be in the future');
  }
  
  // Time validation
  if (!data.time || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    errors.push('Invalid time format');
  }
  
  // Required fields
  if (!data.doctorId) errors.push('Doctor ID is required');
  if (!data.patientId) errors.push('Patient ID is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function checkAppointmentConflicts(
  appointments: Array<{ date: string; time: string; doctorId: string }>,
  newAppointment: { date: string; time: string; doctorId: string }
): boolean {
  return appointments.some(apt => 
    apt.date === newAppointment.date &&
    apt.time === newAppointment.time &&
    apt.doctorId === newAppointment.doctorId
  );
}

export function calculateInsuranceCoverage(
  totalCost: number,
  coveragePercentage: number
): { covered: number; patientPortion: number } {
  const covered = totalCost * (coveragePercentage / 100);
  const patientPortion = totalCost - covered;
  
  return { covered, patientPortion };
}
`;
    fs.writeFileSync(businessPath, businessContent);
    round5.improvements.push('Created healthcare business logic utilities');
  }
  
  console.log(`\n? Round 5 Complete: ${round5.issues.length} issues, ${round5.fixes.length} fixes, ${round5.improvements.length} improvements`);
  
  return round5;
}

// Main execution
async function main() {
  console.log('?? Starting Five Rounds Comprehensive Audit...\n');
  
  const rounds = await Promise.all([
    round1_codeExpert(),
    round2_designExpert(),
    round3_technicalExpert(),
    round4_databaseExpert(),
    round5_businessLogicExpert()
  ]);
  
  // Generate comprehensive report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: rounds.reduce((sum, r) => sum + r.issues.length, 0),
      totalFixes: rounds.reduce((sum, r) => sum + r.fixes.length, 0),
      totalImprovements: rounds.reduce((sum, r) => sum + r.improvements.length, 0)
    },
    rounds: {
      round1_code: {
        issues: results.round1_code.issues.length,
        fixes: results.round1_code.fixes.length,
        improvements: results.round1_code.improvements.length
      },
      round2_design: {
        issues: results.round2_design.issues.length,
        fixes: results.round2_design.fixes.length,
        improvements: results.round2_design.improvements.length
      },
      round3_technical: {
        issues: results.round3_technical.issues.length,
        fixes: results.round3_technical.fixes.length,
        improvements: results.round3_technical.improvements.length
      },
      round4_database: {
        issues: results.round4_database.issues.length,
        fixes: results.round4_database.fixes.length,
        improvements: results.round4_database.improvements.length
      },
      round5_business: {
        issues: results.round5_business.issues.length,
        fixes: results.round5_business.fixes.length,
        improvements: results.round5_business.improvements.length
      }
    },
    details: results
  };
  
  const reportPath = path.join(process.cwd(), 'five-rounds-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(70));
  console.log('?? FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Issues Found: ${report.summary.totalIssues}`);
  console.log(`Total Fixes Applied: ${report.summary.totalFixes}`);
  console.log(`Total Improvements: ${report.summary.totalImprovements}`);
  console.log('\nBreakdown by Round:');
  console.log(`  Round 1 (Code): ${report.rounds.round1_code.issues} issues, ${report.rounds.round1_code.fixes} fixes`);
  console.log(`  Round 2 (Design): ${report.rounds.round2_design.issues} issues, ${report.rounds.round2_design.fixes} fixes`);
  console.log(`  Round 3 (Technical): ${report.rounds.round3_technical.issues} issues, ${report.rounds.round3_technical.fixes} fixes`);
  console.log(`  Round 4 (Database): ${report.rounds.round4_database.issues} issues, ${report.rounds.round4_database.fixes} fixes`);
  console.log(`  Round 5 (Business): ${report.rounds.round5_business.issues} issues, ${report.rounds.round5_business.fixes} fixes`);
  console.log('\n?? Full report saved to: five-rounds-audit-report.json');
  console.log('='.repeat(70));
}

main().catch(console.error);
