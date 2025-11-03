#!/usr/bin/env node

/**
 * Future Issue Prevention System
 * ???? ??? ??????? ??????????
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create git hooks
async function setupGitHooks() {
  console.log('?? Setting up Git hooks...');
  
  const hooksDir = path.join(process.cwd(), '.git/hooks');
  
  if (!fs.existsSync(hooksDir)) {
    console.log('  ??  .git/hooks directory not found');
    return;
  }
  
  // Pre-commit hook
  const preCommitHook = `#!/bin/sh
# Pre-commit hook to prevent common issues

echo "?? Running pre-commit checks..."

# Run linting
npm run lint:check
if [ $? -ne 0 ]; then
  echo "? Linting failed. Please fix errors before committing."
  exit 1
fi

# Run type checking
npm run type:check
if [ $? -ne 0 ]; then
  echo "? Type checking failed. Please fix errors before committing."
  exit 1
fi

# Check for mock data
if grep -r "const.*=.*\\[.*\\{.*name.*:" src/ --exclude-dir=node_modules --exclude-dir=__tests__ | grep -v "//"; then
  echo "??  Warning: Potential mock data detected. Please verify."
fi

echo "? Pre-commit checks passed!"
exit 0
`;
  
  fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook);
  fs.chmodSync(path.join(hooksDir, 'pre-commit'), '755');
  
  console.log('  ? Git hooks configured');
}

// Create ESLint config with strict rules
async function enhanceESLintConfig() {
  console.log('?? Enhancing ESLint configuration...');
  
  const eslintConfig = {
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended'
    ],
    rules: {
      // Prevent common issues
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-hooks/exhaustive-deps': 'error',
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // Prevent mock data
      'no-hardcoded-strings': 'off', // Would need custom plugin
      
      // Prevent duplication
      'no-duplicate-imports': 'error',
      
      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error'
    }
  };
  
  const eslintPath = path.join(process.cwd(), '.eslintrc.json');
  if (fs.existsSync(eslintPath)) {
    const existing = JSON.parse(fs.readFileSync(eslintPath, 'utf-8'));
    const merged = { ...existing, rules: { ...existing.rules, ...eslintConfig.rules } };
    fs.writeFileSync(eslintPath, JSON.stringify(merged, null, 2));
    console.log('  ? ESLint configuration enhanced');
  }
}

// Create TypeScript strict config
async function enhanceTypeScriptConfig() {
  console.log('?? Enhancing TypeScript configuration...');
  
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true
    };
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('  ? TypeScript configuration enhanced');
  }
}

// Create code quality checks
async function createQualityChecks() {
  console.log('? Creating quality checks...');
  
  const checksScript = `#!/usr/bin/env node

/**
 * Code Quality Checks
 * ?????? ???? ?????
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

async function runChecks() {
  console.log('?? Running code quality checks...\\n');
  
  const checks = [
    { name: 'Linting', command: 'npm run lint:check' },
    { name: 'Type Checking', command: 'npm run type:check' },
    { name: 'Build', command: 'npm run build' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    try {
      await execAsync(check.command);
      console.log(\`? \${check.name}: Passed\`);
      passed++;
    } catch (error) {
      console.error(\`? \${check.name}: Failed\`);
      failed++;
    }
  }
  
  console.log(\`\\n?? Results: \${passed} passed, \${failed} failed\`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runChecks();
`;
  
  const checksPath = path.join(process.cwd(), 'scripts/quality-checks.mjs');
  fs.writeFileSync(checksPath, checksScript);
  fs.chmodSync(checksPath, '755');
  
  console.log('  ? Quality checks script created');
}

// Main execution
async function main() {
  console.log('???  Setting up Future Issue Prevention...\n');
  
  await Promise.all([
    setupGitHooks(),
    enhanceESLintConfig(),
    enhanceTypeScriptConfig(),
    createQualityChecks()
  ]);
  
  console.log('\n? Future issue prevention system configured!\n');
}

main().catch(console.error);
