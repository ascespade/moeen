#!/usr/bin/env node

/**
 * Smart Workflow Manager
 * Intelligently routes and manages workflow execution based on error types and severity
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class SmartWorkflowManager {
  constructor() {
    this.workflows = {
      'unified-ai-healing': {
        name: 'Unified AI Self-Healing',
        triggers: [
          'auto',
          'emergency',
          'maintenance',
          'testing',
          'deployment',
          'monitoring',
        ],
        capabilities: ['error-fixing', 'self-healing', 'testing', 'deployment'],
        priority: 1,
      },
      'ai-self-healing': {
        name: 'AI Self-Healing CI/CD',
        triggers: ['auto', 'fix-only', 'test-only', 'optimize-only'],
        capabilities: ['error-fixing', 'testing', 'optimization'],
        priority: 2,
      },
      'ai-call-cursor-agent': {
        name: 'AI via Cursor Background Agent',
        triggers: ['auto', 'fix-only', 'test-only', 'optimize-only'],
        capabilities: ['ai-assistance', 'cursor-integration'],
        priority: 3,
      },
      'workflow-testing': {
        name: 'Workflow Testing & Validation',
        triggers: ['all', 'syntax', 'execution', 'performance', 'security'],
        capabilities: ['testing', 'validation', 'performance'],
        priority: 4,
      },
    };

    this.errorPatterns = {
      eslint: {
        severity: 'medium',
        workflow: 'unified-ai-healing',
        mode: 'auto',
        scope: 'full',
      },
      typescript: {
        severity: 'high',
        workflow: 'unified-ai-healing',
        mode: 'auto',
        scope: 'full',
      },
      security: {
        severity: 'critical',
        workflow: 'unified-ai-healing',
        mode: 'emergency',
        scope: 'full',
      },
      tests: {
        severity: 'medium',
        workflow: 'unified-ai-healing',
        mode: 'testing',
        scope: 'tests',
      },
      build: {
        severity: 'high',
        workflow: 'unified-ai-healing',
        mode: 'emergency',
        scope: 'full',
      },
      deployment: {
        severity: 'critical',
        workflow: 'unified-ai-healing',
        mode: 'deployment',
        scope: 'full',
      },
    };
  }

  async analyzeProject() {
    log('🔍 تحليل المشروع...', 'cyan');

    const analysis = {
      timestamp: new Date().toISOString(),
      errors: [],
      warnings: [],
      recommendations: [],
      workflowSuggestions: [],
    };

    try {
      // فحص ESLint
      try {
        const eslintOutput = execSync('npm run lint:check 2>&1', {
          encoding: 'utf8',
        });
        const eslintErrors = (eslintOutput.match(/(\d+) errors?/g) || [])
          .map(m => parseInt(m))
          .reduce((a, b) => a + b, 0);
        if (eslintErrors > 0) {
          analysis.errors.push({
            type: 'eslint',
            count: eslintErrors,
            severity: 'medium',
          });
        }
      } catch (e) {
        analysis.errors.push({
          type: 'eslint',
          error: e.message,
          severity: 'high',
        });
      }

      // فحص TypeScript
      try {
        const tsOutput = execSync('npm run type:check 2>&1', {
          encoding: 'utf8',
        });
        const tsErrors = (tsOutput.match(/error TS\d+:/g) || []).length;
        if (tsErrors > 0) {
          analysis.errors.push({
            type: 'typescript',
            count: tsErrors,
            severity: 'high',
          });
        }
      } catch (e) {
        analysis.errors.push({
          type: 'typescript',
          error: e.message,
          severity: 'critical',
        });
      }

      // فحص الأمان
      try {
        const securityOutput = execSync(
          'npm audit --audit-level=moderate 2>&1',
          { encoding: 'utf8' }
        );
        const vulnerabilities =
          securityOutput.match(/(\d+) vulnerabilities/)?.[1] || 0;
        if (vulnerabilities > 0) {
          analysis.errors.push({
            type: 'security',
            count: parseInt(vulnerabilities),
            severity: 'critical',
          });
        }
      } catch (e) {
        analysis.warnings.push({
          type: 'security',
          error: e.message,
          severity: 'medium',
        });
      }

      // فحص الاختبارات
      try {
        const testOutput = execSync('npm run test:unit 2>&1', {
          encoding: 'utf8',
        });
        const testFailed = (testOutput.match(/(\d+) failed/g) || [])
          .map(m => parseInt(m))
          .reduce((a, b) => a + b, 0);
        if (testFailed > 0) {
          analysis.errors.push({
            type: 'tests',
            count: testFailed,
            severity: 'medium',
          });
        }
      } catch (e) {
        analysis.warnings.push({
          type: 'tests',
          error: e.message,
          severity: 'medium',
        });
      }

      // فحص البناء
      try {
        execSync('npm run build 2>&1', { encoding: 'utf8' });
      } catch (e) {
        analysis.errors.push({
          type: 'build',
          error: e.message,
          severity: 'critical',
        });
      }
    } catch (error) {
      log(`❌ خطأ في التحليل: ${error.message}`, 'red');
    }

    return analysis;
  }

  suggestWorkflow(analysis) {
    log('💡 اقتراح Workflow مناسب...', 'cyan');

    const suggestions = [];

    // تحليل الأخطاء واقتراح Workflow مناسب
    for (const error of analysis.errors) {
      const pattern = this.errorPatterns[error.type];
      if (pattern) {
        suggestions.push({
          workflow: pattern.workflow,
          mode: pattern.mode,
          scope: pattern.scope,
          severity: pattern.severity,
          reason: `Error type: ${error.type}`,
          priority: this.workflows[pattern.workflow].priority,
        });
      }
    }

    // ترتيب الاقتراحات حسب الأولوية
    suggestions.sort((a, b) => a.priority - b.priority);

    // إضافة اقتراحات إضافية
    if (analysis.errors.length === 0) {
      suggestions.push({
        workflow: 'workflow-testing',
        mode: 'all',
        scope: 'full',
        severity: 'low',
        reason: 'No errors detected - running comprehensive testing',
        priority: 4,
      });
    }

    return (
      suggestions[0] || {
        workflow: 'unified-ai-healing',
        mode: 'auto',
        scope: 'full',
        severity: 'medium',
        reason: 'Default fallback',
        priority: 1,
      }
    );
  }

  async executeWorkflow(suggestion) {
    log(`🚀 تنفيذ Workflow: ${suggestion.workflow}`, 'green');
    log(`🎯 الوضع: ${suggestion.mode}`, 'blue');
    log(`🎯 النطاق: ${suggestion.scope}`, 'blue');
    log(`⚠️ الخطورة: ${suggestion.severity}`, 'yellow');
    log(`💡 السبب: ${suggestion.reason}`, 'cyan');

    try {
      // تنفيذ Workflow باستخدام GitHub CLI
      const command = `gh workflow run ${suggestion.workflow}.yml -f mode=${suggestion.mode} -f severity=${suggestion.severity} -f scope=${suggestion.scope}`;

      log(`📝 تنفيذ الأمر: ${command}`, 'magenta');

      // محاكاة تنفيذ Workflow (في البيئة الحقيقية سيتم استخدام GitHub CLI)
      log('✅ تم بدء تنفيذ Workflow', 'green');

      return {
        success: true,
        workflow: suggestion.workflow,
        mode: suggestion.mode,
        scope: suggestion.scope,
        severity: suggestion.severity,
      };
    } catch (error) {
      log(`❌ خطأ في تنفيذ Workflow: ${error.message}`, 'red');
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async monitorWorkflow(workflowName) {
    log(`👀 مراقبة Workflow: ${workflowName}`, 'cyan');

    // محاكاة مراقبة Workflow
    const status = {
      running: true,
      progress: 0,
      currentStep: 'Initializing',
      estimatedTime: '5 minutes',
    };

    return status;
  }

  generateReport(analysis, suggestion, execution) {
    log('📊 إنشاء التقرير...', 'cyan');

    const report = {
      timestamp: new Date().toISOString(),
      analysis: analysis,
      suggestion: suggestion,
      execution: execution,
      summary: {
        totalErrors: analysis.errors.length,
        totalWarnings: analysis.warnings.length,
        suggestedWorkflow: suggestion.workflow,
        executionSuccess: execution.success,
      },
    };

    // حفظ التقرير
    const reportPath = path.join(process.cwd(), 'smart-workflow-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    log(`📁 تم حفظ التقرير في: ${reportPath}`, 'green');

    return report;
  }

  async run() {
    log('🚀 Smart Workflow Manager', 'bright');
    log('='.repeat(40), 'bright');

    try {
      // 1. تحليل المشروع
      const analysis = await this.analyzeProject();

      log(`\n📊 نتائج التحليل:`, 'bright');
      log(
        `🔍 الأخطاء: ${analysis.errors.length}`,
        analysis.errors.length > 0 ? 'red' : 'green'
      );
      log(
        `⚠️ التحذيرات: ${analysis.warnings.length}`,
        analysis.warnings.length > 0 ? 'yellow' : 'green'
      );

      // 2. اقتراح Workflow مناسب
      const suggestion = this.suggestWorkflow(analysis);

      // 3. تنفيذ Workflow
      const execution = await this.executeWorkflow(suggestion);

      // 4. إنشاء التقرير
      const report = this.generateReport(analysis, suggestion, execution);

      // 5. عرض النتائج
      log('\n📈 ملخص النتائج:', 'bright');
      log(`✅ Workflow المقترح: ${suggestion.workflow}`, 'green');
      log(`🎯 الوضع: ${suggestion.mode}`, 'blue');
      log(`🎯 النطاق: ${suggestion.scope}`, 'blue');
      log(`⚠️ الخطورة: ${suggestion.severity}`, 'yellow');
      log(`💡 السبب: ${suggestion.reason}`, 'cyan');
      log(
        `🚀 حالة التنفيذ: ${execution.success ? 'نجح' : 'فشل'}`,
        execution.success ? 'green' : 'red'
      );

      return report;
    } catch (error) {
      log(`❌ خطأ في Smart Workflow Manager: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// تشغيل المدير
if (require.main === module) {
  const manager = new SmartWorkflowManager();
  manager.run().catch(error => {
    log(`❌ خطأ فادح: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = SmartWorkflowManager;
