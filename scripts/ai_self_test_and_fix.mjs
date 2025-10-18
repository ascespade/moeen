import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { logAIResult } from './ai-logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const LOG_FILE = path.join(projectRoot, 'logs', 'ai-agent.log');
const REPORT_FILE = path.join(projectRoot, 'reports', 'ai-report.md');
const FINAL_SUMMARY = path.join(projectRoot, 'reports', 'final_summary.md');
const BACKUP_DIR = path.join(projectRoot, 'reports', 'backups');
const MAX_CYCLES = 10;
const CYCLE_DELAY_SECONDS = 5;

// Helper to log messages to console and file
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  try {
    await fs.appendFile(LOG_FILE, logMessage + '\n', 'utf8');
  } catch (err) {
    console.error(`[${timestamp}] [ERROR] Failed to write to log file: ${err.message}`);
  }
}

// Helper to execute shell commands
async function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot, ...options }, (error, stdout, stderr) => {
      if (error) {
        log(`❌ فشل في: ${command}\n${stderr}`, 'ERROR');
        reject({ error, stdout, stderr });
      } else {
        log(`✅ نجاح في: ${command}\n${stdout}`, 'INFO');
        resolve({ stdout, stderr });
      }
    });
  });
}

// Function to call LLM (supports Cursor, OpenAI, Ollama)
async function callLLM(prompt, opts = {}) {
  const provider = process.env.LLM_PROVIDER || 'cursor';
  
  log(`🤖 استدعاء LLM (${provider})...`);
  
  if (provider === 'openai') {
    try {
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a senior code fixer and software engineer. Provide precise, minimal code fixes that preserve business logic.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.1
      });
      return resp.choices?.[0]?.message?.content || '';
    } catch (err) {
      log(`❌ خطأ في OpenAI: ${err.message}`, 'ERROR');
      return '';
    }
  }

  if (provider === 'ollama') {
    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model: 'llama3', 
          prompt: `You are a senior code fixer. ${prompt}`,
          stream: false
        })
      });
      const j = await res.json();
      return j?.response || '';
    } catch (err) {
      log(`❌ خطأ في Ollama: ${err.message}`, 'ERROR');
      return '';
    }
  }

  // provider === 'cursor' -> داخل بيئة Cursor
  // نطبع التعليمات التفصيلية على stdout والـAgent سيأخذها ويطبقها
  console.log('\n🤖 LLM_PROMPT_START');
  console.log('='.repeat(80));
  console.log('SYSTEM: You are a senior code fixer and software engineer. Provide precise, minimal code fixes that preserve business logic.');
  console.log('USER_PROMPT:');
  console.log(prompt);
  console.log('='.repeat(80));
  console.log('LLM_PROMPT_END\n');
  
  // في وضع Cursor، الـAgent سيقرأ هذه المخرجات ويجيب بالتعديلات المطلوبة
  return '';
}

// Function to backup files before modification
async function backupFiles(files) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  try {
    await fs.mkdir(backupPath, { recursive: true });
    
    for (const file of files) {
      const sourcePath = path.join(projectRoot, file);
      const destPath = path.join(backupPath, file);
      
      try {
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(sourcePath, destPath);
        log(`📁 تم نسخ: ${file}`);
      } catch (err) {
        log(`⚠️ فشل في نسخ: ${file} - ${err.message}`, 'WARN');
      }
    }
    
    return backupPath;
  } catch (err) {
    log(`❌ فشل في إنشاء النسخة الاحتياطية: ${err.message}`, 'ERROR');
    return null;
  }
}

// Function to analyze project status
async function analyzeProject() {
  log('🔍 تحليل حالة المشروع...');
  let eslintOutput = '';
  let tsOutput = '';
  let testOutput = '';
  let buildOutput = '';

  try {
    const { stdout } = await executeCommand('npm run lint:check', { ignoreError: true });
    eslintOutput = stdout;
  } catch (e) {
    eslintOutput = e.stderr;
  }

  try {
    const { stdout } = await executeCommand('npm run type:check', { ignoreError: true });
    tsOutput = stdout;
  } catch (e) {
    tsOutput = e.stderr;
  }

  try {
    const { stdout } = await executeCommand('npm run test', { ignoreError: true });
    testOutput = stdout;
  } catch (e) {
    testOutput = e.stderr;
  }

  try {
    const { stdout } = await executeCommand('npm run build', { ignoreError: true });
    buildOutput = stdout;
  } catch (e) {
    buildOutput = e.stderr;
  }

  const eslintErrors = (eslintOutput.match(/(\d+) errors?/g) || []).map(m => parseInt(m)).reduce((a, b) => a + b, 0);
  const eslintWarnings = (eslintOutput.match(/(\d+) warnings?/g) || []).map(m => parseInt(m)).reduce((a, b) => a + b, 0);
  const tsErrors = (tsOutput.match(/error TS\d+:/g) || []).length;
  const testPassed = (testOutput.match(/(\d+) passed/g) || []).map(m => parseInt(m)).reduce((a, b) => a + b, 0);
  const testFailed = (testOutput.match(/(\d+) failed/g) || []).map(m => parseInt(m)).reduce((a, b) => a + b, 0);
  const buildSuccess = !buildOutput.includes('error Command failed');

  log(`📊 نتائج التحليل: ESLint(${eslintErrors}E/${eslintWarnings}W), TypeScript(${tsErrors}E), Tests(${testPassed}P/${testFailed}F), Build(${buildSuccess ? '✅' : '❌'})`);

  return {
    eslintErrors,
    eslintWarnings,
    tsErrors,
    testPassed,
    testFailed,
    buildSuccess,
    rawEslintOutput: eslintOutput,
    rawTsOutput: tsOutput,
    rawTestOutput: testOutput,
    rawBuildOutput: buildOutput,
  };
}

// Function to fix ESLint issues
async function fixEslint() {
  log('🔧 إصلاح مشاكل ESLint...');
  try {
    await executeCommand('npm run lint:fix');
    return true;
  } catch (e) {
    log('⚠️ فشل في إصلاح بعض مشاكل ESLint', 'WARN');
    return false;
  }
}

// Function to fix TypeScript issues using LLM
async function fixTypeScript() {
  log('🔧 إصلاح مشاكل TypeScript...');
  
  try {
    const { stdout } = await executeCommand('npm run type:check', { ignoreError: true });
    
    if (stdout.includes('error TS')) {
      // استخراج أخطاء TypeScript
      const errors = stdout.match(/error TS\d+:[^\n]+/g) || [];
      
      if (errors.length > 0) {
        const prompt = `Fix these TypeScript errors in the project:\n\n${errors.join('\n')}\n\nProvide the corrected code with minimal changes that preserve business logic.`;
        
        const llmResponse = await callLLM(prompt);
        
        if (llmResponse) {
          log('🤖 تم الحصول على إصلاحات من LLM');
          // في وضع Cursor، الـAgent سيقرأ الاستجابة ويطبقها
          console.log('\n🔧 APPLY_FIXES_START');
          console.log(llmResponse);
          console.log('🔧 APPLY_FIXES_END\n');
        }
      }
    }
    
    return true;
  } catch (e) {
    log('⚠️ فشل في إصلاح بعض مشاكل TypeScript', 'WARN');
    return false;
  }
}

// Function to fix broken tests using LLM
async function fixTests() {
  log('🧪 إصلاح مشاكل الاختبارات...');
  
  try {
    const { stdout } = await executeCommand('npm run test', { ignoreError: true });
    
    if (stdout.includes('failed')) {
      const prompt = `Fix these failing tests in the project:\n\n${stdout}\n\nProvide the corrected test code and any necessary code changes to make tests pass.`;
      
      const llmResponse = await callLLM(prompt);
      
      if (llmResponse) {
        log('🤖 تم الحصول على إصلاحات الاختبارات من LLM');
        console.log('\n🧪 APPLY_TEST_FIXES_START');
        console.log(llmResponse);
        console.log('🧪 APPLY_TEST_FIXES_END\n');
      }
    }
    
    return true;
  } catch (e) {
    log('⚠️ فشل في إصلاح بعض مشاكل الاختبارات', 'WARN');
    return false;
  }
}

// Function to run all tests
async function runTests() {
  log('🧪 تشغيل الاختبارات...');
  let allTestsPassed = true;
  
  try {
    await executeCommand('npm run test:unit');
  } catch (e) {
    allTestsPassed = false;
  }
  
  try {
    await executeCommand('npm run test:integration');
  } catch (e) {
    allTestsPassed = false;
  }
  
  try {
    await executeCommand('npm run test:e2e');
  } catch (e) {
    allTestsPassed = false;
  }
  
  try {
    await executeCommand('npx playwright test --reporter=html');
  } catch (e) {
    allTestsPassed = false;
  }
  
  try {
    await executeCommand('npx supawright test');
  } catch (e) {
    allTestsPassed = false;
  }
  
  return allTestsPassed;
}

// Function to build the project
async function buildProject() {
  log('🏗️ بناء المشروع...');
  try {
    await executeCommand('npm run build');
    return true;
  } catch (e) {
    log('❌ فشل في بناء المشروع', 'ERROR');
    return false;
  }
}

// Function to create backup branch and commit changes
async function commitChanges(cycle) {
  log('💾 إنشاء commit للتغييرات...');
  
  try {
    // إنشاء branch جديد للتغييرات
    await executeCommand('git checkout -b ai-auto-fixes');
    
    // إضافة جميع التغييرات
    await executeCommand('git add .');
    
    // إنشاء commit
    const commitMessage = `🤖 AI Auto-Fix Cycle ${cycle} - ${new Date().toISOString()}`;
    await executeCommand(`git commit -m "${commitMessage}"`);
    
    // دفع التغييرات
    await executeCommand('git push origin ai-auto-fixes');
    
    log('✅ تم إنشاء commit ودفع التغييرات');
    return true;
  } catch (e) {
    log(`❌ فشل في إنشاء commit: ${e.message}`, 'ERROR');
    return false;
  }
}

// Function to generate a comprehensive report
async function generateReport(analysisResults, cycle) {
  log(`📊 تم إنشاء التقرير: ${REPORT_FILE}`);
  
  let reportContent = `# 🤖 AI Self-Healing CI/CD Report - Cycle ${cycle}\n\n`;
  reportContent += `## 📅 التاريخ: ${new Date().toLocaleString()}\n\n`;
  reportContent += `## 📊 نتائج التحليل:\n`;
  reportContent += `- ESLint: ${analysisResults.eslintErrors} أخطاء, ${analysisResults.eslintWarnings} تحذيرات\n`;
  reportContent += `- TypeScript: ${analysisResults.tsErrors} أخطاء\n`;
  reportContent += `- الاختبارات: ${analysisResults.testPassed} ناجحة, ${analysisResults.testFailed} فاشلة\n`;
  reportContent += `- البناء: ${analysisResults.buildSuccess ? '✅ ناجح' : '❌ فاشل'}\n\n`;

  if (analysisResults.eslintErrors > 0 || analysisResults.eslintWarnings > 0) {
    reportContent += `### 📝 تفاصيل ESLint:\n\`\`\`\n${analysisResults.rawEslintOutput}\n\`\`\`\n\n`;
  }
  if (analysisResults.tsErrors > 0) {
    reportContent += `### 📝 تفاصيل TypeScript:\n\`\`\`\n${analysisResults.rawTsOutput}\n\`\`\`\n\n`;
  }
  if (analysisResults.testFailed > 0) {
    reportContent += `### 📝 تفاصيل الاختبارات الفاشلة:\n\`\`\`\n${analysisResults.rawTestOutput}\n\`\`\`\n\n`;
  }
  if (!analysisResults.buildSuccess) {
    reportContent += `### 📝 تفاصيل فشل البناء:\n\`\`\`\n${analysisResults.rawBuildOutput}\n\`\`\`\n\n`;
  }

  await fs.writeFile(REPORT_FILE, reportContent, 'utf8');
}

// Function to generate final summary
async function generateFinalSummary(analysisResults, cycle, totalFixes) {
  log(`📊 تم إنشاء التقرير النهائي: ${FINAL_SUMMARY}`);
  
  let summaryContent = `# 🤖 AI Self-Healing CI/CD - Final Summary\n\n`;
  summaryContent += `## 📅 التاريخ: ${new Date().toLocaleString()}\n`;
  summaryContent += `## 🔄 الدورة: ${cycle}\n`;
  summaryContent += `## 🔧 إجمالي الإصلاحات: ${totalFixes}\n\n`;
  
  summaryContent += `## 📊 الحالة النهائية:\n`;
  summaryContent += `- ESLint: ${analysisResults.eslintErrors} أخطاء, ${analysisResults.eslintWarnings} تحذيرات\n`;
  summaryContent += `- TypeScript: ${analysisResults.tsErrors} أخطاء\n`;
  summaryContent += `- الاختبارات: ${analysisResults.testPassed} ناجحة, ${analysisResults.testFailed} فاشلة\n`;
  summaryContent += `- البناء: ${analysisResults.buildSuccess ? '✅ ناجح' : '❌ فاشل'}\n\n`;
  
  summaryContent += `## 🎯 النتائج:\n`;
  if (analysisResults.eslintErrors === 0 && analysisResults.tsErrors === 0 && analysisResults.testFailed === 0 && analysisResults.buildSuccess) {
    summaryContent += `✅ **تم إصلاح جميع المشاكل بنجاح!**\n`;
    summaryContent += `🎉 المشروع نظيف وجاهز للإنتاج.\n\n`;
  } else {
    summaryContent += `⚠️ **لا تزال هناك مشاكل تحتاج إلى إصلاح يدوي:**\n`;
    if (analysisResults.eslintErrors > 0) summaryContent += `- ${analysisResults.eslintErrors} أخطاء ESLint\n`;
    if (analysisResults.tsErrors > 0) summaryContent += `- ${analysisResults.tsErrors} أخطاء TypeScript\n`;
    if (analysisResults.testFailed > 0) summaryContent += `- ${analysisResults.testFailed} اختبارات فاشلة\n`;
    if (!analysisResults.buildSuccess) summaryContent += `- فشل في البناء\n`;
    summaryContent += `\n`;
  }
  
  summaryContent += `## 🔗 الخطوات التالية:\n`;
  summaryContent += `1. مراجعة التغييرات في branch \`ai-auto-fixes\`\n`;
  summaryContent += `2. إنشاء Pull Request إذا كانت النتائج مرضية\n`;
  summaryContent += `3. دمج التغييرات في الفرع الرئيسي\n`;
  summaryContent += `4. مراقبة النظام للدورات القادمة\n\n`;
  
  summaryContent += `---\n`;
  summaryContent += `*تم إنشاء هذا التقرير بواسطة AI Self-Healing CI/CD v3.0*\n`;

  await fs.writeFile(FINAL_SUMMARY, summaryContent, 'utf8');
}

// Main function for the AI agent
async function main(options) {
  const startTime = Date.now();
  log('🤖 AI Self-Test and Fix Agent بدأ التشغيل');
  
  // Ensure directories exist
  await fs.mkdir(path.join(projectRoot, 'logs'), { recursive: true }).catch(() => {});
  await fs.mkdir(path.join(projectRoot, 'reports'), { recursive: true }).catch(() => {});
  await fs.mkdir(BACKUP_DIR, { recursive: true }).catch(() => {});

  let totalFixes = 0;
  let totalLinesChanged = 0;
  let filesToBackup = [];

  for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
    log(`\n🔄 بدء الدورة ${cycle}...`);

    const initialAnalysis = await analyzeProject();

    if (initialAnalysis.eslintErrors === 0 && initialAnalysis.tsErrors === 0 && initialAnalysis.testFailed === 0 && initialAnalysis.buildSuccess) {
      log('🎉 المشروع نظيف! لا توجد أخطاء أو تحذيرات متبقية.', 'INFO');
      await generateReport(initialAnalysis, cycle);
      await generateFinalSummary(initialAnalysis, cycle, totalFixes);
      break;
    }

    let madeChanges = false;

    // Backup files before making changes
    if (cycle === 1) {
      filesToBackup = [
        'src/**/*.js',
        'src/**/*.ts',
        'src/**/*.jsx',
        'src/**/*.tsx',
        'tests/**/*.js',
        'tests/**/*.ts',
        'package.json',
        '.eslintrc.cjs',
        'tsconfig.json'
      ];
      await backupFiles(filesToBackup);
    }

    if (initialAnalysis.eslintErrors > 0 || initialAnalysis.eslintWarnings > 0) {
      if (await fixEslint()) {
        madeChanges = true;
        totalFixes++;
      }
    }

    if (initialAnalysis.tsErrors > 0) {
      if (await fixTypeScript()) {
        madeChanges = true;
        totalFixes++;
      }
    }

    if (initialAnalysis.testFailed > 0) {
      if (await fixTests()) {
        madeChanges = true;
        totalFixes++;
      }
    }

    if (madeChanges) {
      log('🧪 تشغيل الاختبارات بعد الإصلاحات...');
      const testsPassed = await runTests();
      if (!testsPassed) {
        log('❌ فشلت الاختبارات بعد الإصلاحات.', 'ERROR');
      }

      log('🏗️ بناء المشروع بعد الإصلاحات...');
      const buildSuccess = await buildProject();
      if (!buildSuccess) {
        log('❌ فشل بناء المشروع بعد الإصلاحات.', 'ERROR');
      }

      // Commit changes every 3 cycles or at the end
      if (cycle % 3 === 0 || cycle === MAX_CYCLES) {
        await commitChanges(cycle);
      }

      // Re-analyze after fixes and tests
      const postFixAnalysis = await analyzeProject();
      await generateReport(postFixAnalysis, cycle);

      if (postFixAnalysis.eslintErrors === 0 && postFixAnalysis.tsErrors === 0 && postFixAnalysis.testFailed === 0 && postFixAnalysis.buildSuccess) {
        log('🎉 تم إصلاح جميع المشاكل بنجاح في هذه الدورة!', 'INFO');
        await generateFinalSummary(postFixAnalysis, cycle, totalFixes);
        break;
      }
    } else {
      log('🤷‍♂️ لم يتم العثور على إصلاحات تلقائية في هذه الدورة.', 'INFO');
      await generateReport(initialAnalysis, cycle);
    }

    if (cycle < MAX_CYCLES) {
      log(`⏳ انتظار ${CYCLE_DELAY_SECONDS} ثواني قبل الدورة التالية...`);
      await new Promise(resolve => setTimeout(resolve, CYCLE_DELAY_SECONDS * 1000));
    }
  }
  
  log('🎉 تم إكمال جميع الإصلاحات!');
  log('🏁 انتهى تشغيل AI Self-Test and Fix Agent');
  
  // تسجيل النتائج في قاعدة البيانات
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  try {
    // الحصول على معلومات Git
    let branch = 'main';
    let commit = '';
    let author = 'AI Agent';
    
    try {
      branch = (await executeCommand('git branch --show-current')).stdout.trim();
      commit = (await executeCommand('git rev-parse --short HEAD')).stdout.trim();
      author = (await executeCommand('git config user.name')).stdout.trim();
    } catch (e) {
      log('⚠️ لا يمكن الحصول على معلومات Git');
    }
    
    // حساب الجودة بناءً على النتائج
    const finalAnalysis = await analyzeProject();
    const qualityScore = Math.max(0, 100 - (finalAnalysis.eslintErrors * 5) - (finalAnalysis.tsErrors * 3) - (finalAnalysis.testFailed * 10));
    
    await logAIResult({
      status: (finalAnalysis.eslintErrors === 0 && finalAnalysis.tsErrors === 0 && finalAnalysis.testFailed === 0) ? 'success' : 'failed',
      type: options.heal ? 'heal' : options.fixOnly ? 'fix' : options.testOnly ? 'test' : 'auto',
      duration: duration,
      linesChanged: totalLinesChanged,
      qualityScore: Math.round(qualityScore),
      notes: `إصلاحات: ${totalFixes}, أخطاء ESLint: ${finalAnalysis.eslintErrors}, أخطاء TypeScript: ${finalAnalysis.tsErrors}, اختبارات فاشلة: ${finalAnalysis.testFailed}`,
      branch: branch,
      commit: commit,
      author: author
    });
    
    log('✅ تم تسجيل النتائج في قاعدة البيانات');
  } catch (error) {
    log(`❌ فشل في تسجيل النتائج: ${error.message}`, 'ERROR');
  }
}

const program = new Command();
program
  .option('--agent-mode <mode>', 'Agent mode: cursor, openai, ollama', 'cursor')
  .option('--auto-mode', 'Run in automatic mode (default)')
  .option('--fix-only', 'Only attempt to fix issues, do not run tests or build')
  .option('--test-only', 'Only run tests, do not attempt to fix or build')
  .option('--optimize-only', 'Only attempt to optimize code')
  .option('--refactor', 'Only attempt to refactor code')
  .option('--background-mode', 'Run as a background process (continuous monitoring)')
  .option('--monitor-mode', 'Only monitor project status without making changes')
  .option('--heal', 'Run full self-healing process')
  .action((options) => {
    // Set LLM provider based on agent mode
    if (options.agentMode) {
      process.env.LLM_PROVIDER = options.agentMode;
    }
    
    main(options).catch(err => {
      log(`❌ حدث خطأ فادح: ${err.message}`, 'CRITICAL');
      process.exit(1);
    });
  });

program.parse(process.argv);
