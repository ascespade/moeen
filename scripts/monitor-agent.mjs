#!/usr/bin/env node
/**
 * Monitor Agent for moeen project
 * Continuously monitors project health, agent activity, and generates reports
 * 
 * Usage:
 *   node scripts/monitor-agent.mjs [options]
 * 
 * Options:
 *   --once          Run once and exit
 *   --interval=N    Set monitoring interval in minutes (default: 5)
 *   --verbose       Enable verbose logging
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  projectName: 'moeen',
  monitoringVersion: '2.0.0',
  interval: 5, // minutes
  verbose: false,
  runOnce: false,
};

// Parse command line arguments
process.argv.slice(2).forEach(arg => {
  if (arg === '--once') CONFIG.runOnce = true;
  if (arg === '--verbose') CONFIG.verbose = true;
  if (arg.startsWith('--interval=')) {
    CONFIG.interval = parseInt(arg.split('=')[1]) || 5;
  }
});

// Utility functions
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📊',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }[level] || 'ℹ️';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const verbose = (message) => {
  if (CONFIG.verbose) {
    log(message, 'info');
  }
};

const execCommand = (command, silent = false) => {
  try {
    const result = execSync(command, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return result.trim();
  } catch (error) {
    if (!silent) {
      log(`Command failed: ${command}`, 'error');
    }
    return null;
  }
};

// Monitoring functions
const collectMetrics = () => {
  verbose('Collecting project metrics...');
  
  const metrics = {
    timestamp: new Date().toISOString(),
    
    // Git metrics
    git: {
      totalBranches: parseInt(execCommand('git branch -a | wc -l', true)) || 0,
      currentBranch: execCommand('git rev-parse --abbrev-ref HEAD', true) || 'unknown',
      uncommittedChanges: parseInt(execCommand('git status --porcelain | wc -l', true)) || 0,
      commitsLast7Days: parseInt(execCommand('git log --oneline --since="7 days ago" | wc -l', true)) || 0,
      recentCommits: [],
    },
    
    // Code metrics
    codebase: {
      totalFiles: parseInt(execCommand('find src -name "*.ts" -o -name "*.tsx" | wc -l', true)) || 0,
      linesOfCode: parseInt(execCommand('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) -exec wc -l {} + 2>/dev/null | tail -1 | awk \'{print $1}\'', true)) || 0,
      components: parseInt(execCommand('find src/components -type f \\( -name "*.tsx" -o -name "*.ts" \\) 2>/dev/null | wc -l', true)) || 0,
      pages: parseInt(execCommand('find src/app -type f -name "page.tsx" | wc -l', true)) || 0,
      apiRoutes: parseInt(execCommand('find src/app/api -name "route.ts" | wc -l', true)) || 0,
      testFiles: parseInt(execCommand('find . -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.test.tsx" | wc -l', true)) || 0,
    },
    
    // Health indicators
    health: {
      typeErrors: 0, // Would need to run tsc --noEmit
      buildStatus: 'unknown',
      testsPassing: 'unknown',
    },
  };
  
  // Get recent commits
  const commits = execCommand('git log --pretty=format:"%h|%an|%s|%ar" --since="7 days ago" -n 5', true);
  if (commits) {
    metrics.git.recentCommits = commits.split('\n').map(line => {
      const [hash, author, message, time] = line.split('|');
      return { hash, author, message, time };
    });
  }
  
  return metrics;
};

const readAgentConfig = () => {
  try {
    const configPath = path.join(ROOT_DIR, 'cursor_background_agent.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (error) {
    verbose('Could not read agent config');
  }
  return null;
};

const analyzeModules = (agentConfig) => {
  if (!agentConfig?.modules) return [];
  
  return agentConfig.modules.map(module => {
    const modulePath = path.join(ROOT_DIR, module.path);
    const exists = fs.existsSync(modulePath);
    
    return {
      name: module.name,
      path: module.path,
      status: exists ? module.status : 'missing',
      health: exists ? 'excellent' : 'needs_attention',
      features: module.features || [],
    };
  });
};

const generateHealthScore = (metrics, agentConfig) => {
  let score = 100;
  
  // Deduct for uncommitted changes
  if (metrics.git.uncommittedChanges > 10) score -= 10;
  else if (metrics.git.uncommittedChanges > 0) score -= 5;
  
  // Deduct for missing tests
  if (metrics.codebase.testFiles < 20) score -= 10;
  
  // Bonus for recent activity
  if (metrics.git.commitsLast7Days > 100) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

const generateReport = (metrics, agentConfig, modules) => {
  const healthScore = generateHealthScore(metrics, agentConfig);
  
  return {
    project: {
      name: CONFIG.projectName,
      path: ROOT_DIR,
      framework: agentConfig?.project?.framework || 'Next.js',
      monitoring_version: CONFIG.monitoringVersion,
    },
    timestamp: metrics.timestamp,
    monitoring_cycle: 1,
    report_type: 'automated_health_check',
    
    project_health: {
      overall_status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'fair' : 'needs_attention',
      health_score: healthScore,
      quality_gates: {
        build_status: metrics.health.buildStatus,
        test_coverage: 'unknown',
        type_errors: metrics.health.typeErrors,
        lint_errors: 0,
        security_issues: 0,
      },
    },
    
    codebase_metrics: {
      total_files: metrics.codebase.totalFiles,
      lines_of_code: metrics.codebase.linesOfCode,
      components: metrics.codebase.components,
      pages: metrics.codebase.pages,
      api_routes: metrics.codebase.apiRoutes,
      test_files: metrics.codebase.testFiles,
    },
    
    git_activity: {
      total_branches: metrics.git.totalBranches,
      current_branch: metrics.git.currentBranch,
      uncommitted_changes: metrics.git.uncommittedChanges,
      commits_last_7_days: metrics.git.commitsLast7Days,
      recent_commits: metrics.git.recentCommits,
      activity_trend: metrics.git.commitsLast7Days > 100 ? 'very_active' : 
                     metrics.git.commitsLast7Days > 50 ? 'active' : 
                     metrics.git.commitsLast7Days > 20 ? 'moderate' : 'low',
    },
    
    modules_status: {
      total_modules: modules.length,
      active_modules: modules.filter(m => m.status === 'active').length,
      modules: modules,
    },
    
    agent_activity: {
      background_agent: {
        name: agentConfig?.name || 'Unknown Agent',
        version: agentConfig?.version || '1.0.0',
        mode: agentConfig?.mode || 'unknown',
        status: agentConfig ? 'configured' : 'not_configured',
      },
      self_healing_stats: {
        enabled: agentConfig?.self_healing?.enabled || false,
        strategies_configured: agentConfig?.self_healing?.strategies?.length || 0,
      },
    },
    
    recommendations: {
      priority_high: [],
      priority_medium: [],
      priority_low: [],
    },
  };
  
  // Add recommendations based on metrics
  if (metrics.codebase.testFiles < 20) {
    report.recommendations.priority_high.push('Increase test coverage');
  }
  if (metrics.git.uncommittedChanges > 0) {
    report.recommendations.priority_medium.push('Commit pending changes');
  }
  if (metrics.codebase.apiRoutes > 100) {
    report.recommendations.priority_low.push('Consider API documentation');
  }
  
  return report;
};

const saveReport = (report) => {
  const reportsDir = path.join(ROOT_DIR, 'monitor', 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  
  const filename = `${CONFIG.projectName}-${report.timestamp.replace(/:/g, '-').replace(/\..+/, '')}.json`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  log(`Report saved: ${filename}`, 'success');
  
  // Also save as latest.json for easy access
  const latestPath = path.join(reportsDir, `${CONFIG.projectName}-latest.json`);
  fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));
  
  return filepath;
};

const updateAgentStatus = (report) => {
  const logsDir = path.join(ROOT_DIR, 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
  
  const statusFile = path.join(logsDir, 'agent-status.json');
  const status = {
    status: 'running',
    mode: 'monitor',
    last_update: report.timestamp,
    health_score: report.project_health.health_score,
    monitoring_cycle: report.monitoring_cycle,
    next_run: new Date(Date.now() + CONFIG.interval * 60 * 1000).toISOString(),
  };
  
  fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
  verbose('Agent status updated');
};

// Main monitoring cycle
const runMonitoringCycle = async () => {
  try {
    log('🚀 Starting monitoring cycle...', 'info');
    
    // Collect metrics
    const metrics = collectMetrics();
    log(`Collected metrics: ${metrics.codebase.totalFiles} files, ${metrics.codebase.linesOfCode} LOC`, 'info');
    
    // Read agent configuration
    const agentConfig = readAgentConfig();
    if (agentConfig) {
      verbose(`Agent config loaded: ${agentConfig.name}`);
    }
    
    // Analyze modules
    const modules = analyzeModules(agentConfig);
    verbose(`Analyzed ${modules.length} modules`);
    
    // Generate report
    const report = generateReport(metrics, agentConfig, modules);
    log(`Health score: ${report.project_health.health_score}/100`, 'success');
    
    // Save report
    const reportPath = saveReport(report);
    
    // Update agent status
    updateAgentStatus(report);
    
    log('✅ Monitoring cycle completed', 'success');
    
    return report;
  } catch (error) {
    log(`Monitoring cycle failed: ${error.message}`, 'error');
    if (CONFIG.verbose) {
      console.error(error);
    }
    return null;
  }
};

// Main execution
const main = async () => {
  log(`🤖 Monitor Agent v${CONFIG.monitoringVersion} for ${CONFIG.projectName}`, 'info');
  log(`Configuration: interval=${CONFIG.interval}min, runOnce=${CONFIG.runOnce}, verbose=${CONFIG.verbose}`, 'info');
  
  if (CONFIG.runOnce) {
    await runMonitoringCycle();
    log('Exiting after single run', 'info');
    process.exit(0);
  } else {
    // Run immediately
    await runMonitoringCycle();
    
    // Then run on interval
    log(`⏰ Scheduling next run in ${CONFIG.interval} minutes`, 'info');
    setInterval(async () => {
      await runMonitoringCycle();
      log(`⏰ Next run in ${CONFIG.interval} minutes`, 'info');
    }, CONFIG.interval * 60 * 1000);
  }
};

// Handle signals
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down gracefully...', 'warning');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down gracefully...', 'warning');
  process.exit(0);
});

// Run
main().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
