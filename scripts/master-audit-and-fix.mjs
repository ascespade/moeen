#!/usr/bin/env node

/**
 * Master Audit and Fix System
 * ?????? ??????? ????? ????????
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMasterAudit() {
  console.log('?? Starting Master Audit and Fix System...\n');
  
  const steps = [
    { name: 'Comprehensive Audit', command: 'npm run audit:comprehensive' },
    { name: 'Comprehensive Fix', command: 'npm run fix:comprehensive' },
    { name: 'Quality Check', command: 'npm run quality:check' },
    { name: 'Build Check', command: 'npm run build' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const step of steps) {
    console.log(`\n?? ${step.name}...`);
    try {
      await execAsync(step.command, { maxBuffer: 1024 * 1024 * 10 });
      console.log(`? ${step.name}: Passed`);
      passed++;
    } catch (error) {
      console.error(`? ${step.name}: Failed`);
      console.error(error.message);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('?? FINAL SUMMARY');
  console.log('='.repeat(60));
  console.log(`? Passed: ${passed}`);
  console.log(`? Failed: ${failed}`);
  console.log('='.repeat(60));
  
  if (failed === 0) {
    console.log('\n?? All checks passed! Project is stable.');
  } else {
    console.log('\n??  Some checks failed. Please review and fix.');
    process.exit(1);
  }
}

runMasterAudit();
