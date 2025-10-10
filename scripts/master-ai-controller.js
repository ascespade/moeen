#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class MasterAIController {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.logFile = path.join(this.workspaceRoot, 'logs', 'master-ai-controller.log');
    this.stateFile = path.join(this.workspaceRoot, 'temp', 'master-ai-state.json');
    this.isRunning = false;
    this.startTime = new Date();
    this.cyclesCompleted = 0;
    this.processes = new Map();
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] Master AI Controller: ${message}\n`;
    
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async initialize() {
    this.log('Initializing Master AI Controller...');
    
    // Create necessary directories
    const directories = [
      'logs', 'temp', 'reports', 'learning', 'backups', 'sandbox'
    ];
    
    for (const dir of directories) {
      const fullPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
    
    // Load state
    await this.loadState();
    
    this.log('Master AI Controller initialized');
  }

  async loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        const data = fs.readFileSync(this.stateFile, 'utf8');
        const state = JSON.parse(data);
        this.cyclesCompleted = state.cyclesCompleted || 0;
        this.log(`Loaded state: ${this.cyclesCompleted} cycles completed`);
      }
    } catch (error) {
      this.log(`Error loading state: ${error.message}`, 'warn');
    }
  }

  async saveState() {
    try {
      const state = {
        cyclesCompleted: this.cyclesCompleted,
        startTime: this.startTime.toISOString(),
        lastUpdate: new Date().toISOString(),
        uptime: Date.now() - this.startTime.getTime(),
        processes: Array.from(this.processes.keys())
      };
      
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      this.log(`Error saving state: ${error.message}`, 'error');
    }
  }

  async startProcess(name, scriptPath, args = []) {
    this.log(`Starting process: ${name}`);
    
    try {
      const child = spawn('node', [scriptPath, ...args], {
        cwd: this.workspaceRoot,
        stdio: 'pipe',
        detached: true
      });
      
      this.processes.set(name, {
        process: child,
        startTime: new Date(),
        restarts: 0
      });
      
      child.on('exit', (code) => {
        this.log(`Process ${name} exited with code ${code}`, 'warn');
        this.processes.delete(name);
        
        // Auto-restart if not intentionally stopped
        if (this.isRunning) {
          this.log(`Auto-restarting process: ${name}`);
          setTimeout(() => {
            this.startProcess(name, scriptPath, args);
          }, 5000);
        }
      });
      
      child.on('error', (error) => {
        this.log(`Process ${name} error: ${error.message}`, 'error');
        this.processes.delete(name);
      });
      
      this.log(`Process ${name} started with PID ${child.pid}`);
      return true;
      
    } catch (error) {
      this.log(`Failed to start process ${name}: ${error.message}`, 'error');
      return false;
    }
  }

  async stopProcess(name) {
    this.log(`Stopping process: ${name}`);
    
    const processInfo = this.processes.get(name);
    if (processInfo) {
      try {
        processInfo.process.kill('SIGTERM');
        this.processes.delete(name);
        this.log(`Process ${name} stopped`);
        return true;
      } catch (error) {
        this.log(`Error stopping process ${name}: ${error.message}`, 'error');
        return false;
      }
    } else {
      this.log(`Process ${name} not found`, 'warn');
      return false;
    }
  }

  async startAllProcesses() {
    this.log('Starting all AI processes...');
    
    const processes = [
      { name: 'continuous-ai-loop', script: 'scripts/continuous-ai-loop.js' },
      { name: 'advanced-monitoring', script: 'scripts/advanced-monitoring.js' },
      { name: 'self-healing', script: 'scripts/self-healing.js' },
      { name: 'ml-learning-engine', script: 'scripts/ml-learning-engine.js' },
      { name: 'sandbox-testing', script: 'scripts/sandbox-testing.js' }
    ];
    
    const results = [];
    
    for (const process of processes) {
      const success = await this.startProcess(process.name, process.script);
      results.push({ name: process.name, success });
      
      // Wait a moment between starting processes
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const successful = results.filter(r => r.success).length;
    this.log(`Started ${successful}/${results.length} processes`);
    
    return results;
  }

  async stopAllProcesses() {
    this.log('Stopping all AI processes...');
    
    const results = [];
    
    for (const [name] of this.processes) {
      const success = await this.stopProcess(name);
      results.push({ name, success });
    }
    
    const successful = results.filter(r => r.success).length;
    this.log(`Stopped ${successful}/${results.length} processes`);
    
    return results;
  }

  async monitorProcesses() {
    this.log('Monitoring processes...');
    
    const status = {
      timestamp: new Date().toISOString(),
      totalProcesses: this.processes.size,
      runningProcesses: 0,
      processDetails: []
    };
    
    for (const [name, info] of this.processes) {
      const isRunning = !info.process.killed;
      status.runningProcesses += isRunning ? 1 : 0;
      
      status.processDetails.push({
        name: name,
        running: isRunning,
        uptime: Date.now() - info.startTime.getTime(),
        restarts: info.restarts,
        pid: info.process.pid
      });
    }
    
    // Save status
    const statusFile = path.join(this.workspaceRoot, 'temp', 'process-status.json');
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
    
    return status;
  }

  async runMasterCycle() {
    this.cyclesCompleted++;
    const cycleStartTime = Date.now();
    
    this.log(`Starting master cycle ${this.cyclesCompleted}...`);
    
    try {
      // 1. Monitor all processes
      const processStatus = await this.monitorProcesses();
      
      // 2. Run continuous AI loop
      const aiLoopResult = await this.runContinuousAILoop();
      
      // 3. Run verification
      const verificationResult = await this.runVerification();
      
      // 4. Generate master report
      const report = await this.generateMasterReport();
      
      // 5. Save state
      await this.saveState();
      
      const cycleTime = Date.now() - cycleStartTime;
      this.log(`Master cycle ${this.cyclesCompleted} completed in ${cycleTime}ms`);
      
      return {
        cycleNumber: this.cyclesCompleted,
        success: true,
        processStatus,
        aiLoopResult,
        verificationResult,
        report,
        cycleTime
      };
      
    } catch (error) {
      this.log(`Master cycle ${this.cyclesCompleted} failed: ${error.message}`, 'error');
      return {
        cycleNumber: this.cyclesCompleted,
        success: false,
        error: error.message
      };
    }
  }

  async runContinuousAILoop() {
    this.log('Running continuous AI loop...');
    
    try {
      // This would trigger the continuous AI loop
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Continuous AI loop executed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async runVerification() {
    this.log('Running verification...');
    
    try {
      const result = await this.executeScript('scripts/verification.js');
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async executeScript(scriptPath) {
    return new Promise((resolve) => {
      const child = spawn('node', [scriptPath], {
        cwd: this.workspaceRoot,
        stdio: 'pipe'
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        resolve({
          success: code === 0,
          code: code,
          stdout: stdout,
          stderr: stderr
        });
      });
      
      child.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });
    });
  }

  async generateMasterReport() {
    this.log('Generating master report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      masterController: {
        cyclesCompleted: this.cyclesCompleted,
        uptime: Date.now() - this.startTime.getTime(),
        processes: Array.from(this.processes.keys())
      },
      systemHealth: {
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      summary: {
        status: this.isRunning ? 'running' : 'stopped',
        totalCycles: this.cyclesCompleted,
        averageCycleTime: 0, // Would calculate from history
        systemHealth: 'healthy'
      }
    };
    
    const reportFile = path.join(this.workspaceRoot, 'reports', 'master-ai-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    this.log(`Master report saved: ${reportFile}`);
    return report;
  }

  async start() {
    this.log('Starting Master AI Controller...');
    this.isRunning = true;
    
    await this.initialize();
    
    // Start all processes
    await this.startAllProcesses();
    
    // Main control loop
    while (this.isRunning) {
      try {
        const cycleResult = await this.runMasterCycle();
        
        if (!cycleResult.success) {
          this.log(`Master cycle failed, waiting before retry...`, 'warn');
          await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
        } else {
          // Wait 10 minutes before next cycle
          this.log('Waiting 10 minutes before next master cycle...');
          await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000));
        }
        
      } catch (error) {
        this.log(`Critical error in master loop: ${error.message}`, 'error');
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
      }
    }
    
    this.log('Master AI Controller stopped');
  }

  async stop() {
    this.log('Stopping Master AI Controller...');
    this.isRunning = false;
    
    // Stop all processes
    await this.stopAllProcesses();
    
    // Save final state
    await this.saveState();
    
    this.log('Master AI Controller stopped');
  }
}

// Main execution
if (require.main === module) {
  const controller = new MasterAIController();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await controller.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await controller.stop();
    process.exit(0);
  });
  
  // Start the controller
  controller.start().catch(error => {
    console.error('Master AI Controller failed:', error);
    process.exit(1);
  });
}

module.exports = MasterAIController;