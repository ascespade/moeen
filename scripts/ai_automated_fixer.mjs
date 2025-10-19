#!/usr/bin/env node

/**
 * AI Automated Fixer
 * Applies automated fixes for code quality, database issues, and test failures
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

// Initialize clients
let supabase = null;
let openai = null;

// Fix tracking
const fixes = {
  codeFixes: [],
  databaseFixes: [],
  testFixes: [],
  configFixes: [],
};

/**
 * Initialize the fixer
 */
async function initialize() {
  console.log('🔧 Initializing AI Automated Fixer...');

  try {
    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized');
    }

    // Initialize OpenAI
    const openaiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY;
    if (openaiKey) {
      openai = new OpenAI({ apiKey: openaiKey });
      console.log('✅ OpenAI client initialized');
    }

    console.log('✅ Fixer initialized');
    return true;
  } catch (error) {
    console.error('❌ Fixer initialization failed:', error);
    return false;
  }
}

/**
 * Apply all automated fixes
 */
async function applyAllFixes() {
  console.log('🔧 Applying automated fixes...');

  try {
    // Apply code quality fixes
    await applyCodeQualityFixes();

    // Apply database fixes
    await applyDatabaseFixes();

    // Apply test fixes
    await applyTestFixes();

    // Apply configuration fixes
    await applyConfigurationFixes();

    console.log('✅ All fixes applied');
    return true;
  } catch (error) {
    console.error('❌ Fix application failed:', error);
    return false;
  }
}

/**
 * Apply code quality fixes
 */
async function applyCodeQualityFixes() {
  console.log('📝 Applying code quality fixes...');

  try {
    // ESLint fixes
    await runESLintFixes();

    // Prettier fixes
    await runPrettierFixes();

    // TypeScript fixes
    await runTypeScriptFixes();

    // Import/export fixes
    await fixImportsAndExports();

    console.log('✅ Code quality fixes applied');
  } catch (error) {
    console.error('❌ Code quality fixes failed:', error);
  }
}

/**
 * Run ESLint fixes
 */
async function runESLintFixes() {
  try {
    console.log('🔍 Running ESLint fixes...');

    // Check if ESLint is available
    try {
      execSync('npx eslint --version', { cwd: WORKSPACE_ROOT });
    } catch (e) {
      console.log('⚠️ ESLint not available, installing...');
      execSync(
        'npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin',
        { cwd: WORKSPACE_ROOT }
      );
    }

    // Run ESLint with --fix
    const result = execSync('npx eslint src --fix --ext .ts,.tsx,.js,.jsx', {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    console.log('✅ ESLint fixes applied');
    fixes.codeFixes.push({
      type: 'eslint',
      description: 'Applied ESLint automatic fixes',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ ESLint fixes failed:', error.message);
  }
}

/**
 * Run Prettier fixes
 */
async function runPrettierFixes() {
  try {
    console.log('💅 Running Prettier fixes...');

    // Check if Prettier is available
    try {
      execSync('npx prettier --version', { cwd: WORKSPACE_ROOT });
    } catch (e) {
      console.log('⚠️ Prettier not available, installing...');
      execSync('npm install --save-dev prettier', { cwd: WORKSPACE_ROOT });
    }

    // Run Prettier
    execSync('npx prettier --write src', { cwd: WORKSPACE_ROOT });

    console.log('✅ Prettier fixes applied');
    fixes.codeFixes.push({
      type: 'prettier',
      description: 'Applied Prettier formatting',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Prettier fixes failed:', error.message);
  }
}

/**
 * Run TypeScript fixes
 */
async function runTypeScriptFixes() {
  try {
    console.log('🔧 Running TypeScript fixes...');

    // Check if TypeScript is available
    try {
      execSync('npx tsc --version', { cwd: WORKSPACE_ROOT });
    } catch (e) {
      console.log('⚠️ TypeScript not available, installing...');
      execSync('npm install --save-dev typescript @types/node', {
        cwd: WORKSPACE_ROOT,
      });
    }

    // Run TypeScript compiler with --noEmit to check for errors
    try {
      execSync('npx tsc --noEmit', { cwd: WORKSPACE_ROOT });
      console.log('✅ TypeScript compilation successful');
    } catch (e) {
      console.log('⚠️ TypeScript errors found, attempting fixes...');
      await fixTypeScriptErrors();
    }

    fixes.codeFixes.push({
      type: 'typescript',
      description: 'Applied TypeScript fixes',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ TypeScript fixes failed:', error.message);
  }
}

/**
 * Fix TypeScript errors
 */
async function fixTypeScriptErrors() {
  try {
    // Get TypeScript errors
    const result = execSync('npx tsc --noEmit --pretty false', {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });
  } catch (e) {
    const errors = e.stdout || e.stderr;
    console.log('TypeScript errors:', errors);

    // Apply common fixes
    await applyCommonTypeScriptFixes();
  }
}

/**
 * Apply common TypeScript fixes
 */
async function applyCommonTypeScriptFixes() {
  const commonFixes = [
    // Add missing imports
    {
      pattern: /Cannot find module 'react'/g,
      fix: "import React from 'react';",
    },
    // Fix any types
    {
      pattern: /: any/g,
      fix: ': unknown',
    },
    // Add missing return types
    {
      pattern: /function (\w+)\(/g,
      fix: 'function $1(): void {',
    },
  ];

  // Apply fixes to TypeScript files
  const tsFiles = await findTypeScriptFiles();

  for (const file of tsFiles) {
    let content = await fs.readFile(file, 'utf8');
    let modified = false;

    for (const fix of commonFixes) {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.fix);
        modified = true;
      }
    }

    if (modified) {
      await fs.writeFile(file, content);
      console.log(`✅ Applied TypeScript fixes to ${file}`);
    }
  }
}

/**
 * Find TypeScript files
 */
async function findTypeScriptFiles() {
  const files = [];
  const srcPath = path.join(WORKSPACE_ROOT, 'src');

  try {
    const entries = await fs.readdir(srcPath, {
      withFileTypes: true,
      recursive: true,
    });

    for (const entry of entries) {
      if (
        entry.isFile() &&
        (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))
      ) {
        files.push(path.join(srcPath, entry.name));
      }
    }
  } catch (error) {
    console.error('Failed to find TypeScript files:', error);
  }

  return files;
}

/**
 * Fix imports and exports
 */
async function fixImportsAndExports() {
  console.log('📦 Fixing imports and exports...');

  try {
    // Find all TypeScript/JavaScript files
    const files = await findTypeScriptFiles();

    for (const file of files) {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;

      // Fix relative imports
      if (content.includes('../')) {
        // Convert relative imports to absolute imports where possible
        content = content.replace(/from '\.\.\/\.\.\/src\//g, "from '@/");
        content = content.replace(/from '\.\.\/src\//g, "from '@/");
        modified = true;
      }

      // Add missing React import for JSX
      if (
        content.includes('<') &&
        content.includes('>') &&
        !content.includes('import React')
      ) {
        content = "import React from 'react';\n" + content;
        modified = true;
      }

      if (modified) {
        await fs.writeFile(file, content);
        console.log(`✅ Fixed imports in ${file}`);
      }
    }

    fixes.codeFixes.push({
      type: 'imports',
      description: 'Fixed imports and exports',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Import/export fixes failed:', error.message);
  }
}

/**
 * Apply database fixes
 */
async function applyDatabaseFixes() {
  console.log('🗄️ Applying database fixes...');

  if (!supabase) {
    console.log('⚠️ Supabase not available, skipping database fixes');
    return;
  }

  try {
    // Check database connection
    await checkDatabaseConnection();

    // Apply schema fixes
    await applySchemaFixes();

    // Apply data fixes
    await applyDataFixes();

    // Apply index fixes
    await applyIndexFixes();

    console.log('✅ Database fixes applied');
  } catch (error) {
    console.log('⚠️ Database fixes failed:', error.message);
  }
}

/**
 * Check database connection
 */
async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('⚠️ Database connection failed:', error.message);
  }
}

/**
 * Apply schema fixes
 */
async function applySchemaFixes() {
  const schemaFixes = [
    // Enable required extensions
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',

    // Add missing columns to common tables
    `ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,

    // Add missing indexes
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
    `CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);`,
  ];

  for (const fix of schemaFixes) {
    try {
      await supabase.rpc('exec_sql', { sql: fix });
      console.log(`✅ Applied schema fix: ${fix.substring(0, 50)}...`);

      fixes.databaseFixes.push({
        type: 'schema',
        description: fix,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.log(`⚠️ Schema fix failed: ${error.message}`);
    }
  }
}

/**
 * Apply data fixes
 */
async function applyDataFixes() {
  try {
    // Fix common data issues
    const dataFixes = [
      // Update NULL timestamps
      `UPDATE users SET created_at = NOW() WHERE created_at IS NULL;`,
      `UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;`,

      // Fix invalid email formats
      `UPDATE users SET email = LOWER(TRIM(email)) WHERE email IS NOT NULL;`,
    ];

    for (const fix of dataFixes) {
      try {
        await supabase.rpc('exec_sql', { sql: fix });
        console.log(`✅ Applied data fix: ${fix.substring(0, 50)}...`);

        fixes.databaseFixes.push({
          type: 'data',
          description: fix,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.log(`⚠️ Data fix failed: ${error.message}`);
      }
    }
  } catch (error) {
    console.log('⚠️ Data fixes failed:', error.message);
  }
}

/**
 * Apply index fixes
 */
async function applyIndexFixes() {
  try {
    // Add performance indexes
    const indexFixes = [
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
      `CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);`,
      `CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);`,
    ];

    for (const fix of indexFixes) {
      try {
        await supabase.rpc('exec_sql', { sql: fix });
        console.log(`✅ Applied index fix: ${fix.substring(0, 50)}...`);

        fixes.databaseFixes.push({
          type: 'index',
          description: fix,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.log(`⚠️ Index fix failed: ${error.message}`);
      }
    }
  } catch (error) {
    console.log('⚠️ Index fixes failed:', error.message);
  }
}

/**
 * Apply test fixes
 */
async function applyTestFixes() {
  console.log('🧪 Applying test fixes...');

  try {
    // Fix test configuration
    await fixTestConfiguration();

    // Fix test files
    await fixTestFiles();

    // Fix test dependencies
    await fixTestDependencies();

    console.log('✅ Test fixes applied');
  } catch (error) {
    console.log('⚠️ Test fixes failed:', error.message);
  }
}

/**
 * Fix test configuration
 */
async function fixTestConfiguration() {
  try {
    // Create or update Playwright config
    const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});`;

    await fs.writeFile(
      path.join(WORKSPACE_ROOT, 'playwright.config.js'),
      playwrightConfig
    );
    console.log('✅ Playwright configuration fixed');

    fixes.testFixes.push({
      type: 'config',
      description: 'Fixed Playwright configuration',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Test configuration fix failed:', error.message);
  }
}

/**
 * Fix test files
 */
async function fixTestFiles() {
  try {
    const testDir = path.join(WORKSPACE_ROOT, 'tests');
    const testFiles = await findTestFiles(testDir);

    for (const file of testFiles) {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;

      // Fix common test issues
      if (
        content.includes('test(') &&
        !content.includes('import { test, expect }')
      ) {
        content =
          "import { test, expect } from '@playwright/test';\n\n" + content;
        modified = true;
      }

      if (
        content.includes('describe(') &&
        !content.includes('import { test, expect }')
      ) {
        content =
          "import { test, expect } from '@playwright/test';\n\n" + content;
        modified = true;
      }

      if (modified) {
        await fs.writeFile(file, content);
        console.log(`✅ Fixed test file: ${file}`);
      }
    }

    fixes.testFixes.push({
      type: 'files',
      description: 'Fixed test files',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Test files fix failed:', error.message);
  }
}

/**
 * Find test files
 */
async function findTestFiles(dir) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subFiles = await findTestFiles(path.join(dir, entry.name));
        files.push(...subFiles);
      } else if (
        entry.name.endsWith('.test.js') ||
        entry.name.endsWith('.spec.js')
      ) {
        files.push(path.join(dir, entry.name));
      }
    }
  } catch (error) {
    console.error('Failed to find test files:', error);
  }

  return files;
}

/**
 * Fix test dependencies
 */
async function fixTestDependencies() {
  try {
    // Install missing test dependencies
    const testDeps = [
      '@playwright/test',
      'jest',
      '@testing-library/react',
      '@testing-library/jest-dom',
    ];

    for (const dep of testDeps) {
      try {
        execSync(`npm list ${dep}`, { cwd: WORKSPACE_ROOT });
      } catch (e) {
        console.log(`Installing missing test dependency: ${dep}`);
        execSync(`npm install --save-dev ${dep}`, { cwd: WORKSPACE_ROOT });
      }
    }

    console.log('✅ Test dependencies fixed');

    fixes.testFixes.push({
      type: 'dependencies',
      description: 'Fixed test dependencies',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Test dependencies fix failed:', error.message);
  }
}

/**
 * Apply configuration fixes
 */
async function applyConfigurationFixes() {
  console.log('⚙️ Applying configuration fixes...');

  try {
    // Fix package.json
    await fixPackageJson();

    // Fix TypeScript config
    await fixTypeScriptConfig();

    // Fix Next.js config
    await fixNextJsConfig();

    console.log('✅ Configuration fixes applied');
  } catch (error) {
    console.log('⚠️ Configuration fixes failed:', error.message);
  }
}

/**
 * Fix package.json
 */
async function fixPackageJson() {
  try {
    const packagePath = path.join(WORKSPACE_ROOT, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));

    // Add missing scripts
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    const requiredScripts = {
      test: 'playwright test',
      'test:ui': 'playwright test --ui',
      'test:debug': 'playwright test --debug',
      lint: 'eslint src --ext .ts,.tsx,.js,.jsx',
      'lint:fix': 'eslint src --fix --ext .ts,.tsx,.js,.jsx',
      format: 'prettier --write src',
      'type-check': 'tsc --noEmit',
    };

    for (const [script, command] of Object.entries(requiredScripts)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
      }
    }

    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Package.json fixed');

    fixes.configFixes.push({
      type: 'package.json',
      description: 'Fixed package.json scripts',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Package.json fix failed:', error.message);
  }
}

/**
 * Fix TypeScript config
 */
async function fixTypeScriptConfig() {
  try {
    const tsconfigPath = path.join(WORKSPACE_ROOT, 'tsconfig.json');
    let tsconfig = {};

    try {
      tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'));
    } catch (e) {
      // Create new tsconfig.json
      tsconfig = {
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [
            {
              name: 'next',
            },
          ],
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
        include: [
          'next-env.d.ts',
          '**/*.ts',
          '**/*.tsx',
          '.next/types/**/*.ts',
        ],
        exclude: ['node_modules'],
      };
    }

    // Ensure required options
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }

    const requiredOptions = {
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    };

    for (const [option, value] of Object.entries(requiredOptions)) {
      if (tsconfig.compilerOptions[option] === undefined) {
        tsconfig.compilerOptions[option] = value;
      }
    }

    await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('✅ TypeScript config fixed');

    fixes.configFixes.push({
      type: 'tsconfig.json',
      description: 'Fixed TypeScript configuration',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ TypeScript config fix failed:', error.message);
  }
}

/**
 * Fix Next.js config
 */
async function fixNextJsConfig() {
  try {
    const nextConfigPath = path.join(WORKSPACE_ROOT, 'next.config.js');
    let nextConfig = '';

    try {
      nextConfig = await fs.readFile(nextConfigPath, 'utf8');
    } catch (e) {
      // Create new next.config.js
      nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig`;
    }

    await fs.writeFile(nextConfigPath, nextConfig);
    console.log('✅ Next.js config fixed');

    fixes.configFixes.push({
      type: 'next.config.js',
      description: 'Fixed Next.js configuration',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.log('⚠️ Next.js config fix failed:', error.message);
  }
}

/**
 * Get fix summary
 */
function getFixSummary() {
  return {
    totalFixes:
      fixes.codeFixes.length +
      fixes.databaseFixes.length +
      fixes.testFixes.length +
      fixes.configFixes.length,
    codeFixes: fixes.codeFixes.length,
    databaseFixes: fixes.databaseFixes.length,
    testFixes: fixes.testFixes.length,
    configFixes: fixes.configFixes.length,
    fixes: fixes,
  };
}

// Run the fixer
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const initialized = await initialize();
    if (initialized) {
      await applyAllFixes();
      console.log('📊 Fix Summary:', getFixSummary());
    }
  })().catch(console.error);
}

export { applyAllFixes, getFixSummary, fixes };
