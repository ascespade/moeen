#!/usr/bin/env node

/**
 * استعادة سريعة للجلسة
 * Quick Session Restore
 */

import fs from 'fs';
import { spawn } from 'child_process';

const SESSION_ID = 'bc-94584685-4a5e-4fc1-a779-72899dcd2169';

console.log('🔄 استعادة الجلسة...');
console.log(`📋 Session ID: ${SESSION_ID}`);

// تحديث حالة النظام
const systemStatus = {
  timestamp: new Date().toISOString(),
  sessionId: SESSION_ID,
  status: 'active',
  isMonitoring: true,
  lastCheck: new Date().toISOString(),
  restoredAt: new Date().toISOString()
};

fs.writeFileSync('system-status.json', JSON.stringify(systemStatus, null, 2));
console.log('✅ تم تحديث حالة النظام');

// تشغيل background monitor
console.log('🚀 تشغيل Background Monitor...');
const monitor = spawn('node', ['background-monitor.js'], {
  stdio: 'inherit',
  detached: false
});

monitor.on('error', (error) => {
  console.error('❌ خطأ:', error.message);
});

monitor.on('exit', (code) => {
  console.log(`Background Monitor exited with code ${code}`);
});

console.log('✅ تم تشغيل Background Monitor');

