#!/usr/bin/env node

/**
 * 🔄 Session Restorer - استعادة الجلسة القديمة
 * يستعيد حالة الـ background agent من الملفات المحفوظة
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SessionRestorer {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionFiles = [
      'system-status.json',
      'ai_training_cache.json',
      'ultimate_aggressive_self_healing_config.json',
      'full_heal_finalizer.json',
      'logs/last-maintenance.json',
      'logs/pre-db-health.json'
    ];
  }

  async restoreSession() {
    console.log('🔄 بدء استعادة الجلسة القديمة...');
    
    try {
      // فحص الملفات الموجودة
      const availableFiles = await this.checkAvailableFiles();
      console.log(`📁 تم العثور على ${availableFiles.length} ملف جلسة`);
      
      // استعادة حالة النظام
      const systemStatus = await this.restoreSystemStatus();
      
      // استعادة إعدادات الـ agent
      const agentConfig = await this.restoreAgentConfig();
      
      // استعادة حالة الاختبارات
      const testStatus = await this.restoreTestStatus();
      
      // إنشاء تقرير الاستعادة
      await this.createRestoreReport({
        systemStatus,
        agentConfig,
        testStatus,
        restoredFiles: availableFiles
      });
      
      console.log('✅ تم استعادة الجلسة بنجاح!');
      console.log('🚀 يمكنك الآن تشغيل الـ background agent');
      
    } catch (error) {
      console.error('❌ خطأ في استعادة الجلسة:', error.message);
    }
  }

  async checkAvailableFiles() {
    const available = [];
    for (const file of this.sessionFiles) {
      try {
        await fs.access(path.join(this.projectRoot, file));
        available.push(file);
      } catch (error) {
        // الملف غير موجود
      }
    }
    return available;
  }

  async restoreSystemStatus() {
    try {
      const statusFile = path.join(this.projectRoot, 'system-status.json');
      const statusData = await fs.readFile(statusFile, 'utf8');
      const status = JSON.parse(statusData);
      
      console.log(`📊 حالة النظام: ${status.status}`);
      console.log(`⏰ آخر فحص: ${status.lastCheck}`);
      
      return status;
    } catch (error) {
      console.log('⚠️ لم يتم العثور على ملف حالة النظام');
      return null;
    }
  }

  async restoreAgentConfig() {
    try {
      const configFile = path.join(this.projectRoot, 'ultimate_aggressive_self_healing_config.json');
      const configData = await fs.readFile(configFile, 'utf8');
      const config = JSON.parse(configData);
      
      console.log(`🤖 إعدادات الـ Agent: ${config.name}`);
      console.log(`🎯 الهدف: ${config.primary_objective}`);
      
      return config;
    } catch (error) {
      console.log('⚠️ لم يتم العثور على إعدادات الـ agent');
      return null;
    }
  }

  async restoreTestStatus() {
    try {
      const testReportsDir = path.join(this.projectRoot, 'test-reports');
      const files = await fs.readdir(testReportsDir);
      const latestReport = files
        .filter(f => f.endsWith('.json'))
        .sort()
        .pop();
      
      if (latestReport) {
        const reportPath = path.join(testReportsDir, latestReport);
        const reportData = await fs.readFile(reportPath, 'utf8');
        const report = JSON.parse(reportData);
        
        console.log(`🧪 آخر تقرير اختبار: ${latestReport}`);
        console.log(`📈 النتائج: ${report.summary || 'غير متوفر'}`);
        
        return report;
      }
    } catch (error) {
      console.log('⚠️ لم يتم العثور على تقارير الاختبارات');
    }
    return null;
  }

  async createRestoreReport(data) {
    const report = {
      timestamp: new Date().toISOString(),
      action: 'session_restore',
      restoredData: data,
      nextSteps: [
        'تشغيل الـ background agent',
        'فحص حالة النظام',
        'تشغيل الاختبارات',
        'مراقبة الأداء'
      ]
    };

    const reportPath = path.join(this.projectRoot, 'reports', 'session-restore-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 تم إنشاء تقرير الاستعادة: reports/session-restore-report.json`);
  }
}

// تشغيل استعادة الجلسة
const restorer = new SessionRestorer();
restorer.restoreSession().catch(console.error);
