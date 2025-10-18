#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ComprehensiveReporter {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      runId: process.env.RUN_ID || `run-${Date.now()}`,
      trigger: process.env.GITHUB_EVENT_NAME || 'manual',
      branch: process.env.GITHUB_REF_NAME || 'unknown',
      commit: process.env.GITHUB_SHA || 'unknown',
      timings: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: 'calculated'
      },
      modulesTested: {},
      summary: {
        overallStatus: 'unknown',
        errors: [],
        warnings: [],
        qualityScore: 0
      },
      artifacts: {
        paths: [],
        urls: []
      },
      recommendations: []
    };
  }

  analyzeTestResults() {
    console.log('📊 تحليل نتائج الاختبارات...');
    
    // تحليل نتائج Playwright
    const playwrightReport = this.analyzePlaywrightResults();
    
    // تحليل نتائج Supawright
    const supawrightReport = this.analyzeSupawrightResults();
    
    // تحليل نتائج الوحدة
    const unitTestReport = this.analyzeUnitTestResults();
    
    // حساب النقاط الإجمالية
    this.calculateQualityScore(playwrightReport, supawrightReport, unitTestReport);
    
    return {
      playwright: playwrightReport,
      supawright: supawrightReport,
      unit: unitTestReport
    };
  }

  analyzePlaywrightResults() {
    try {
      const reportPath = 'playwright-report/results.json';
      if (fs.existsSync(reportPath)) {
        const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        return {
          total: results.stats?.total || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
          duration: results.stats?.duration || 0
        };
      }
    } catch (error) {
      console.log('⚠️ خطأ في تحليل نتائج Playwright:', error.message);
    }
    
    return { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
  }

  analyzeSupawrightResults() {
    try {
      const reportPath = 'supawright-report/results.json';
      if (fs.existsSync(reportPath)) {
        const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        return {
          total: results.stats?.total || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
          duration: results.stats?.duration || 0
        };
      }
    } catch (error) {
      console.log('⚠️ خطأ في تحليل نتائج Supawright:', error.message);
    }
    
    return { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
  }

  analyzeUnitTestResults() {
    try {
      const reportPath = 'test-results/results.json';
      if (fs.existsSync(reportPath)) {
        const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        return {
          total: results.stats?.total || 0,
          passed: results.stats?.passed || 0,
          failed: results.stats?.failed || 0,
          skipped: results.stats?.skipped || 0,
          duration: results.stats?.duration || 0
        };
      }
    } catch (error) {
      console.log('⚠️ خطأ في تحليل نتائج الوحدة:', error.message);
    }
    
    return { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
  }

  calculateQualityScore(playwrightReport, supawrightReport, unitTestReport) {
    let totalTests = 0;
    let passedTests = 0;
    
    // حساب النقاط من Playwright
    totalTests += playwrightReport.total;
    passedTests += playwrightReport.passed;
    
    // حساب النقاط من Supawright
    totalTests += supawrightReport.total;
    passedTests += supawrightReport.passed;
    
    // حساب النقاط من الوحدة
    totalTests += unitTestReport.total;
    passedTests += unitTestReport.passed;
    
    // حساب النقاط
    if (totalTests > 0) {
      this.report.summary.qualityScore = Math.round((passedTests / totalTests) * 100);
    } else {
      this.report.summary.qualityScore = 0;
    }
    
    // تحديد الحالة العامة
    if (this.report.summary.qualityScore >= 90) {
      this.report.summary.overallStatus = 'excellent';
    } else if (this.report.summary.qualityScore >= 70) {
      this.report.summary.overallStatus = 'good';
    } else if (this.report.summary.qualityScore >= 50) {
      this.report.summary.overallStatus = 'fair';
    } else {
      this.report.summary.overallStatus = 'poor';
    }
  }

  generateRecommendations() {
    console.log('💡 إنشاء التوصيات...');
    
    if (this.report.summary.qualityScore < 70) {
      this.report.recommendations.push('تحسين تغطية الاختبارات');
      this.report.recommendations.push('إصلاح الاختبارات الفاشلة');
    }
    
    if (this.report.summary.qualityScore < 50) {
      this.report.recommendations.push('مراجعة شاملة للكود');
      this.report.recommendations.push('إعادة كتابة الاختبارات');
    }
    
    if (this.report.summary.qualityScore >= 90) {
      this.report.recommendations.push('الحفاظ على جودة الكود');
      this.report.recommendations.push('إضافة اختبارات جديدة');
    }
  }

  generateHumanReadableReport() {
    console.log('📝 إنشاء التقرير البشري...');
    
    const humanReport = `# 🚀 Ultimate CI Self-Healing Report

## 📋 ملخص التنفيذ
- **الوقت:** ${this.report.timestamp}
- **معرف الدورة:** ${this.report.runId}
- **الفرع:** ${this.report.branch}
- **الـ Commit:** ${this.report.commit}
- **المشغل:** ${this.report.trigger}

## 📊 النتائج
- **الحالة العامة:** ${this.report.summary.overallStatus}
- **نقاط الجودة:** ${this.report.summary.qualityScore}%
- **الأخطاء:** ${this.report.summary.errors.length}
- **التحذيرات:** ${this.report.summary.warnings.length}

## 🧪 الاختبارات
- **Playwright:** ${this.report.modulesTested.playwright?.passed || 0}/${this.report.modulesTested.playwright?.total || 0}
- **Supawright:** ${this.report.modulesTested.supawright?.passed || 0}/${this.report.modulesTested.supawright?.total || 0}
- **الوحدة:** ${this.report.modulesTested.unit?.passed || 0}/${this.report.modulesTested.unit?.total || 0}

## 💡 التوصيات
${this.report.recommendations.map(rec => `- ${rec}`).join('\n')}

## 📁 المرفقات
- تقرير Playwright: playwright-report/
- تقرير Supawright: supawright-report/
- سجلات التنفيذ: execution.log
`;

    fs.writeFileSync('reports/final_summary.md', humanReport);
  }

  async generateReport() {
    console.log('📊 بدء إنشاء التقرير الشامل...');
    
    // إنشاء مجلدات التقارير
    fs.mkdirSync('reports', { recursive: true });
    fs.mkdirSync('dashboard', { recursive: true });
    
    // تحليل النتائج
    const testResults = this.analyzeTestResults();
    
    // إنشاء التوصيات
    this.generateRecommendations();
    
    // إنشاء التقرير البشري
    this.generateHumanReadableReport();
    
    // حفظ التقرير JSON
    fs.writeFileSync('reports/ai_validation_report.json', JSON.stringify(this.report, null, 2));
    
    // تحديث Dashboard
    this.updateDashboard();
    
    console.log('✅ تم إنشاء التقرير الشامل');
    console.log(`📊 نقاط الجودة: ${this.report.summary.qualityScore}%`);
    console.log(`📝 التقرير: reports/final_summary.md`);
  }

  updateDashboard() {
    console.log('📊 تحديث Dashboard...');
    
    const dashboardData = {
      lastUpdate: new Date().toISOString(),
      runId: this.report.runId,
      status: this.report.summary.overallStatus,
      qualityScore: this.report.summary.qualityScore,
      summary: {
        testsRun: Object.values(this.report.modulesTested).reduce((sum, module) => sum + (module.total || 0), 0),
        testsPassed: Object.values(this.report.modulesTested).reduce((sum, module) => sum + (module.passed || 0), 0),
        fixesApplied: 0,
        qualityScore: this.report.summary.qualityScore
      }
    };
    
    fs.writeFileSync('dashboard/logs.json', JSON.stringify(dashboardData, null, 2));
  }
}

// تشغيل التقرير إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const reporter = new ComprehensiveReporter();
  reporter.generateReport().catch(console.error);
}

module.exports = ComprehensiveReporter;