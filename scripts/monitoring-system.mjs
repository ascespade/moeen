import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const MONITORING_DIR = path.join(projectRoot, 'reports', 'monitoring');
const LOG_FILE = path.join(projectRoot, 'logs', 'monitoring.log');

// Helper to execute shell commands
async function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot, ...options }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Helper to log messages
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);

  try {
    await fs.appendFile(LOG_FILE, logMessage + '\n', 'utf8');
  } catch (err) {
    console.error(`Failed to write to log file: ${err.message}`);
  }
}

// Function to get system metrics
async function getSystemMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    memory: {},
    disk: {},
    network: {},
    processes: {},
  };

  try {
    // Memory usage
    const { stdout: memInfo } = await executeCommand('free -m');
    const memLines = memInfo.split('\n');
    const memData = memLines[1].split(/\s+/);
    metrics.memory = {
      total: parseInt(memData[1]),
      used: parseInt(memData[2]),
      free: parseInt(memData[3]),
      available: parseInt(memData[6]),
    };

    // Disk usage
    const { stdout: diskInfo } = await executeCommand('df -h /');
    const diskLines = diskInfo.split('\n');
    const diskData = diskLines[1].split(/\s+/);
    metrics.disk = {
      total: diskData[1],
      used: diskData[2],
      available: diskData[3],
      usage: diskData[4],
    };

    // Network connections
    const { stdout: netInfo } = await executeCommand('ss -tuln | wc -l');
    metrics.network.connections = parseInt(netInfo.trim());

    // Node.js processes
    const { stdout: nodeProcesses } = await executeCommand(
      'ps aux | grep node | grep -v grep | wc -l'
    );
    metrics.processes.node = parseInt(nodeProcesses.trim());

    // Git status
    try {
      const { stdout: gitStatus } = await executeCommand(
        'git status --porcelain'
      );
      metrics.git = {
        modifiedFiles: gitStatus.split('\n').filter(line => line.trim()).length,
      };
    } catch (e) {
      metrics.git = { modifiedFiles: 0 };
    }
  } catch (err) {
    log(`Error getting system metrics: ${err.message}`, 'ERROR');
  }

  return metrics;
}

// Function to get project health
async function getProjectHealth() {
  const health = {
    timestamp: new Date().toISOString(),
    tests: {},
    linting: {},
    build: {},
    dependencies: {},
    security: {},
  };

  try {
    // Test results
    try {
      const { stdout: testOutput } = await executeCommand('npm run test:unit', {
        ignoreError: true,
      });
      const passed = (testOutput.match(/(\d+) passed/g) || [])
        .map(m => parseInt(m))
        .reduce((a, b) => a + b, 0);
      const failed = (testOutput.match(/(\d+) failed/g) || [])
        .map(m => parseInt(m))
        .reduce((a, b) => a + b, 0);
      health.tests = { passed, failed, total: passed + failed };
    } catch (e) {
      health.tests = { passed: 0, failed: 0, total: 0 };
    }

    // Linting results
    try {
      const { stdout: lintOutput } = await executeCommand(
        'npm run lint:check',
        { ignoreError: true }
      );
      const errors = (lintOutput.match(/(\d+) errors?/g) || [])
        .map(m => parseInt(m))
        .reduce((a, b) => a + b, 0);
      const warnings = (lintOutput.match(/(\d+) warnings?/g) || [])
        .map(m => parseInt(m))
        .reduce((a, b) => a + b, 0);
      health.linting = { errors, warnings };
    } catch (e) {
      health.linting = { errors: 0, warnings: 0 };
    }

    // Build status
    try {
      await executeCommand('npm run build');
      health.build = { status: 'success' };
    } catch (e) {
      health.build = { status: 'failed', error: e.message };
    }

    // Dependencies status
    try {
      const { stdout: outdated } = await executeCommand('npm outdated --json', {
        ignoreError: true,
      });
      const outdatedDeps = JSON.parse(outdated);
      health.dependencies = {
        outdated: Object.keys(outdatedDeps).length,
        total: 0,
      };
    } catch (e) {
      health.dependencies = { outdated: 0, total: 0 };
    }

    // Security audit
    try {
      const { stdout: auditOutput } = await executeCommand('npm audit --json', {
        ignoreError: true,
      });
      const audit = JSON.parse(auditOutput);
      health.security = {
        vulnerabilities: audit.vulnerabilities || 0,
        high: audit.metadata?.vulnerabilities?.high || 0,
        moderate: audit.metadata?.vulnerabilities?.moderate || 0,
        low: audit.metadata?.vulnerabilities?.low || 0,
      };
    } catch (e) {
      health.security = { vulnerabilities: 0, high: 0, moderate: 0, low: 0 };
    }
  } catch (err) {
    log(`Error getting project health: ${err.message}`, 'ERROR');
  }

  return health;
}

// Function to generate monitoring report
async function generateMonitoringReport() {
  const report = {
    timestamp: new Date().toISOString(),
    system: await getSystemMetrics(),
    project: await getProjectHealth(),
    alerts: [],
  };

  // Check for alerts
  if (report.system.memory.used / report.system.memory.total > 0.9) {
    report.alerts.push({
      type: 'memory',
      severity: 'high',
      message: 'Memory usage is above 90%',
    });
  }

  if (report.project.linting.errors > 10) {
    report.alerts.push({
      type: 'linting',
      severity: 'medium',
      message: `Too many linting errors: ${report.project.linting.errors}`,
    });
  }

  if (report.project.tests.failed > 0) {
    report.alerts.push({
      type: 'tests',
      severity: 'high',
      message: `${report.project.tests.failed} tests are failing`,
    });
  }

  if (report.project.security.vulnerabilities > 0) {
    report.alerts.push({
      type: 'security',
      severity: 'high',
      message: `${report.project.security.vulnerabilities} security vulnerabilities found`,
    });
  }

  // Save report
  const reportFile = path.join(MONITORING_DIR, `monitoring-${Date.now()}.json`);
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8');

  // Generate HTML report
  await generateHTMLReport(report);

  return report;
}

// Function to generate HTML report
async function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Monitoring Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .alert { padding: 10px; margin: 5px 0; border-radius: 5px; }
        .alert.high { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .alert.medium { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .alert.low { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }
        .status.success { background-color: #28a745; }
        .status.failed { background-color: #dc3545; }
        .status.warning { background-color: #ffc107; color: #212529; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 System Monitoring Report</h1>
            <p>Generated: ${report.timestamp}</p>
        </div>
        
        <div class="section">
            <h2>📊 System Metrics</h2>
            <div class="metric">
                <strong>Memory:</strong> ${report.system.memory.used}MB / ${report.system.memory.total}MB
            </div>
            <div class="metric">
                <strong>Disk:</strong> ${report.system.disk.used} / ${report.system.disk.total}
            </div>
            <div class="metric">
                <strong>Network Connections:</strong> ${report.system.network.connections}
            </div>
            <div class="metric">
                <strong>Node Processes:</strong> ${report.system.processes.node}
            </div>
        </div>
        
        <div class="section">
            <h2>🧪 Project Health</h2>
            <div class="metric">
                <strong>Tests:</strong> 
                <span class="status ${report.project.tests.failed > 0 ? 'failed' : 'success'}">
                    ${report.project.tests.passed} passed, ${report.project.tests.failed} failed
                </span>
            </div>
            <div class="metric">
                <strong>Linting:</strong> 
                <span class="status ${report.project.linting.errors > 0 ? 'warning' : 'success'}">
                    ${report.project.linting.errors} errors, ${report.project.linting.warnings} warnings
                </span>
            </div>
            <div class="metric">
                <strong>Build:</strong> 
                <span class="status ${report.project.build.status}">
                    ${report.project.build.status}
                </span>
            </div>
            <div class="metric">
                <strong>Security:</strong> 
                <span class="status ${report.project.security.vulnerabilities > 0 ? 'failed' : 'success'}">
                    ${report.project.security.vulnerabilities} vulnerabilities
                </span>
            </div>
        </div>
        
        ${
          report.alerts.length > 0
            ? `
        <div class="section">
            <h2>⚠️ Alerts</h2>
            ${report.alerts
              .map(
                alert => `
                <div class="alert ${alert.severity}">
                    <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
                </div>
            `
              )
              .join('')}
        </div>
        `
            : ''
        }
    </div>
</body>
</html>`;

  const htmlFile = path.join(MONITORING_DIR, 'monitoring-report.html');
  await fs.writeFile(htmlFile, html, 'utf8');

  log(`📊 HTML report generated: ${htmlFile}`);
}

// Function to start continuous monitoring
async function startMonitoring(intervalMinutes = 5) {
  log(`🔄 Starting continuous monitoring (every ${intervalMinutes} minutes)`);

  while (true) {
    try {
      const report = await generateMonitoringReport();
      log(`📊 Monitoring report generated with ${report.alerts.length} alerts`);

      // Send alerts if any
      if (report.alerts.length > 0) {
        for (const alert of report.alerts) {
          log(
            `⚠️ ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`,
            'WARN'
          );
        }
      }
    } catch (err) {
      log(`❌ Error in monitoring cycle: ${err.message}`, 'ERROR');
    }

    // Wait for next cycle
    await new Promise(resolve =>
      setTimeout(resolve, intervalMinutes * 60 * 1000)
    );
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Ensure directories exist
  await fs.mkdir(MONITORING_DIR, { recursive: true }).catch(() => {});
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true }).catch(() => {});

  switch (command) {
    case 'report':
      await generateMonitoringReport();
      break;

    case 'monitor':
      const interval = parseInt(args[1]) || 5;
      await startMonitoring(interval);
      break;

    case 'metrics':
      const metrics = await getSystemMetrics();
      console.log(JSON.stringify(metrics, null, 2));
      break;

    case 'health':
      const health = await getProjectHealth();
      console.log(JSON.stringify(health, null, 2));
      break;

    default:
      console.log(
        'Usage: node monitoring-system.mjs [report|monitor|metrics|health]'
      );
      console.log('  report - Generate monitoring report');
      console.log('  monitor [interval] - Start continuous monitoring');
      console.log('  metrics - Get system metrics');
      console.log('  health - Get project health');
      break;
  }
}

main().catch(console.error);
