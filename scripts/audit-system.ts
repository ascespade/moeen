#!/usr/bin/env ts-node

/**
 * Comprehensive System Audit - تدقيق شامل للنظام
 * Verifies all APIs are real and connected to database
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface AuditResult {
  endpoint: string;
  file: string;
  status: 'REAL' | 'SIMULATED' | 'MIXED' | 'UNKNOWN';
  hasDatabase: boolean;
  hasSimulation: boolean;
  details: string[];
}

let suspiciousPatterns = [
  'setTimeout',
  'Promise.*resolve.*\\d+',
  'simulate',
  'mock.*=.*{',
  'fake',
  'dummy',
  'hardcoded',
  'test.*data.*=.*\\['
];

let databasePatterns = [
  'supabase',
  '\\.from\\(',
  '\\.insert\\(',
  '\\.update\\(',
  '\\.delete\\(',
  '\\.select\\(',
  '() => ({} as any)',
  'getServiceSupabase'
];

async function auditFile(filePath: string): Promise<AuditResult> {
  let content = fs.readFileSync(filePath, 'utf-8');
  let relativePath = path.relative(process.cwd(), filePath);

  // Extract endpoint name from path
  let endpointMatch = relativePath.match(/api\/(.+)\/route\.ts/);
  let endpoint = endpointMatch ? endpointMatch[1] : relativePath;

  const details: string[] = [];
  let hasSimulation = false;
  let hasDatabase = false;

  // Check for simulations
  for (const pattern of suspiciousPatterns) {
    let regex = new RegExp(pattern, 'gi');
    let matches = content.match(regex);
    if (matches) {
      hasSimulation = true;
      details.push(`⚠️  Found simulation: ${matches[0]}`
    }
  }

  // Check for database usage
  for (const pattern of databasePatterns) {
    let regex = new RegExp(pattern, 'gi');
    let matches = content.match(regex);
    if (matches) {
      hasDatabase = true;
      break;
    }
  }

  // Determine status
  let status: 'REAL' | 'SIMULATED' | 'MIXED' | 'UNKNOWN';
  if (hasDatabase && !hasSimulation) {
    status = 'REAL';
  } else if (hasSimulation && !hasDatabase) {
    status = 'SIMULATED';
  } else if (hasDatabase && hasSimulation) {
    status = 'MIXED';
  } else {
    status = 'UNKNOWN';
  }

  return {
    endpoint,
    file: relativePath,
    status,
    hasDatabase,
    hasSimulation,
    details
  };
}

async function main() {
  // console.log('🔍 Starting Comprehensive System Audit...\n');
  // console.log('=' .repeat(80));

  // Find all API route files
  let apiDir = path.join(process.cwd(), 'src/app/api');
  const files: string[] = [];

  function walkDir(dir: string) {
    let entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      let fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name === 'route.ts') {
        files.push(fullPath);
      }
    }
  }

  walkDir(apiDir);

  // console.log(`📁 Found ${files.length} API endpoints\n`

  const results: AuditResult[] = [];

  for (const file of files) {
    try {
      let result = await auditFile(file);
      results.push(result);
    } catch (error) {
      // console.error(`Error auditing ${file}:`
    }
  }

  // Categorize results
  let real = results.filter(r => r.status === 'REAL');
  let simulated = results.filter(r => r.status === 'SIMULATED');
  let mixed = results.filter(r => r.status === 'MIXED');
  let unknown = results.filter(r => r.status === 'UNKNOWN');

  // Print summary
  // console.log('\n' + '='.repeat(80));
  // console.log('📊 AUDIT SUMMARY');
  // console.log('='.repeat(80));
  // console.log(`✅ REAL (Connected to DB): ${real.length}`
  // console.log(`⚠️  SIMULATED (No DB): ${simulated.length}`
  // console.log(`🔀 MIXED (DB + Simulation): ${mixed.length}`
  // console.log(`❓ UNKNOWN: ${unknown.length}`
  // console.log(`📈 Total Endpoints: ${results.length}`
  // console.log(`🎯 Real Implementation Rate: ${Math.round((real.length / results.length) * 100)}%`

  // Print details for simulated endpoints
  if (simulated.length > 0) {
    // console.log('\n' + '='.repeat(80));
    // console.log('⚠️  SIMULATED ENDPOINTS (Need Database Integration)');
    // console.log('='.repeat(80));
    simulated.forEach(r => {
      // console.log(`\n📍 ${r.endpoint}`
      // console.log(`   File: ${r.file}`
      r.details.forEach(d => // console.log(`   ${d}`
    });
  }

  // Print details for mixed endpoints
  if (mixed.length > 0) {
    // console.log('\n' + '='.repeat(80));
    // console.log('🔀 MIXED ENDPOINTS (Have DB but also contain simulations)');
    // console.log('='.repeat(80));
    mixed.forEach(r => {
      // console.log(`\n📍 ${r.endpoint}`
      // console.log(`   File: ${r.file}`
      // console.log('   ✅ Has database connection');
      r.details.forEach(d => // console.log(`   ${d}`
    });
  }

  // Print critical auth endpoints
  // console.log('\n' + '='.repeat(80));
  // console.log('🔐 CRITICAL AUTHENTICATION ENDPOINTS');
  // console.log('='.repeat(80));

  let authEndpoints = results.filter(r => r.endpoint.includes('auth'));
  authEndpoints.forEach(r => {
    let icon = r.status === 'REAL' ? '✅' : r.status === 'MIXED' ? '⚠️' : '❌';
    // console.log(`${icon} ${r.endpoint.padEnd(30)} [${r.status}]`
  });

  // Save detailed report
  let reportPath = path.join(process.cwd(), 'SYSTEM_AUDIT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      real: real.length,
      simulated: simulated.length,
      mixed: mixed.length,
      unknown: unknown.length,
      realRate: Math.round((real.length / results.length) * 100)
    },
    endpoints: results
  }, null, 2));

  // console.log(`\n📄 Detailed report saved to: ${reportPath}`
  // console.log('\n' + '='.repeat(80));

  // Exit with error if too many simulated endpoints
  if (simulated.length > 5) {
    // console.log('❌ WARNING: Too many simulated endpoints found!');
    process.exit(1);
  } else {
    // console.log('✅ System audit completed successfully!');
    process.exit(0);
  }
}

main().catch(console.error);
