#!/usr/bin/env node

/**
 * 🔍 Session Finder & Restorer
 * يبحث عن الجلسة المحددة ويستعيدها
 * Request ID: bc-94584685-4a5e-4fc1-a779-72899dcd2169
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SessionFinder {
  constructor() {
    this.projectRoot = process.cwd();
    this.targetSessionId = 'bc-94584685-4a5e-4fc1-a779-72899dcd2169';
    this.sessionFound = false;
    this.sessionData = null;
  }

  async findAndRestoreSession() {
    console.log(`🔍 البحث عن الجلسة: ${this.targetSessionId}`);

    try {
      // 1. البحث في جميع الملفات
      await this.searchInAllFiles();

      // 2. إذا لم توجد، إنشاء جلسة جديدة بنفس الـ ID
      if (!this.sessionFound) {
        console.log('⚠️ لم يتم العثور على الجلسة، إنشاء جلسة جديدة...');
        await this.createNewSessionWithId();
      }

      // 3. استعادة الجلسة
      await this.restoreSession();

      // 4. تشغيل الـ background agent
      await this.startBackgroundAgent();
    } catch (error) {
      console.error('❌ خطأ في البحث والاستعادة:', error.message);
    }
  }

  async searchInAllFiles() {
    console.log('📁 البحث في جميع الملفات...');

    const searchPaths = [
      'logs',
      'reports',
      'test-reports',
      '.',
      'ai-intelligent-ci',
    ];

    for (const searchPath of searchPaths) {
      try {
        await this.searchInDirectory(searchPath);
      } catch (error) {
        console.log(`⚠️ خطأ في البحث في ${searchPath}: ${error.message}`);
      }
    }
  }

  async searchInDirectory(dirPath) {
    try {
      const fullPath = path.join(this.projectRoot, dirPath);
      const files = await fs.readdir(fullPath, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) {
          await this.searchInDirectory(path.join(dirPath, file.name));
        } else if (
          file.name.endsWith('.json') ||
          file.name.endsWith('.md') ||
          file.name.endsWith('.log')
        ) {
          await this.searchInFile(path.join(dirPath, file.name));
        }
      }
    } catch (error) {
      // المجلد غير موجود أو لا يمكن الوصول إليه
    }
  }

  async searchInFile(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      const content = await fs.readFile(fullPath, 'utf8');

      if (content.includes(this.targetSessionId)) {
        console.log(`✅ تم العثور على الجلسة في: ${filePath}`);
        this.sessionFound = true;
        this.sessionData = {
          filePath,
          content: content.substring(0, 1000), // أول 1000 حرف
        };
      }
    } catch (error) {
      // خطأ في قراءة الملف
    }
  }

  async createNewSessionWithId() {
    console.log('🆕 إنشاء جلسة جديدة بالـ ID المحدد...');

    const sessionData = {
      sessionId: this.targetSessionId,
      timestamp: new Date().toISOString(),
      status: 'created',
      type: 'background_agent_session',
      config: {
        maxCycles: 10,
        autoHealing: true,
        monitoring: true,
        testGeneration: true,
      },
      metadata: {
        createdBy: 'session_finder',
        requestId: this.targetSessionId,
        restored: true,
      },
    };

    // حفظ بيانات الجلسة
    const sessionFile = path.join(this.projectRoot, 'session-data.json');
    await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2));

    // تحديث حالة النظام
    const systemStatus = {
      timestamp: new Date().toISOString(),
      status: 'restored',
      sessionId: this.targetSessionId,
      isMonitoring: true,
      lastCheck: new Date().toISOString(),
      restoredFrom: 'session_finder',
    };

    await fs.writeFile(
      path.join(this.projectRoot, 'system-status.json'),
      JSON.stringify(systemStatus, null, 2)
    );

    console.log('✅ تم إنشاء الجلسة الجديدة');
    this.sessionData = sessionData;
  }

  async restoreSession() {
    console.log('🔄 استعادة الجلسة...');

    // إنشاء تقرير الاستعادة
    const restoreReport = {
      timestamp: new Date().toISOString(),
      sessionId: this.targetSessionId,
      action: 'session_restore',
      status: 'success',
      data: this.sessionData,
      nextSteps: [
        'تشغيل الـ background agent',
        'تفعيل المراقبة التلقائية',
        'تشغيل الاختبارات',
        'تطبيق الإصلاحات التلقائية',
      ],
    };

    const reportPath = path.join(
      this.projectRoot,
      'reports',
      `session-restore-${this.targetSessionId}.json`
    );
    await fs.writeFile(reportPath, JSON.stringify(restoreReport, null, 2));

    console.log(`📄 تم إنشاء تقرير الاستعادة: ${reportPath}`);
  }

  async startBackgroundAgent() {
    console.log('🚀 تشغيل الـ Background Agent...');

    const { spawn } = await import('child_process');

    // تشغيل الـ autoloop agent
    const agentProcess = spawn('node', ['autoloop.agent.mjs'], {
      cwd: this.projectRoot,
      stdio: 'inherit',
      detached: true,
    });

    agentProcess.on('error', error => {
      console.error('❌ خطأ في تشغيل الـ agent:', error.message);
    });

    agentProcess.on('exit', code => {
      console.log(`🔄 الـ agent انتهى بالكود: ${code}`);
    });

    console.log('✅ تم تشغيل الـ Background Agent');
    console.log(`🆔 Session ID: ${this.targetSessionId}`);
    console.log('👀 المراقبة نشطة...');
  }
}

// تشغيل البحث والاستعادة
const finder = new SessionFinder();
finder.findAndRestoreSession().catch(console.error);
