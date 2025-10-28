#!/usr/bin/env node

/**
 * 🎯 Start Live Dashboard
 *
 * This script starts the live dashboard monitoring system
 * and keeps it running with auto-refresh capabilities
 */

const LiveDashboard = require('./live-dashboard');

async function startDashboard() {
  try {
    console.log('🎯 Starting Live Dashboard System...');

    const dashboard = new LiveDashboard();
    await dashboard.start();

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Live Dashboard...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down Live Dashboard...');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error starting Live Dashboard:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  startDashboard();
}

module.exports = startDashboard;
