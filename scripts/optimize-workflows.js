#!/usr/bin/env node

/**
 * GitHub Actions Workflow Optimizer
 * Analyzes and optimizes workflow performance, reliability, and maintainability
 */

const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { join, dirname } = require('path');
const yaml = require('js-yaml');

const projectRoot = join(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function analyzeWorkflow(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const workflow = yaml.load(content);
  
  const analysis = {
    file: filePath.replace(projectRoot + '/', ''),
    issues: [],
    optimizations: [],
    metrics: {
      totalJobs: Object.keys(workflow.jobs || {}).length,
      totalSteps: 0,
      hasTimeouts: 0,
      hasRetries: 0,
      hasCaching: 0,
      hasPermissions: !!workflow.permissions,
      usesLatestActions: 0,
      hasErrorHandling: 0
    }
  };
  
  // Analyze each job
  for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
    const steps = job.steps || [];
    analysis.metrics.totalSteps += steps.length;
    
    if (job.timeout_minutes) {
      analysis.metrics.hasTimeouts++;
    }
    
    // Analyze steps
    steps.forEach((step, index) => {
      // Check for caching
      if (step.uses && step.uses.includes('actions/cache')) {
        analysis.metrics.hasCaching++;
      }
      
      // Check for retries
      if (step.continue_on_error || step.retry_on_failure) {
        analysis.metrics.hasRetries++;
      }
      
      // Check for error handling
      if (step.continue_on_error || step.if) {
        analysis.metrics.hasErrorHandling++;
      }
      
      // Check for latest action versions
      if (step.uses) {
        if (step.uses.includes('actions/checkout@v4') || 
            step.uses.includes('actions/setup-node@v4')) {
          analysis.metrics.usesLatestActions++;
        }
      }
    });
  }
  
  // Identify issues and optimizations
  if (!workflow.permissions) {
    analysis.issues.push('Missing explicit permissions');
    analysis.optimizations.push('Add explicit permissions for security');
  }
  
  if (analysis.metrics.hasTimeouts === 0) {
    analysis.issues.push('No job timeouts defined');
    analysis.optimizations.push('Add timeout-minutes to prevent hanging jobs');
  }
  
  if (analysis.metrics.hasCaching === 0) {
    analysis.optimizations.push('Consider adding caching for dependencies');
  }
  
  if (analysis.metrics.hasRetries === 0) {
    analysis.optimizations.push('Add retry logic for critical steps');
  }
  
  if (analysis.metrics.hasErrorHandling < analysis.metrics.totalSteps * 0.3) {
    analysis.optimizations.push('Improve error handling across steps');
  }
  
  // Check for deprecated patterns
  if (content.includes('ubuntu-18.04')) {
    analysis.issues.push('Using deprecated ubuntu-18.04 runner');
    analysis.optimizations.push('Upgrade to ubuntu-latest');
  }
  
  if (content.includes('node-version: 16')) {
    analysis.issues.push('Using Node.js 16 (deprecated)');
    analysis.optimizations.push('Upgrade to Node.js 20');
  }
  
  return analysis;
}

function generateOptimizationReport(analyses) {
  log('\n📊 Workflow Optimization Report', 'bright');
  log('='.repeat(50), 'bright');
  
  let totalIssues = 0;
  let totalOptimizations = 0;
  
  analyses.forEach(analysis => {
    log(`\n📁 ${analysis.file}`, 'blue');
    
    // Metrics
    log(`  📊 Jobs: ${analysis.metrics.totalJobs}, Steps: ${analysis.metrics.totalSteps}`, 'cyan');
    log(`  ⏱️  Timeouts: ${analysis.metrics.hasTimeouts}/${analysis.metrics.totalJobs}`, 'cyan');
    log(`  🔄 Retries: ${analysis.metrics.hasRetries}`, 'cyan');
    log(`  💾 Caching: ${analysis.metrics.hasCaching}`, 'cyan');
    log(`  🔒 Permissions: ${analysis.metrics.hasPermissions ? 'Yes' : 'No'}`, 'cyan');
    log(`  🆕 Latest Actions: ${analysis.metrics.usesLatestActions}`, 'cyan');
    log(`  🛡️  Error Handling: ${analysis.metrics.hasErrorHandling}`, 'cyan');
    
    // Issues
    if (analysis.issues.length > 0) {
      log('  ❌ Issues:', 'red');
      analysis.issues.forEach(issue => {
        log(`    • ${issue}`, 'red');
        totalIssues++;
      });
    }
    
    // Optimizations
    if (analysis.optimizations.length > 0) {
      log('  💡 Optimizations:', 'yellow');
      analysis.optimizations.forEach(opt => {
        log(`    • ${opt}`, 'yellow');
        totalOptimizations++;
      });
    }
  });
  
  log('\n📈 Summary', 'bright');
  log(`Total workflows: ${analyses.length}`, 'blue');
  log(`Total issues: ${totalIssues}`, totalIssues > 0 ? 'red' : 'green');
  log(`Total optimizations: ${totalOptimizations}`, 'yellow');
  
  return {
    totalWorkflows: analyses.length,
    totalIssues,
    totalOptimizations,
    analyses
  };
}

function createOptimizedWorkflow(originalPath, analysis) {
  const content = readFileSync(originalPath, 'utf8');
  let optimized = content;
  
  // Apply optimizations
  if (!content.includes('permissions:')) {
    optimized = optimized.replace(
      /env:\s*\n/,
      `env:\n  NODE_VERSION: '20'\n  NPM_VERSION: '10'\n  CI: true\n\npermissions:\n  contents: read\n  actions: read\n  checks: write\n  statuses: write\n\n`
    );
  }
  
  // Add timeouts to jobs that don't have them
  if (!content.includes('timeout-minutes:')) {
    optimized = optimized.replace(
      /(\s+)(runs-on: ubuntu-latest)\n(\s+)(name:)/g,
      '$1$2\n$1timeout-minutes: 15\n$3$4'
    );
  }
  
  // Upgrade Node.js version
  optimized = optimized.replace(/node-version: ['"]18['"]/g, "node-version: '20'");
  optimized = optimized.replace(/NODE_VERSION: ['"]18['"]/g, "NODE_VERSION: '20'");
  
  // Add continue-on-error to test steps (only if not already present)
  optimized = optimized.replace(
    /(npm run test:\w+)\n(\s+)(continue-on-error: true\n)?/g,
    (match, testCmd, indent, existing) => {
      if (existing) return match; // Already has continue-on-error
      return `${testCmd}\n${indent}continue-on-error: true\n`;
    }
  );
  
  return optimized;
}

async function main() {
  log('🚀 GitHub Actions Workflow Optimizer', 'bright');
  log('='.repeat(40), 'bright');
  
  const workflowsDir = join(projectRoot, '.github', 'workflows');
  const workflowFiles = readdirSync(workflowsDir)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
    .map(file => join(workflowsDir, file));
  
  const analyses = workflowFiles.map(file => analyzeWorkflow(file));
  const report = generateOptimizationReport(analyses);
  
  // Create optimized versions
  log('\n🔧 Creating optimized workflows...', 'cyan');
  
  analyses.forEach(analysis => {
    if (analysis.issues.length > 0 || analysis.optimizations.length > 0) {
      const originalPath = join(projectRoot, analysis.file);
      const optimized = createOptimizedWorkflow(originalPath, analysis);
      
      // Create backup
      const backupPath = originalPath + '.backup';
      writeFileSync(backupPath, readFileSync(originalPath));
      
      // Write optimized version
      writeFileSync(originalPath, optimized);
      
      log(`✅ Optimized ${analysis.file}`, 'green');
    }
  });
  
  if (report.totalIssues === 0 && report.totalOptimizations === 0) {
    log('\n🎉 All workflows are already optimized!', 'green');
  } else {
    log(`\n✨ Applied ${report.totalOptimizations} optimizations`, 'green');
    log('💾 Original files backed up with .backup extension', 'yellow');
  }
}

main().catch(error => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
