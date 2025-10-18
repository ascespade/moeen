#!/usr/bin/env node
// cursor-agent-monitor.js
// Master Control Program for Cursor Agent monitoring with auto-recovery
// Monitors process health, CPU/memory usage, and implements self-healing

const spawn, exec = require('child_process');
let fs = require('fs').promises;
let path = require('path');
let winston = require('winston');
const { () => ({} as any) } = require('@supabase/supabase-js');

// Configure Winston logger
let logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/cursor-agent-monitor.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Supabase client for metrics storage
let supabase = () => ({} as any)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class CursorAgentMonitor {
  constructor() {
    this.processes = new Map();
    this.metrics = {
      uptime: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      restarts: 0,
      errors: 0,
      lastHealthCheck: new Date(),
      status: 'unknown'
    };
    this.config = {
      monitorInterval: parseInt(process.env.MONITOR_INTERVAL, 10) || 60000, // 1 minute
      maxRestarts: 5,
      restartDelay: 5000,
      healthCheckTimeout: 30000,
      cpuThreshold: 80, // %
      memoryThreshold: 80 // %
    };
    this.isRunning = false;
    this.restartCount = 0;
    this.lastRestart = null;
  }

  async start() {
    logger.info('🚀 Starting Cursor Agent Monitor...');
    this.isRunning = true;

    try {
      // Initialize monitoring
      await this.initializeProcesses();
      await this.startHealthChecks();
      await this.startMetricsCollection();

      logger.info('✅ Cursor Agent Monitor started successfully');

      // Keep the process alive
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());
    } catch (error) {
      logger.error('❌ Failed to start Cursor Agent Monitor:', error);
      process.exit(1);
    }
  }

  async initializeProcesses() {
    logger.info('🔧 Initializing Cursor Agent processes...');

    let processes = [
      {
        name: 'cursor-agent',
        command: 'node',
        args: ['scripts/cursor-agent.js'],
        cwd: process.cwd(),
        env: { ...process.env }
      },
      {
        name: 'cursor-agent-monitor',
        command: 'node',
        args: ['scripts/cursor-agent-monitor.js'],
        cwd: process.cwd(),
        env: { ...process.env }
      }
    ];

    for (const procConfig of processes) {
      try {
        await this.startProcess(procConfig);
        logger.info(`✅ Started process: ${procConfig.name}`
      } catch (error) {
        logger.error(`❌ Failed to start process ${procConfig.name}:`
        throw error;
      }
    }
  }

  async startProcess(procConfig) {
    return new Promise((resolve, reject) => {
      let process = spawn(procConfig.command, procConfig.args, {
        cwd: procConfig.cwd,
        env: procConfig.env,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      process.stdout.on('data', (data) => {
        logger.info(`[${procConfig.name}] ${data.toString().trim()}`
      });

      process.stderr.on('data', (data) => {
        logger.error(`[${procConfig.name}] ${data.toString().trim()}`
        this.metrics.errors++;
      });

      process.on('close', (code) => {
        logger.warn(`[${procConfig.name}] Process exited with code ${code}`
        this.handleProcessExit(procConfig, code);
      });

      process.on('error', (error) => {
        logger.error(`[${procConfig.name}] Process error:`
        this.metrics.errors++;
        this.handleProcessError(procConfig, error);
      });

      this.processes.set(procConfig.name, {
        process,
        config: procConfig,
        startTime: Date.now(),
        restartCount: 0,
        lastRestart: null
      });

      resolve(process);
    });
  }

  async startHealthChecks() {
    logger.info('🏥 Starting health check system...');

    setInterval(async() => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        logger.error('❌ Health check failed:', error);
        this.metrics.errors++;
      }
    }, this.config.monitorInterval);
  }

  async performHealthCheck() {
    let healthStatus = {
      timestamp: new Date().toISOString(),
      processes: {},
      system: {},
      overall: 'healthy'
    };

    // Check each process
    for (const [name, procInfo] of this.processes) {
      let process = procInfo.process;
      let isAlive = process && !process.killed;

      healthStatus.processes[name] = {
        alive: isAlive,
        pid: process?.pid,
        uptime: isAlive ? Date.now() - procInfo.startTime : 0,
        restartCount: procInfo.restartCount
      };

      if (!isAlive) {
        healthStatus.overall = 'unhealthy';
        logger.warn(`⚠️ Process ${name} is not alive, attempting restart...`
        await this.restartProcess(name);
      }
    }

    // Check system resources
    let systemMetrics = await this.getSystemMetrics();
    healthStatus.system = systemMetrics;

    // Update overall status based on system metrics
    if (
      systemMetrics.cpuUsage > this.config.cpuThreshold ||
      systemMetrics.memoryUsage > this.config.memoryThreshold
    ) {
      healthStatus.overall = 'degraded';
      logger.warn(
        `⚠️ System resources high - CPU: ${systemMetrics.cpuUsage}%, Memory: ${systemMetrics.memoryUsage}%`
      );
    }

    // Store health status
    this.metrics.lastHealthCheck = new Date();
    this.metrics.status = healthStatus.overall;

    // Store in Supabase for dashboard
    await this.storeHealthMetrics(healthStatus);

    logger.info(`🏥 Health check completed - Status: ${healthStatus.overall}`
  }

  async getSystemMetrics() {
    return new Promise((resolve) => {
      exec(
        'ps -o pid,ppid,cmd,%cpu,%mem -p ' +
          Array.from(this.processes.values())
            .map((p) => p.process.pid)
            .filter((pid) => pid)
            .join(','),
        (error, stdout) => {
          if (error) {
            resolve({ cpuUsage: 0, memoryUsage: 0, error: error.message });
            return;
          }

          let lines = stdout.trim().split('\n').slice(1); // Skip header
          let totalCpu = 0;
          let totalMemory = 0;

          lines.forEach((line) => {
            let parts = line.trim().split(/\s+/);
            if (parts.length >= 5) {
              totalCpu += parseFloat(parts[3]) || 0;
              totalMemory += parseFloat(parts[4]) || 0;
            }
          });

          resolve({
            cpuUsage: Math.round(totalCpu * 100) / 100,
            memoryUsage: Math.round(totalMemory * 100) / 100,
            processCount: lines.length
          });
        }
      );
    });
  }

  async restartProcess(processName) {
    let procInfo = this.processes.get(processName);
    if (!procInfo) {
      logger.error(`❌ Process ${processName} not found`
      return;
    }

    if (procInfo.restartCount >= this.config.maxRestarts) {
      logger.error(`❌ Max restarts exceeded for ${processName}`
      return;
    }

    logger.info(`🔄 Restarting process: ${processName}`

    try {
      // Kill existing process
      if (procInfo.process && !procInfo.process.killed) {
        procInfo.process.kill('SIGTERM');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!procInfo.process.killed) {
          procInfo.process.kill('SIGKILL');
        }
      }

      // Wait before restart
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.restartDelay)
      );

      // Start new process
      let newProcess = await this.startProcess(procInfo.config);

      // Update process info
      procInfo.process = newProcess;
      procInfo.startTime = Date.now();
      procInfo.restartCount++;
      procInfo.lastRestart = new Date();

      this.metrics.restarts++;
      this.restartCount++;
      this.lastRestart = new Date();

      logger.info(
        `✅ Successfully restarted ${processName} (restart #${procInfo.restartCount})`
      );
    } catch (error) {
      logger.error(`❌ Failed to restart ${processName}:`
      this.metrics.errors++;
    }
  }

  async startMetricsCollection() {
    logger.info('📊 Starting metrics collection...');

    setInterval(async() => {
      try {
        await this.collectAndStoreMetrics();
      } catch (error) {
        logger.error('❌ Metrics collection failed:', error);
      }
    }, this.config.monitorInterval);
  }

  async collectAndStoreMetrics() {
    let systemMetrics = await this.getSystemMetrics();

    let metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      cpuUsage: systemMetrics.cpuUsage,
      memoryUsage: systemMetrics.memoryUsage,
      processCount: systemMetrics.processCount,
      restartCount: this.metrics.restarts,
      errorCount: this.metrics.errors,
      status: this.metrics.status,
      lastHealthCheck: this.metrics.lastHealthCheck
    };

    // Store in Supabase
    await this.storeMetrics(metrics);

    logger.info(
      `📊 Metrics collected - CPU: ${metrics.cpuUsage}%, Memory: ${metrics.memoryUsage}%, Status: ${metrics.status}`
    );
  }

  async storeHealthMetrics(healthStatus) {
    try {
      const error = await supabase.from('system_health').upsert(
        {
          id: 'cursor-agent-monitor',
          service_name: 'cursor-agent-monitor',
          health_status: healthStatus,
          last_check: new Date().toISOString(),
          is_healthy: healthStatus.overall === 'healthy'
        },
        { onConflict: 'id' }
      );

      if (error) {
        logger.error('❌ Failed to store health metrics:', error);
      }
    } catch (error) {
      logger.error('❌ Error storing health metrics:', error);
    }
  }

  async storeMetrics(metrics) {
    try {
      const error = await supabase.from('system_metrics').insert({
        service_name: 'cursor-agent-monitor',
        metrics: metrics,
        timestamp: new Date().toISOString()
      });

      if (error) {
        logger.error('❌ Failed to store metrics:', error);
      }
    } catch (error) {
      logger.error('❌ Error storing metrics:', error);
    }
  }

  handleProcessExit(procConfig, code) {
    logger.warn(`⚠️ Process ${procConfig.name} exited with code ${code}`
    this.metrics.errors++;

    // Auto-restart if not manual shutdown
    if (this.isRunning && code !== 0) {
      setTimeout(() => {
        this.restartProcess(procConfig.name);
      }, this.config.restartDelay);
    }
  }

  handleProcessError(procConfig, error) {
    logger.error(`❌ Process ${procConfig.name} error:`
    this.metrics.errors++;

    // Auto-restart on error
    if (this.isRunning) {
      setTimeout(() => {
        this.restartProcess(procConfig.name);
      }, this.config.restartDelay);
    }
  }

  async shutdown() {
    logger.info('🛑 Shutting down Cursor Agent Monitor...');
    this.isRunning = false;

    // Gracefully shutdown all processes
    for (const [name, procInfo] of this.processes) {
      logger.info(`🛑 Stopping process: ${name}`
      if (procInfo.process && !procInfo.process.killed) {
        procInfo.process.kill('SIGTERM');
      }
    }

    // Wait for processes to exit
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Force kill if still running
    for (const [name, procInfo] of this.processes) {
      if (procInfo.process && !procInfo.process.killed) {
        logger.warn(`⚠️ Force killing process: ${name}`
        procInfo.process.kill('SIGKILL');
      }
    }

    logger.info('✅ Cursor Agent Monitor shutdown complete');
    process.exit(0);
  }

  // Public API for health checks
  getHealthStatus() {
    return {
      status: this.metrics.status,
      uptime: process.uptime(),
      processes: Array.from(this.processes.entries()).map(([name, info]) => ({
        name,
        alive: info.process && !info.process.killed,
        pid: info.process?.pid,
        uptime:
          info.process && !info.process.killed
            ? Date.now() - info.startTime
            : 0,
        restartCount: info.restartCount
      })),
      metrics: this.metrics,
      lastHealthCheck: this.metrics.lastHealthCheck
    };
  }
}

// Start the monitor if this file is run directly
if (require.main === module) {
  let monitor = new CursorAgentMonitor();
  monitor.start().catch((error) => {
    logger.error('❌ Failed to start monitor:', error);
    process.exit(1);
  });
}

module.exports = CursorAgentMonitor;
