#!/usr/bin/env node

/**
 * Code Quality Checks
 * ?????? ???? ?????
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

async function runChecks() {
  console.log('?? Running code quality checks...\n');

  const checks = [
    { name: 'Linting', command: 'npm run lint:check' },
    { name: 'Type Checking', command: 'npm run type:check' },
    { name: 'Build', command: 'npm run build' },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      await execAsync(check.command);
      console.log(`? ${check.name}: Passed`);
      passed++;
    } catch (error) {
      console.error(`? ${check.name}: Failed`);
      failed++;
    }
  }

  console.log(`\n?? Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

runChecks();
