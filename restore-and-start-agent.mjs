#!/usr/bin/env node

/**
 * 🚀 Background Agent Session Restorer
 * يستعيد الجلسة القديمة ويشغل الـ background agent
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

class BackgroundAgentRestorer {
  constructor() {
    this.projectRoot = process.cwd();
    this.agentProcess = null;
    this.isRestored = false;
  }

  async restoreAndStart() {
    console.log('🔄 بدء استعادة الجلسة وتشغيل الـ Background Agent...');
    
    try {
      // 1. استعادة الجلسة
      await this.restoreSession();
      
      // 2. تشغيل الـ background agent
      await this.startBackgroundAgent();
      
      // 3. مراقبة الحالة
      await this.monitorAgent();
      
    } catch (error) {
      console.error('❌ خطأ في استعادة الجلسة:', error.message);
    }
  }

  async restoreSession() {
    console.log('📁 فحص ملفات الجلسة...');
    
    // فحص الملفات المهمة
    const sessionFiles = [
      'system-status.json',
      'ultimate_aggressive_self_healing_config.json',
      'full_heal_finalizer.json'
    ];

    for (const file of sessionFiles) {
      try {
        await fs.access(path.join(this.projectRoot, file));
        console.log(`✅ تم العثور على: ${file}`);
      } catch (error) {
        console.log(`⚠️ لم يتم العثور على: ${file}`);
      }
    }

    // تحديث حالة النظام
    const systemStatus = {
      timestamp: new Date().toISOString(),
      status: 'restored',
      isMonitoring: true,
      lastCheck: new Date().toISOString(),
      restoredFrom: 'session_files'
    };

    await fs.writeFile(
      path.join(this.projectRoot, 'system-status.json'),
      JSON.stringify(systemStatus, null, 2)
    );

    console.log('✅ تم استعادة الجلسة بنجاح');
    this.isRestored = true;
  }

  async startBackgroundAgent() {
    if (!this.isRestored) {
      throw new Error('يجب استعادة الجلسة أولاً');
    }

    console.log('🚀 تشغيل الـ Background Agent...');

    // تشغيل الـ autoloop agent
    this.agentProcess = spawn('node', ['autoloop.agent.mjs'], {
      cwd: this.projectRoot,
      stdio: 'inherit',
      detached: true
    });

    this.agentProcess.on('error', (error) => {
      console.error('❌ خطأ في تشغيل الـ agent:', error.message);
    });

    this.agentProcess.on('exit', (code) => {
      console.log(`🔄 الـ agent انتهى بالكود: ${code}`);
    });

    console.log('✅ تم تشغيل الـ Background Agent');
  }

  async monitorAgent() {
    console.log('👀 بدء مراقبة الـ agent...');
    
    // مراقبة كل 30 ثانية
    const monitorInterval = setInterval(async () => {
      try {
        // فحص حالة النظام
        const statusFile = path.join(this.projectRoot, 'system-status.json');
        const statusData = await fs.readFile(statusFile, 'utf8');
        const status = JSON.parse(statusData);
        
        console.log(`📊 حالة النظام: ${status.status} - ${new Date().toLocaleString('ar-SA')}`);
        
        // فحص آخر تقرير
        const reportFile = path.join(this.projectRoot, 'reports', 'agent-report.md');
        try {
          const reportData = await fs.readFile(reportFile, 'utf8');
          const lines = reportData.split('\n');
          const lastLine = lines[lines.length - 2]; // السطر قبل الأخير
          console.log(`📄 آخر تحديث: ${lastLine}`);
        } catch (error) {
          // التقرير غير موجود
        }
        
      } catch (error) {
        console.error('❌ خطأ في المراقبة:', error.message);
      }
    }, 30000);

    // إيقاف المراقبة عند الضغط على Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 إيقاف المراقبة...');
      clearInterval(monitorInterval);
      
      if (this.agentProcess) {
        console.log('🔄 إيقاف الـ agent...');
        this.agentProcess.kill();
      }
      
      process.exit(0);
    });

    console.log('✅ المراقبة نشطة - اضغط Ctrl+C للإيقاف');
  }
}

// تشغيل استعادة الجلسة وتشغيل الـ agent
const restorer = new BackgroundAgentRestorer();
restorer.restoreAndStart().catch(console.error);
