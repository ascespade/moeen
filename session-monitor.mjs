#!/usr/bin/env node

/**
 * Session Monitor - مراقب الجلسة
 * يراقب الجلسة مع الـ request ID المحدد
 */

import fs from 'fs';
import { spawn } from 'child_process';

const SESSION_ID = 'bc-94584685-4a5e-4fc1-a779-72899dcd2169';

console.log('🎯 Session Monitor Started');
console.log(`📋 Request ID: ${SESSION_ID}`);
console.log('================================');

// Monitor session status
function monitorSession() {
  try {
    const statusData = fs.readFileSync('system-status.json', 'utf8');
    const status = JSON.parse(statusData);
    
    console.log(`📊 Session Status: ${status.status}`);
    console.log(`🕐 Last Check: ${new Date(status.lastCheck).toLocaleString('ar-SA')}`);
    console.log(`🔄 Monitoring: ${status.isMonitoring ? 'Active' : 'Inactive'}`);
    
    if (status.sessionId === SESSION_ID) {
      console.log('✅ Correct Session ID found');
    } else {
      console.log('⚠️ Different Session ID');
    }
    
  } catch (error) {
    console.log('❌ Error reading session status:', error.message);
  }
}

// Check running processes
function checkProcesses() {
  console.log('\n🔍 Checking Background Processes...');
  
  // Check if background-monitor is running
  const monitorProcess = spawn('tasklist', ['/FI', 'IMAGENAME eq node.exe'], {
    stdio: 'pipe'
  });
  
  monitorProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('node.exe')) {
      console.log('✅ Node.js processes running');
    }
  });
}

// Main monitoring loop
function startMonitoring() {
  console.log('🚀 Starting Session Monitoring...');
  
  // Initial check
  monitorSession();
  checkProcesses();
  
  // Monitor every 30 seconds
  setInterval(() => {
    console.log('\n' + '='.repeat(50));
    console.log(`🕐 ${new Date().toLocaleString('ar-SA')}`);
    monitorSession();
    checkProcesses();
  }, 30000);
  
  console.log('👀 Monitoring active - Press Ctrl+C to stop');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping session monitor...');
  process.exit(0);
});

// Start monitoring
startMonitoring();
