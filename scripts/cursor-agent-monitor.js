#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class CursorAgentMonitor {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/cursor-agent-monitor.log');
    this.pidFile = path.join(__dirname, '../temp/cursor-agent.pid');
    this.checkInterval = 5 * 60 * 1000; // 5 minutes
    this.isRunning = false;
    this.startTime = new Date();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async checkCursorAgentStatus() {
    try {
      // Check if PID file exists and process is running
      if (fs.existsSync(this.pidFile)) {
        const pid = fs.readFileSync(this.pidFile, 'utf8').trim();
        
        // Check if process is actually running
        const isRunning = await this.isProcessRunning(pid);
        if (isRunning) {
          this.log('Cursor Agent is running (PID: ' + pid + ')');
          return true;
        } else {
          this.log('Cursor Agent PID file exists but process not running');
          fs.unlinkSync(this.pidFile);
        }
      }
      
      this.log('Cursor Agent is not running');
      return false;
    } catch (error) {
      this.log('Error checking Cursor Agent status: ' + error.message);
      return false;
    }
  }

  async isProcessRunning(pid) {
    return new Promise((resolve) => {
      exec(`ps -p ${pid}`, (error) => {
        resolve(!error);
      });
    });
  }

  async startCursorAgent() {
    try {
      this.log('Starting Cursor Agent...');
      
      // Start Cursor Agent process
      const cursorAgent = spawn('node', ['scripts/cursor-agent.js'], {
        detached: true,
        stdio: 'ignore'
      });

      // Save PID
      fs.writeFileSync(this.pidFile, cursorAgent.pid.toString());
      
      // Detach from parent process
      cursorAgent.unref();
      
      this.log('Cursor Agent started successfully (PID: ' + cursorAgent.pid + ')');
      return true;
    } catch (error) {
      this.log('Failed to start Cursor Agent: ' + error.message);
      return false;
    }
  }

  async restartCursorAgent() {
    this.log('Restarting Cursor Agent...');
    
    // Kill existing process if running
    if (fs.existsSync(this.pidFile)) {
      const pid = fs.readFileSync(this.pidFile, 'utf8').trim();
      try {
        process.kill(pid, 'SIGTERM');
        this.log('Sent SIGTERM to existing Cursor Agent (PID: ' + pid + ')');
      } catch (error) {
        this.log('Error killing existing process: ' + error.message);
      }
      fs.unlinkSync(this.pidFile);
    }
    
    // Wait a moment before restarting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start new process
    return await this.startCursorAgent();
  }

  async monitor() {
    this.log('Starting Cursor Agent Monitor...');
    this.isRunning = true;
    
    while (this.isRunning) {
      try {
        const isAgentRunning = await this.checkCursorAgentStatus();
        
        if (!isAgentRunning) {
          this.log('Cursor Agent not running, attempting restart...');
          const restartSuccess = await this.restartCursorAgent();
          
          if (!restartSuccess) {
            this.log('Failed to restart Cursor Agent, will retry in next cycle');
          }
        }
        
        // Wait for next check
        await new Promise(resolve => setTimeout(resolve, this.checkInterval));
        
      } catch (error) {
        this.log('Error in monitor loop: ' + error.message);
        await new Promise(resolve => setTimeout(resolve, this.checkInterval));
      }
    }
  }

  stop() {
    this.log('Stopping Cursor Agent Monitor...');
    this.isRunning = false;
  }

  getUptime() {
    const now = new Date();
    const uptime = now - this.startTime;
    return Math.floor(uptime / 1000); // seconds
  }
}

// Main execution
if (require.main === module) {
  const monitor = new CursorAgentMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    monitor.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    monitor.stop();
    process.exit(0);
  });
  
  // Start monitoring
  monitor.monitor().catch(error => {
    console.error('Monitor failed:', error);
    process.exit(1);
  });
}

module.exports = CursorAgentMonitor;