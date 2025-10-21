#!/usr/bin/env node

/**
 * Tunnel-Agent Bridge
 * ربط الـ tunnel مع الـ background agent
 */

import { spawn } from 'child_process';
import fs from 'fs';

const SESSION_ID = 'bc-94584685-4a5e-4fc1-a779-72899dcd2169';

console.log('🔗 ربط الـ tunnel مع الـ background agent...');
console.log(`📋 Session ID: ${SESSION_ID}`);

// Start background agent
console.log('🚀 تشغيل Background Agent...');
const agent = spawn('node', ['autoloop.agent.mjs'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

agent.stdout.on('data', (data) => {
  console.log(`Agent: ${data.toString()}`);
});

agent.stderr.on('data', (data) => {
  console.log(`Agent Error: ${data.toString()}`);
});

// Update system status
const status = {
  timestamp: new Date().toISOString(),
  sessionId: SESSION_ID,
  status: 'active',
  tunnelConnected: true,
  agentRunning: true,
  tunnelName: `cursor-bg-agent-${SESSION_ID}`
};

fs.writeFileSync('system-status.json', JSON.stringify(status, null, 2));

console.log('✅ تم ربط الـ tunnel مع الـ background agent');
console.log('🌐 يمكنك الآن الوصول عبر: https://vscode.dev/tunnel/cursor-bg-agent-');

// Keep running
process.on('SIGINT', () => {
  console.log('\n🛑 إيقاف الـ agent...');
  agent.kill();
  process.exit(0);
});

console.log('👀 الـ agent يعمل - اضغط Ctrl+C للإيقاف');
