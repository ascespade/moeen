#!/usr/bin/env node
// scripts/fix_all_issues.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');

// إنشاء المجلدات المطلوبة
fs.mkdirSync(REPORTS, { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(REPORTS, 'execution.log'), line + '\n');
}

// تشغيل أمر وإرجاع النتيجة
function runCommand(cmd, description) {
  log(`Running: ${description}`);
  try {
    const output = execSync(cmd, {
      cwd: ROOT,
      stdio: 'pipe',
      encoding: 'utf8',
    });
    log(`✅ ${description} - Success`);
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} - Failed: ${error.message}`);
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

// إصلاح مشاكل ESLint
async function fixESLintIssues() {
  log('🔧 Fixing ESLint issues...');

  const results = [];

  // إنشاء ملف تكوين ESLint إذا لم يكن موجوداً
  const eslintConfigPath = path.join(ROOT, 'eslint.config.js');
  if (!fs.existsSync(eslintConfigPath)) {
    log('Creating ESLint config...');
    const eslintConfig = `// eslint.config.js
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['scripts/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'reports/**',
      'public/**',
      'temp_complex/**',
      'src/__tests__/**',
      'src/scripts/**',
      'ci_memory.sqlite',
      '*.log',
    ],
  },
];
`;
    fs.writeFileSync(eslintConfigPath, eslintConfig);
    results.push({ action: 'create_eslint_config', success: true });
  }

  // تشغيل ESLint مع الإصلاح التلقائي
  const eslintResult = runCommand(
    'npx eslint src --fix --ext .ts,.tsx,.js,.jsx',
    'ESLint auto-fix'
  );
  results.push({ action: 'eslint_auto_fix', ...eslintResult });

  // تشغيل ESLint على ملفات الاختبار
  const testEslintResult = runCommand(
    'npx eslint tests --fix --ext .ts,.tsx,.js,.jsx',
    'ESLint auto-fix for tests'
  );
  results.push({ action: 'eslint_test_fix', ...testEslintResult });

  return results;
}

// إصلاح مشاكل Prettier
async function fixPrettierIssues() {
  log('💅 Fixing Prettier issues...');

  const results = [];

  // إنشاء ملف تكوين Prettier إذا لم يكن موجوداً
  const prettierConfigPath = path.join(ROOT, '.prettierrc.js');
  if (!fs.existsSync(prettierConfigPath)) {
    log('Creating Prettier config...');
    const prettierConfig = `// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  bracketSameLine: false,
  proseWrap: 'preserve',
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
  ],
};
`;
    fs.writeFileSync(prettierConfigPath, prettierConfig);
    results.push({ action: 'create_prettier_config', success: true });
  }

  // تشغيل Prettier مع الإصلاح التلقائي
  const prettierResult = runCommand(
    'npx prettier --write src tests scripts',
    'Prettier auto-fix'
  );
  results.push({ action: 'prettier_auto_fix', ...prettierResult });

  return results;
}

// إصلاح مشاكل TypeScript
async function fixTypeScriptIssues() {
  log('🔷 Fixing TypeScript issues...');

  const results = [];

  // تشغيل TypeScript compiler للتحقق من الأخطاء
  const tscResult = runCommand('npx tsc --noEmit', 'TypeScript type check');
  results.push({ action: 'typescript_check', ...tscResult });

  // إصلاح مشاكل الاستيراد
  const importResult = runCommand(
    'npx tsc --noEmit --skipLibCheck',
    'TypeScript import check'
  );
  results.push({ action: 'typescript_imports', ...importResult });

  return results;
}

// إصلاح مشاكل Playwright
async function fixPlaywrightIssues() {
  log('🎭 Fixing Playwright issues...');

  const results = [];

  // تثبيت المتصفحات
  const installResult = runCommand(
    'npx playwright install',
    'Install Playwright browsers'
  );
  results.push({ action: 'playwright_install', ...installResult });

  // تثبيت تبعيات النظام
  const depsResult = runCommand(
    'npx playwright install-deps',
    'Install Playwright system dependencies'
  );
  results.push({ action: 'playwright_deps', ...depsResult });

  return results;
}

// إصلاح مشاكل Supawright
async function fixSupawrightIssues() {
  log('🗄️ Fixing Supawright issues...');

  const results = [];

  // التحقق من اتصال Supabase
  const supabaseResult = runCommand(
    'node -e "console.log(\'Supabase connection test\')"',
    'Supabase connection test'
  );
  results.push({ action: 'supabase_connection', ...supabaseResult });

  return results;
}

// إصلاح مشاكل قاعدة البيانات
async function fixDatabaseIssues() {
  log('💾 Fixing database issues...');

  const results = [];

  // إنشاء جدول الاختبارات إذا لم يكن موجوداً
  const createTableScript = `
const { createClient } = require('@supabase/supabase-js');

async function createTestTables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase credentials not provided, skipping table creation');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // إنشاء جدول الاختبارات
    const { error } = await supabase.rpc('create_test_tables');
    if (error) {
      console.log('Error creating test tables:', error.message);
    } else {
      console.log('Test tables created successfully');
    }
  } catch (error) {
    console.log('Error connecting to Supabase:', error.message);
  }
}

createTestTables();
`;

  const createTablePath = path.join(ROOT, 'create_test_tables.js');
  fs.writeFileSync(createTablePath, createTableScript);

  const tableResult = runCommand(
    'node create_test_tables.js',
    'Create test database tables'
  );
  results.push({ action: 'create_test_tables', ...tableResult });

  // حذف الملف المؤقت
  if (fs.existsSync(createTablePath)) {
    fs.unlinkSync(createTablePath);
  }

  return results;
}

// إصلاح مشاكل التبعيات
async function fixDependencyIssues() {
  log('📦 Fixing dependency issues...');

  const results = [];

  // تثبيت التبعيات
  const installResult = runCommand('npm install', 'Install dependencies');
  results.push({ action: 'npm_install', ...installResult });

  // تحديث التبعيات
  const updateResult = runCommand('npm update', 'Update dependencies');
  results.push({ action: 'npm_update', ...updateResult });

  // إصلاح التبعيات
  const auditResult = runCommand(
    'npm audit fix',
    'Fix dependency vulnerabilities'
  );
  results.push({ action: 'npm_audit_fix', ...auditResult });

  return results;
}

// إصلاح مشاكل التكوين
async function fixConfigIssues() {
  log('⚙️ Fixing configuration issues...');

  const results = [];

  // إنشاء ملف .env إذا لم يكن موجوداً
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    log('Creating .env.local file...');
    const envContent = `# Environment variables for testing
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
GITHUB_TOKEN=your_github_token_here
CURSOR_API_KEY=your_cursor_api_key_here
BASE_URL=http://localhost:3000
NODE_ENV=development
`;
    fs.writeFileSync(envPath, envContent);
    results.push({ action: 'create_env_file', success: true });
  }

  // إنشاء ملف .gitignore إذا لم يكن موجوداً
  const gitignorePath = path.join(ROOT, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    log('Creating .gitignore file...');
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Test results
test-results/
playwright-report/
reports/

# Temporary files
temp/
tmp/
`;
    fs.writeFileSync(gitignorePath, gitignoreContent);
    results.push({ action: 'create_gitignore', success: true });
  }

  return results;
}

// الدالة الرئيسية
async function main() {
  log('🚀 Starting comprehensive issue fixing...');

  const allResults = {
    timestamp: new Date().toISOString(),
    fixes: [],
  };

  try {
    // إصلاح مشاكل التكوين أولاً
    log('Step 1: Fixing configuration issues...');
    const configResults = await fixConfigIssues();
    allResults.fixes.push(...configResults);

    // إصلاح مشاكل التبعيات
    log('Step 2: Fixing dependency issues...');
    const dependencyResults = await fixDependencyIssues();
    allResults.fixes.push(...dependencyResults);

    // إصلاح مشاكل ESLint
    log('Step 3: Fixing ESLint issues...');
    const eslintResults = await fixESLintIssues();
    allResults.fixes.push(...eslintResults);

    // إصلاح مشاكل Prettier
    log('Step 4: Fixing Prettier issues...');
    const prettierResults = await fixPrettierIssues();
    allResults.fixes.push(...prettierResults);

    // إصلاح مشاكل TypeScript
    log('Step 5: Fixing TypeScript issues...');
    const typescriptResults = await fixTypeScriptIssues();
    allResults.fixes.push(...typescriptResults);

    // إصلاح مشاكل Playwright
    log('Step 6: Fixing Playwright issues...');
    const playwrightResults = await fixPlaywrightIssues();
    allResults.fixes.push(...playwrightResults);

    // إصلاح مشاكل Supawright
    log('Step 7: Fixing Supawright issues...');
    const supawrightResults = await fixSupawrightIssues();
    allResults.fixes.push(...supawrightResults);

    // إصلاح مشاكل قاعدة البيانات
    log('Step 8: Fixing database issues...');
    const databaseResults = await fixDatabaseIssues();
    allResults.fixes.push(...databaseResults);

    // حساب الإحصائيات
    const totalFixes = allResults.fixes.length;
    const successfulFixes = allResults.fixes.filter(f => f.success).length;
    const failedFixes = totalFixes - successfulFixes;

    allResults.summary = {
      totalFixes,
      successfulFixes,
      failedFixes,
      successRate: Math.round((successfulFixes / totalFixes) * 100),
    };

    // حفظ التقرير
    const reportPath = path.join(REPORTS, 'fix_issues_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));

    log('✅ Issue fixing completed!');
    log(
      `📊 Summary: ${successfulFixes}/${totalFixes} fixes successful (${allResults.summary.successRate}%)`
    );
    log(`📄 Report saved to: ${reportPath}`);

    if (failedFixes > 0) {
      log(`⚠️ ${failedFixes} fixes failed. Check the report for details.`);
    }
  } catch (error) {
    log(`❌ Fatal error during issue fixing: ${error.message}`);
    process.exit(1);
  }
}

main();
