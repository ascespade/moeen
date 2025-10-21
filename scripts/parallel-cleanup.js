import { checkBeforeMove, createBackup, moveToQuarantine } from './safe-cleanup-checker.js';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// قوائم الملفات المستهدفة
const DOCS_TO_QUARANTINE = [
  'FINAL_*.md',
  'COMPREHENSIVE_*.md',
  'IMPLEMENTATION_*.md',
  'MODULE_*.md',
  'TEST_*.md',
  'WORKFLOW_*.md',
  'AI_*.md',
  'DATABASE_*.md',
  'FIX_*.md',
  'AGENT_*.md',
  'AUTOMATION_*.md',
  'CI_*.md',
  'CLEANUP_*.md',
  'COMPLETE_*.md',
  'CURSOR_*.md',
  'DASHBOARD_*.md',
  'DEPLOYMENT_*.md',
  'DESIGN_*.md',
  'DYNAMIC_*.md',
  'FILES_*.md',
  'FULL_*.md',
  'HEMAM_*.md',
  'INTEGRATIONS_*.md',
  'IP_*.md',
  'LIVE_*.md',
  'MIGRATION_*.md',
  'MODERN_*.md',
  'MORE_*.md',
  'NEXT_*.md',
  'PENDING_*.md',
  'PROFESSIONAL_*.md',
  'PUSH_*.md',
  'QUICK_*.md',
  'README_*.md',
  'REAL_*.md',
  'REGISTRATION_*.md',
  'RELEASE_*.md',
  'RESTRUCTURE_*.md',
  'ROLES_*.md',
  'RUN_*.md',
  'SLACK_*.md',
  'SSH_*.md',
  'STYLE_*.md',
  'SYSTEM_*.md',
  'TAILSCALE_*.md',
  'TESTING_*.md',
  'THEME_*.md',
  'TODAY_*.md',
  'TRANSLATION_*.md',
  'TYPESCRIPT_*.md',
  'UI_*.md',
  'ULTIMATE_*.md',
  'ultimate_*.md',
  'ci-assistant-*.md',
  'cleanup-report.md',
  'workflow-report.md',
  'workflow-test-report.md',
  'system-architecture-diagram.md',
  'aaaplan.txt',
  'SETUP_SUMMARY.txt',
  'FINAL_SUMMARY.txt',
];

const SCRIPTS_TO_QUARANTINE = [
  'apply-migration-*.js',
  'apply-migration-*.sh',
  'apply-migration-*.sql',
  'fix-*.js',
  'fix-*.sh',
  'fix-*.sql',
  'test-*.js',
  'test-*.ts',
  'generate-*.js',
  'run-*.js',
  'run-*.ts',
  'run-*.sh',
  'module-*.js',
  'module-*.json',
  'auto-*.js',
  'autoloop.*.mjs',
  'enhanced-*.js',
  'enhanced-*.json',
  'final-*.js',
  'final-*.json',
  'simple-*.js',
  'quick-*.js',
  'quick-*.sh',
  'database-*.js',
  'project-restructure.js',
  'ai_full_healer_*.mjs',
  'background-monitor.js',
  'check-*.sh',
  'check-*.js',
  'connect-*.sh',
  'create-*.sql',
  'find-and-restore-*.mjs',
  'internal-server-*.sh',
  'restore-*.mjs',
  'session-monitor.mjs',
  'setup_*.sh',
  'setup-*.sql',
  'show-*.sh',
  'start-*.sh',
  'start-*.js',
  'stop-*.sh',
  'tailscale-*.sh',
  'tunnel-*.mjs',
  'verify-*.sh',
];

const CONFIGS_TO_QUARANTINE = [
  'playwright.config.js',
  'playwright-auto.config.ts',
  'supawright.config.js',
  'vite.config.js',
  'vitest.config.js',
  'webpack.config.js',
  'rollup.config.js',
  'jest.config.js',
  'jest.setup.js',
  'eslint.config.js',
  'stylelint.config.cjs',
  'postcss.config.cjs',
  'lerna.json',
  'rush.json',
  'turbo.json',
  'nx.json',
  'builder.config.json',
  'cursor.agent.json',
  'ai_agent_config.json',
  'ultimate_aggressive_self_healing_config.json',
  'package.json.backup',
  '.eslintrc.js.backup',
];

const TEMP_TO_QUARANTINE = [
  'tmp/',
  'logs/',
  'test-reports/',
  'reports/',
  'ai-intelligent-ci/',
  'n8n-workflows/',
  'components/',
  'config/',
  'lib/',
  'utils/',
  'migrations/',
  'data/',
  'backups/',
  'original_*.tsx',
  'temp_*.tsx',
  '*.zip',
  'color-palette-visual.html',
  'ssh-config-updated',
  'servers.conf',
  'nginx.conf',
  'Dockerfile.dev',
  'Dockerfile.production',
  'docker-compose.yml',
  'cleanup-report.json',
  'diff_map.json',
  'full_heal_finalizer.json',
  'smart-workflow-report.json',
  'system-status.json',
  'session-data.json',
  'ai_training_cache.json',
  'product.json',
];

async function safeMoveToQuarantine(patterns, category) {
  const results = {
    moved: [],
    skipped: [],
    errors: [],
  };
  
  console.log(`\n🔍 Processing ${category} files...`);
  
  // البحث عن الملفات المطابقة للأنماط
  const allFiles = [];
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, { 
        ignore: ['node_modules/**', '.git/**', '.next/**', 'scripts/**', '_extracted/**', '_quarantine/**', 'src/**']
      });
      allFiles.push(...files);
    } catch (error) {
      console.log(`⚠️  Pattern ${pattern} not found or error: ${error.message}`);
    }
  }
  
  // إزالة المكررات
  const uniqueFiles = [...new Set(allFiles)];
  
  console.log(`📁 Found ${uniqueFiles.length} files matching patterns`);
  
  for (const file of uniqueFiles) {
    try {
      // Double-Check
      const check = checkBeforeMove(file);
      
      if (!check.safe) {
        results.skipped.push({ file, reason: check.reason });
        console.log(`⚠️  SKIPPED: ${file} - ${check.reason}`);
        continue;
      }
      
      // إنشاء نسخة احتياطية
      const backupPath = createBackup(file);
      console.log(`💾 Backup created: ${backupPath}`);
      
      // نقل إلى quarantine
      const quarantinePath = moveToQuarantine(file, category);
      
      results.moved.push({ file, to: quarantinePath });
      console.log(`✅ Moved: ${file} → ${quarantinePath}`);
      
    } catch (error) {
      results.errors.push({ file, error: error.message });
      console.error(`❌ Error: ${file} - ${error.message}`);
    }
  }
  
  // إنشاء تقرير
  const report = {
    timestamp: new Date().toISOString(),
    category,
    totalFiles: uniqueFiles.length,
    ...results,
  };
  
  // إنشاء مجلد التقارير
  fs.mkdirSync('_quarantine/reports', { recursive: true });
  
  fs.writeFileSync(
    `_quarantine/reports/${category}-${Date.now()}.json`,
    JSON.stringify(report, null, 2)
  );
  
  return results;
}

async function parallelCleanup() {
  console.log('🚀 Starting parallel cleanup...\n');
  
  try {
    // المجموعة A و B يمكن تنفيذهما بالتوازي
    const [docsResult, scriptsResult] = await Promise.all([
      // المجموعة A: ملفات التوثيق
      safeMoveToQuarantine(DOCS_TO_QUARANTINE, 'docs'),
      
      // المجموعة B: ملفات Scripts
      safeMoveToQuarantine(SCRIPTS_TO_QUARANTINE, 'scripts'),
    ]);
    
    console.log('\n✅ Parallel tasks completed!');
    console.log(`📄 Docs: ${docsResult.moved.length} moved, ${docsResult.skipped.length} skipped, ${docsResult.errors.length} errors`);
    console.log(`📜 Scripts: ${scriptsResult.moved.length} moved, ${scriptsResult.skipped.length} skipped, ${scriptsResult.errors.length} errors`);
    
    // المجموعة C و D بالتسلسل (بعد التحديثات)
    console.log('\n⏳ Starting sequential tasks...');
    
    const configsResult = await safeMoveToQuarantine(CONFIGS_TO_QUARANTINE, 'configs');
    const tempResult = await safeMoveToQuarantine(TEMP_TO_QUARANTINE, 'temp');
    
    console.log(`⚙️  Configs: ${configsResult.moved.length} moved, ${configsResult.skipped.length} skipped, ${configsResult.errors.length} errors`);
    console.log(`🗂️  Temp: ${tempResult.moved.length} moved, ${tempResult.skipped.length} skipped, ${tempResult.errors.length} errors`);
    
    // تقرير نهائي
    const totalMoved = docsResult.moved.length + scriptsResult.moved.length + configsResult.moved.length + tempResult.moved.length;
    const totalSkipped = docsResult.skipped.length + scriptsResult.skipped.length + configsResult.skipped.length + tempResult.skipped.length;
    const totalErrors = docsResult.errors.length + scriptsResult.errors.length + configsResult.errors.length + tempResult.errors.length;
    
    console.log('\n🎉 Cleanup completed!');
    console.log(`📊 Total: ${totalMoved} moved, ${totalSkipped} skipped, ${totalErrors} errors`);
    console.log(`📁 Check _quarantine/ folder for moved files`);
    console.log(`📋 Check _quarantine/reports/ for detailed reports`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// تشغيل التنظيف إذا تم استدعاء السكريبت مباشرة
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('parallel-cleanup.js')) {
  parallelCleanup();
}

export { parallelCleanup, safeMoveToQuarantine };
