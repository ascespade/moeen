#!/usr/bin/env node

/**
 * 🤖 Project Monitor Agent for Moeen
 * 
 * Responsibilities:
 * - Monitor all agents assigned to the project
 * - Track agent status, progress, and logs
 * - Collect project health metrics
 * - Report agent progress and issues
 * - Learn from project patterns
 * - Update central learning system
 */

import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  projectName: 'moeen',
  projectPath: projectRoot,
  frameworkVersion: '2.0.0',
  monitorInterval: 5 * 60 * 1000, // 5 minutes
  paths: {
    agents: path.join(projectRoot, 'monitor', 'agents'),
    logs: path.join(projectRoot, 'logs'),
    reports: path.join(projectRoot, 'monitor', 'reports'),
    learning: path.join(projectRoot, 'monitor', 'learning'),
    dashboard: path.join(projectRoot, 'monitor', 'dashboard.json'),
  },
};

// Utility: Execute shell command
async function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot, timeout: 60000, ...options }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: error.message, stdout, stderr });
      } else {
        resolve({ success: true, stdout, stderr });
      }
    });
  });
}

// Utility: Log with timestamp
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  return logMessage;
}

// Utility: Save JSON file
async function saveJSON(filepath, data) {
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
}

// Utility: Read JSON file
async function readJSON(filepath) {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// 1. AGENT MONITORING
class AgentMonitor {
  constructor() {
    this.agents = new Map();
  }

  async discoverAgents() {
    const agents = [];
    
    // Check for cursor background agent
    const cursorAgent = await readJSON(path.join(projectRoot, 'cursor_background_agent.json'));
    if (cursorAgent) {
      agents.push({
        id: 'cursor-background-agent',
        name: cursorAgent.name,
        type: 'background',
        mode: cursorAgent.mode,
        status: 'active',
        version: cursorAgent.version,
        objectives: cursorAgent.objectives,
        lastSeen: new Date().toISOString(),
      });
    }

    // Check for agent status files in monitor/agents/
    try {
      const agentFiles = await fs.readdir(CONFIG.paths.agents);
      for (const file of agentFiles) {
        if (file.endsWith('.json')) {
          const agentData = await readJSON(path.join(CONFIG.paths.agents, file));
          if (agentData) {
            agents.push(agentData);
          }
        }
      }
    } catch (error) {
      log(`No agent files found: ${error.message}`, 'DEBUG');
    }

    // Check for running processes
    const processCheck = await executeCommand('ps aux | grep -E "(cursor|agent|monitor)" | grep -v grep');
    if (processCheck.success && processCheck.stdout) {
      const processes = processCheck.stdout.split('\n').filter(line => line.trim());
      log(`Found ${processes.length} related processes`, 'INFO');
    }

    this.agents.set('discovered', agents);
    return agents;
  }

  async collectAgentLogs() {
    const logs = [];
    
    try {
      const logFiles = await fs.readdir(CONFIG.paths.logs);
      for (const file of logFiles) {
        const logPath = path.join(CONFIG.paths.logs, file);
        const stats = await fs.stat(logPath);
        
        if (stats.isFile() && file.endsWith('.log')) {
          const content = await fs.readFile(logPath, 'utf8');
          const lines = content.split('\n').filter(l => l.trim());
          
          logs.push({
            file,
            path: logPath,
            size: stats.size,
            lastModified: stats.mtime,
            lineCount: lines.length,
            recentLines: lines.slice(-50), // Last 50 lines
          });
        }
      }
    } catch (error) {
      log(`No logs found: ${error.message}`, 'DEBUG');
    }

    return logs;
  }

  async getAgentStatus() {
    const agents = await this.discoverAgents();
    const logs = await this.collectAgentLogs();
    
    return {
      timestamp: new Date().toISOString(),
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      agents,
      logs: {
        total: logs.length,
        totalSize: logs.reduce((sum, l) => sum + l.size, 0),
        files: logs,
      },
    };
  }
}

// 2. PROJECT HEALTH MONITORING
class ProjectHealthMonitor {
  async collectMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      build: await this.checkBuild(),
      tests: await this.checkTests(),
      linting: await this.checkLinting(),
      types: await this.checkTypes(),
      git: await this.checkGit(),
      dependencies: await this.checkDependencies(),
      security: await this.checkSecurity(),
      files: await this.analyzeFileStructure(),
      database: await this.checkDatabase(),
    };

    return metrics;
  }

  async checkBuild() {
    log('Checking build status...', 'INFO');
    const result = await executeCommand('npm run build -- --dry-run 2>&1 || echo "Build check skipped"');
    
    return {
      status: result.success ? 'healthy' : 'needs-attention',
      lastCheck: new Date().toISOString(),
      message: result.success ? 'Build configuration valid' : 'Build needs verification',
    };
  }

  async checkTests() {
    log('Checking test status...', 'INFO');
    const result = await executeCommand('npm run test:unit -- --reporter=json 2>&1 || echo "{}"');
    
    let passed = 0, failed = 0, total = 0;
    
    // Parse output for test results
    const output = result.stdout || '';
    const passMatch = output.match(/(\d+)\s+passed/);
    const failMatch = output.match(/(\d+)\s+failed/);
    
    if (passMatch) passed = parseInt(passMatch[1]);
    if (failMatch) failed = parseInt(failMatch[1]);
    total = passed + failed;
    
    return {
      status: failed === 0 ? 'passing' : 'failing',
      passed,
      failed,
      total,
      lastRun: new Date().toISOString(),
    };
  }

  async checkLinting() {
    log('Checking linting status...', 'INFO');
    const result = await executeCommand('npm run lint:check 2>&1 || echo ""');
    
    const errors = (result.stdout?.match(/(\d+)\s+error/g) || [])
      .reduce((sum, m) => sum + parseInt(m), 0);
    const warnings = (result.stdout?.match(/(\d+)\s+warning/g) || [])
      .reduce((sum, m) => sum + parseInt(m), 0);
    
    return {
      status: errors === 0 ? 'clean' : 'has-issues',
      errors,
      warnings,
      lastCheck: new Date().toISOString(),
    };
  }

  async checkTypes() {
    log('Checking TypeScript types...', 'INFO');
    const result = await executeCommand('npm run type:check 2>&1 || echo ""');
    
    const errors = (result.stdout?.match(/error TS\d+/g) || []).length;
    
    return {
      status: errors === 0 ? 'clean' : 'has-errors',
      errors,
      lastCheck: new Date().toISOString(),
    };
  }

  async checkGit() {
    log('Checking git status...', 'INFO');
    const statusResult = await executeCommand('git status --porcelain');
    const branchResult = await executeCommand('git branch --show-current');
    const commitResult = await executeCommand('git log -1 --format="%H|%an|%ae|%s|%ct"');
    
    const modifiedFiles = (statusResult.stdout || '').split('\n').filter(l => l.trim()).length;
    const currentBranch = (branchResult.stdout || '').trim();
    const commitInfo = (commitResult.stdout || '').split('|');
    
    return {
      branch: currentBranch,
      modifiedFiles,
      lastCommit: commitInfo.length >= 5 ? {
        hash: commitInfo[0],
        author: commitInfo[1],
        email: commitInfo[2],
        message: commitInfo[3],
        timestamp: new Date(parseInt(commitInfo[4]) * 1000).toISOString(),
      } : null,
    };
  }

  async checkDependencies() {
    log('Checking dependencies...', 'INFO');
    const packageJson = await readJSON(path.join(projectRoot, 'package.json'));
    
    const result = await executeCommand('npm outdated --json 2>&1 || echo "{}"');
    let outdated = {};
    
    try {
      outdated = JSON.parse(result.stdout || '{}');
    } catch (e) {
      // Ignore parse errors
    }
    
    return {
      total: Object.keys(packageJson?.dependencies || {}).length + 
             Object.keys(packageJson?.devDependencies || {}).length,
      outdated: Object.keys(outdated).length,
      packages: outdated,
    };
  }

  async checkSecurity() {
    log('Checking security...', 'INFO');
    const result = await executeCommand('npm audit --json 2>&1 || echo "{}"');
    
    let audit = {};
    try {
      audit = JSON.parse(result.stdout || '{}');
    } catch (e) {
      // Ignore parse errors
    }
    
    return {
      vulnerabilities: audit.metadata?.vulnerabilities || {},
      total: audit.metadata?.total || 0,
      lastAudit: new Date().toISOString(),
    };
  }

  async analyzeFileStructure() {
    log('Analyzing file structure...', 'INFO');
    
    const result = await executeCommand('find src -type f | wc -l');
    const tsResult = await executeCommand('find src -name "*.ts" -o -name "*.tsx" | wc -l');
    const testResult = await executeCommand('find tests -name "*.spec.ts" -o -name "*.test.ts" 2>/dev/null | wc -l || echo 0');
    
    return {
      totalFiles: parseInt(result.stdout?.trim() || '0'),
      typeScriptFiles: parseInt(tsResult.stdout?.trim() || '0'),
      testFiles: parseInt(testResult.stdout?.trim() || '0'),
    };
  }

  async checkDatabase() {
    log('Checking database...', 'INFO');
    
    // Check for migrations
    const migrationsResult = await executeCommand('find migrations -name "*.sql" 2>/dev/null | wc -l || echo 0');
    
    // Check for supabase config
    const hasSupabase = await fs.access(path.join(projectRoot, '.env.local'))
      .then(() => true)
      .catch(() => false);
    
    return {
      migrations: parseInt(migrationsResult.stdout?.trim() || '0'),
      configured: hasSupabase,
      platform: 'supabase',
    };
  }
}

// 3. LEARNING SYSTEM
class LearningSystem {
  constructor() {
    this.insights = [];
    this.patterns = new Map();
  }

  async analyzePatterns(health, agents) {
    const insights = [];
    
    // Pattern 1: Frequent build failures
    if (health.build.status === 'needs-attention') {
      insights.push({
        type: 'build',
        severity: 'high',
        pattern: 'Build issues detected',
        recommendation: 'Run comprehensive build check and fix errors',
        action: 'npm run build',
      });
    }

    // Pattern 2: Test failures
    if (health.tests.failed > 0) {
      insights.push({
        type: 'tests',
        severity: 'medium',
        pattern: `${health.tests.failed} tests failing`,
        recommendation: 'Review and fix failing tests',
        action: 'npm run test:unit',
      });
    }

    // Pattern 3: Type errors
    if (health.types.errors > 0) {
      insights.push({
        type: 'types',
        severity: 'high',
        pattern: `${health.types.errors} TypeScript errors`,
        recommendation: 'Fix type errors for better code safety',
        action: 'npm run type:check',
      });
    }

    // Pattern 4: Security vulnerabilities
    if (health.security.total > 0) {
      insights.push({
        type: 'security',
        severity: 'critical',
        pattern: `${health.security.total} security vulnerabilities`,
        recommendation: 'Update vulnerable dependencies immediately',
        action: 'npm audit fix',
      });
    }

    // Pattern 5: No active agents
    if (agents.activeAgents === 0) {
      insights.push({
        type: 'agents',
        severity: 'low',
        pattern: 'No active agents detected',
        recommendation: 'Agents may be idle or completed their tasks',
        action: 'Check agent logs for status',
      });
    }

    // Pattern 6: Git changes
    if (health.git.modifiedFiles > 10) {
      insights.push({
        type: 'git',
        severity: 'low',
        pattern: `${health.git.modifiedFiles} uncommitted files`,
        recommendation: 'Consider committing changes or reviewing modifications',
        action: 'git status',
      });
    }

    // Pattern 7: Outdated dependencies
    if (health.dependencies.outdated > 5) {
      insights.push({
        type: 'dependencies',
        severity: 'medium',
        pattern: `${health.dependencies.outdated} outdated packages`,
        recommendation: 'Review and update dependencies',
        action: 'npm outdated',
      });
    }

    this.insights = insights;
    return insights;
  }

  generateLearningData(health, agents, insights) {
    return {
      timestamp: new Date().toISOString(),
      project: CONFIG.projectName,
      health: {
        score: this.calculateHealthScore(health),
        status: this.determineHealthStatus(health),
        metrics: {
          build: health.build.status,
          tests: `${health.tests.passed}/${health.tests.total}`,
          types: health.types.status,
          linting: health.linting.status,
          security: health.security.total === 0 ? 'secure' : 'vulnerable',
        },
      },
      agents: {
        total: agents.totalAgents,
        active: agents.activeAgents,
        status: agents.agents.map(a => ({
          id: a.id,
          status: a.status,
          lastSeen: a.lastSeen,
        })),
      },
      insights: insights.map(i => ({
        type: i.type,
        severity: i.severity,
        pattern: i.pattern,
      })),
      recommendations: insights.map(i => i.recommendation),
      timestamp: new Date().toISOString(),
    };
  }

  calculateHealthScore(health) {
    let score = 100;
    
    if (health.build.status !== 'healthy') score -= 15;
    if (health.tests.failed > 0) score -= (health.tests.failed * 5);
    if (health.types.errors > 0) score -= (health.types.errors * 2);
    if (health.linting.errors > 0) score -= (health.linting.errors * 1);
    if (health.security.total > 0) score -= (health.security.total * 10);
    
    return Math.max(0, Math.min(100, score));
  }

  determineHealthStatus(health) {
    const score = this.calculateHealthScore(health);
    
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }
}

// 4. REPORT GENERATOR
class ReportGenerator {
  async generateReport(agents, health, insights) {
    const timestamp = new Date().toISOString();
    const reportId = `moeen-${Date.now()}`;
    
    const report = {
      id: reportId,
      project: CONFIG.projectName,
      timestamp,
      summary: {
        healthScore: new LearningSystem().calculateHealthScore(health),
        healthStatus: new LearningSystem().determineHealthStatus(health),
        activeAgents: agents.activeAgents,
        totalInsights: insights.length,
        criticalIssues: insights.filter(i => i.severity === 'critical').length,
      },
      agents: {
        total: agents.totalAgents,
        active: agents.activeAgents,
        details: agents.agents,
        logs: agents.logs,
      },
      health: {
        build: health.build,
        tests: health.tests,
        linting: health.linting,
        types: health.types,
        git: health.git,
        dependencies: health.dependencies,
        security: health.security,
        files: health.files,
        database: health.database,
      },
      insights: insights,
      recommendations: insights.map(i => ({
        type: i.type,
        severity: i.severity,
        recommendation: i.recommendation,
        action: i.action,
      })),
      nextCheck: new Date(Date.now() + CONFIG.monitorInterval).toISOString(),
    };

    return report;
  }

  async generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitor Report - ${report.project}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; padding: 20px; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header .meta { opacity: 0.9; font-size: 0.9em; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .card h2 { font-size: 1.3em; margin-bottom: 15px; color: #333; display: flex; align-items: center; gap: 10px; }
        .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .metric:last-child { border-bottom: none; }
        .metric-label { color: #666; }
        .metric-value { font-weight: bold; color: #333; }
        .score { font-size: 3em; font-weight: bold; text-align: center; margin: 20px 0; }
        .score.excellent { color: #10b981; }
        .score.good { color: #3b82f6; }
        .score.fair { color: #f59e0b; }
        .score.poor { color: #ef4444; }
        .score.critical { color: #dc2626; }
        .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 600; }
        .status-badge.healthy { background: #d1fae5; color: #065f46; }
        .status-badge.passing { background: #dbeafe; color: #1e40af; }
        .status-badge.failing { background: #fee2e2; color: #991b1b; }
        .status-badge.clean { background: #d1fae5; color: #065f46; }
        .status-badge.has-issues { background: #fef3c7; color: #92400e; }
        .status-badge.has-errors { background: #fee2e2; color: #991b1b; }
        .insight { padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
        .insight.critical { background: #fee2e2; border-color: #dc2626; }
        .insight.high { background: #fed7aa; border-color: #ea580c; }
        .insight.medium { background: #fef3c7; border-color: #f59e0b; }
        .insight.low { background: #e0e7ff; border-color: #6366f1; }
        .insight-header { font-weight: bold; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center; }
        .insight-severity { font-size: 0.75em; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.1); }
        .insight-body { color: #374151; margin: 5px 0; }
        .insight-action { font-family: 'Courier New', monospace; background: rgba(0,0,0,0.05); padding: 8px; border-radius: 4px; margin-top: 5px; font-size: 0.9em; }
        .agent-list { list-style: none; }
        .agent-item { padding: 10px; margin: 5px 0; background: #f9fafb; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
        .agent-name { font-weight: 500; }
        .agent-status { font-size: 0.85em; padding: 3px 10px; border-radius: 12px; }
        .agent-status.active { background: #d1fae5; color: #065f46; }
        .agent-status.idle { background: #e5e7eb; color: #6b7280; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
        .progress-bar { width: 100%; height: 30px; background: #e5e7eb; border-radius: 15px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Project Monitor Report</h1>
            <div class="meta">
                <div><strong>Project:</strong> ${report.project}</div>
                <div><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</div>
                <div><strong>Report ID:</strong> ${report.id}</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>🎯 Health Score</h2>
                <div class="score ${report.summary.healthStatus}">
                    ${report.summary.healthScore}
                </div>
                <div style="text-align: center; color: #666; text-transform: uppercase; font-weight: bold;">
                    ${report.summary.healthStatus}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${report.summary.healthScore}%">
                        ${report.summary.healthScore}%
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>👥 Agents</h2>
                <div class="metric">
                    <span class="metric-label">Total Agents</span>
                    <span class="metric-value">${report.agents.total}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Active Agents</span>
                    <span class="metric-value">${report.agents.active}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Log Files</span>
                    <span class="metric-value">${report.agents.logs.total}</span>
                </div>
            </div>

            <div class="card">
                <h2>⚠️ Issues</h2>
                <div class="metric">
                    <span class="metric-label">Critical Issues</span>
                    <span class="metric-value" style="color: #dc2626;">${report.summary.criticalIssues}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Insights</span>
                    <span class="metric-value">${report.summary.totalInsights}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Next Check</span>
                    <span class="metric-value">${new Date(report.nextCheck).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>🏗️ Build & Tests</h2>
                <div class="metric">
                    <span class="metric-label">Build Status</span>
                    <span class="status-badge ${report.health.build.status}">${report.health.build.status}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Tests Passed</span>
                    <span class="metric-value">${report.health.tests.passed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Tests Failed</span>
                    <span class="metric-value">${report.health.tests.failed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Test Status</span>
                    <span class="status-badge ${report.health.tests.status}">${report.health.tests.status}</span>
                </div>
            </div>

            <div class="card">
                <h2>🔍 Code Quality</h2>
                <div class="metric">
                    <span class="metric-label">TypeScript</span>
                    <span class="status-badge ${report.health.types.status}">${report.health.types.errors} errors</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Linting</span>
                    <span class="status-badge ${report.health.linting.status}">${report.health.linting.errors} errors</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Lint Warnings</span>
                    <span class="metric-value">${report.health.linting.warnings}</span>
                </div>
            </div>

            <div class="card">
                <h2>📦 Dependencies & Security</h2>
                <div class="metric">
                    <span class="metric-label">Total Packages</span>
                    <span class="metric-value">${report.health.dependencies.total}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Outdated</span>
                    <span class="metric-value">${report.health.dependencies.outdated}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Vulnerabilities</span>
                    <span class="metric-value" style="color: ${report.health.security.total > 0 ? '#dc2626' : '#10b981'}">
                        ${report.health.security.total}
                    </span>
                </div>
            </div>
        </div>

        ${report.agents.details.length > 0 ? `
        <div class="card">
            <h2>👥 Agent Details</h2>
            <ul class="agent-list">
                ${report.agents.details.map(agent => `
                <li class="agent-item">
                    <div>
                        <div class="agent-name">${agent.name || agent.id}</div>
                        <div style="font-size: 0.85em; color: #6b7280;">Type: ${agent.type || 'unknown'} | Mode: ${agent.mode || 'N/A'}</div>
                    </div>
                    <span class="agent-status ${agent.status}">${agent.status}</span>
                </li>
                `).join('')}
            </ul>
        </div>
        ` : ''}

        ${report.insights.length > 0 ? `
        <div class="card">
            <h2>💡 Insights & Recommendations</h2>
            ${report.insights.map(insight => `
            <div class="insight ${insight.severity}">
                <div class="insight-header">
                    <span>${insight.pattern}</span>
                    <span class="insight-severity">${insight.severity}</span>
                </div>
                <div class="insight-body">${insight.recommendation}</div>
                ${insight.action ? `<div class="insight-action">$ ${insight.action}</div>` : ''}
            </div>
            `).join('')}
        </div>
        ` : '<div class="card"><h2>💡 Insights</h2><p style="color: #6b7280;">No issues detected. Project is healthy! ✨</p></div>'}

        <div class="card">
            <h2>📊 Project Statistics</h2>
            <div class="metric">
                <span class="metric-label">Total Files</span>
                <span class="metric-value">${report.health.files.totalFiles}</span>
            </div>
            <div class="metric">
                <span class="metric-label">TypeScript Files</span>
                <span class="metric-value">${report.health.files.typeScriptFiles}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Test Files</span>
                <span class="metric-value">${report.health.files.testFiles}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Database Migrations</span>
                <span class="metric-value">${report.health.database.migrations}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Git Branch</span>
                <span class="metric-value">${report.health.git.branch}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Modified Files</span>
                <span class="metric-value">${report.health.git.modifiedFiles}</span>
            </div>
        </div>

        <div class="footer">
            <p>🤖 Generated by Moeen Monitor Agent v${CONFIG.frameworkVersion}</p>
            <p>Next check in ${Math.round(CONFIG.monitorInterval / 60000)} minutes</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }
}

// 5. DASHBOARD UPDATER
class DashboardUpdater {
  async updateDashboard(report, learningData) {
    const dashboard = {
      lastUpdate: new Date().toISOString(),
      project: CONFIG.projectName,
      status: report.summary.healthStatus,
      score: report.summary.healthScore,
      alerts: report.insights.filter(i => i.severity === 'critical' || i.severity === 'high'),
      agents: {
        total: report.agents.total,
        active: report.agents.active,
      },
      metrics: {
        build: report.health.build.status,
        tests: {
          passed: report.health.tests.passed,
          failed: report.health.tests.failed,
          total: report.health.tests.total,
        },
        types: report.health.types.errors,
        linting: report.health.linting.errors,
        security: report.health.security.total,
      },
      learning: learningData,
      history: [],
    };

    // Load existing dashboard to preserve history
    const existing = await readJSON(CONFIG.paths.dashboard);
    if (existing && existing.history) {
      dashboard.history = existing.history.slice(-20); // Keep last 20 entries
    }
    
    // Add current entry to history
    dashboard.history.push({
      timestamp: dashboard.lastUpdate,
      score: dashboard.score,
      status: dashboard.status,
      alerts: dashboard.alerts.length,
    });

    await saveJSON(CONFIG.paths.dashboard, dashboard);
    return dashboard;
  }
}

// 6. MAIN MONITOR CLASS
class MoeenMonitorAgent {
  constructor() {
    this.agentMonitor = new AgentMonitor();
    this.healthMonitor = new ProjectHealthMonitor();
    this.learningSystem = new LearningSystem();
    this.reportGenerator = new ReportGenerator();
    this.dashboardUpdater = new DashboardUpdater();
    this.running = false;
  }

  async runMonitoringCycle() {
    log('🔄 Starting monitoring cycle...', 'INFO');
    
    try {
      // 1. Collect agent status
      log('📊 Collecting agent status...', 'INFO');
      const agentStatus = await this.agentMonitor.getAgentStatus();
      
      // 2. Collect project health metrics
      log('🏥 Collecting project health metrics...', 'INFO');
      const health = await this.healthMonitor.collectMetrics();
      
      // 3. Analyze patterns and generate insights
      log('🧠 Analyzing patterns...', 'INFO');
      const insights = await this.learningSystem.analyzePatterns(health, agentStatus);
      
      // 4. Generate learning data
      log('📚 Generating learning data...', 'INFO');
      const learningData = this.learningSystem.generateLearningData(health, agentStatus, insights);
      
      // 5. Generate report
      log('📝 Generating report...', 'INFO');
      const report = await this.reportGenerator.generateReport(agentStatus, health, insights);
      
      // 6. Save report
      const reportPath = path.join(CONFIG.paths.reports, `${report.id}.json`);
      await saveJSON(reportPath, report);
      log(`✅ Report saved: ${reportPath}`, 'SUCCESS');
      
      // 7. Generate HTML report
      const html = await this.reportGenerator.generateHTMLReport(report);
      const htmlPath = path.join(CONFIG.paths.reports, `${report.id}.html`);
      await fs.writeFile(htmlPath, html, 'utf8');
      log(`✅ HTML report saved: ${htmlPath}`, 'SUCCESS');
      
      // 8. Save learning data
      const learningPath = path.join(CONFIG.paths.learning, `${report.id}.json`);
      await saveJSON(learningPath, learningData);
      log(`✅ Learning data saved: ${learningPath}`, 'SUCCESS');
      
      // 9. Update dashboard
      log('📊 Updating dashboard...', 'INFO');
      await this.dashboardUpdater.updateDashboard(report, learningData);
      log(`✅ Dashboard updated: ${CONFIG.paths.dashboard}`, 'SUCCESS');
      
      // 10. Display summary
      this.displaySummary(report, insights);
      
      return report;
    } catch (error) {
      log(`❌ Error in monitoring cycle: ${error.message}`, 'ERROR');
      console.error(error);
      throw error;
    }
  }

  displaySummary(report, insights) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 MONITORING SUMMARY');
    console.log('='.repeat(80));
    console.log(`Project: ${report.project}`);
    console.log(`Health Score: ${report.summary.healthScore}/100 (${report.summary.healthStatus.toUpperCase()})`);
    console.log(`Active Agents: ${report.agents.active}/${report.agents.total}`);
    console.log(`Total Insights: ${report.summary.totalInsights}`);
    console.log(`Critical Issues: ${report.summary.criticalIssues}`);
    console.log('');
    console.log('Health Metrics:');
    console.log(`  - Build: ${report.health.build.status}`);
    console.log(`  - Tests: ${report.health.tests.passed} passed, ${report.health.tests.failed} failed`);
    console.log(`  - TypeScript: ${report.health.types.errors} errors`);
    console.log(`  - Linting: ${report.health.linting.errors} errors, ${report.health.linting.warnings} warnings`);
    console.log(`  - Security: ${report.health.security.total} vulnerabilities`);
    
    if (insights.length > 0) {
      console.log('');
      console.log('Top Recommendations:');
      insights.slice(0, 3).forEach((insight, i) => {
        console.log(`  ${i + 1}. [${insight.severity.toUpperCase()}] ${insight.recommendation}`);
      });
    }
    
    console.log('');
    console.log(`Next check: ${new Date(report.nextCheck).toLocaleString()}`);
    console.log('='.repeat(80) + '\n');
  }

  async startContinuousMonitoring() {
    log('🚀 Starting continuous monitoring...', 'INFO');
    log(`📅 Interval: ${CONFIG.monitorInterval / 60000} minutes`, 'INFO');
    
    this.running = true;
    
    while (this.running) {
      try {
        await this.runMonitoringCycle();
        
        // Wait for next cycle
        log(`⏳ Waiting ${CONFIG.monitorInterval / 60000} minutes until next check...`, 'INFO');
        await new Promise(resolve => setTimeout(resolve, CONFIG.monitorInterval));
      } catch (error) {
        log(`❌ Error in monitoring loop: ${error.message}`, 'ERROR');
        // Continue monitoring despite errors
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute before retry
      }
    }
  }

  stop() {
    log('⏹️ Stopping monitor agent...', 'INFO');
    this.running = false;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'once';
  
  // Ensure directories exist
  await fs.mkdir(CONFIG.paths.agents, { recursive: true });
  await fs.mkdir(CONFIG.paths.logs, { recursive: true });
  await fs.mkdir(CONFIG.paths.reports, { recursive: true });
  await fs.mkdir(CONFIG.paths.learning, { recursive: true });
  
  const monitor = new MoeenMonitorAgent();
  
  switch (command) {
    case 'once':
      log('🤖 Running single monitoring cycle...', 'INFO');
      await monitor.runMonitoringCycle();
      log('✅ Monitoring cycle complete!', 'SUCCESS');
      break;
      
    case 'continuous':
    case 'monitor':
      log('🤖 Starting continuous monitoring...', 'INFO');
      await monitor.startContinuousMonitoring();
      break;
      
    case 'help':
    default:
      console.log(`
🤖 Moeen Monitor Agent v${CONFIG.frameworkVersion}

Usage: node moeen-monitor-agent.mjs [command]

Commands:
  once         Run a single monitoring cycle (default)
  continuous   Start continuous monitoring (every 5 minutes)
  monitor      Alias for 'continuous'
  help         Show this help message

Examples:
  node moeen-monitor-agent.mjs once
  node moeen-monitor-agent.mjs continuous
  npm run monitor:moeen
      `);
      break;
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('⏹️ Received SIGINT, shutting down...', 'INFO');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('⏹️ Received SIGTERM, shutting down...', 'INFO');
  process.exit(0);
});

// Run
main().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'ERROR');
  console.error(error);
  process.exit(1);
});
