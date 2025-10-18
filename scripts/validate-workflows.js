#!/usr/bin/env node

/**
 * GitHub Actions Workflow Validator
 * Validates workflow syntax, dependencies, and best practices
 */

const { readFileSync, readdirSync, statSync } = require('fs');
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

function validateWorkflow(filePath) {
  const issues = [];
  const warnings = [];
  
  try {
    const content = readFileSync(filePath, 'utf8');
    const workflow = yaml.load(content);
    
    log(`\n🔍 Validating ${filePath}`, 'cyan');
    
    // Check required fields
    if (!workflow.name) {
      issues.push('Missing workflow name');
    }
    
    if (!workflow.on) {
      issues.push('Missing trigger configuration');
    }
    
    if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
      issues.push('No jobs defined');
    }
    
    // Validate jobs
    for (const [jobName, job] of Object.entries(workflow.jobs)) {
      if (!job['runs-on']) {
        issues.push(`Job '${jobName}' missing runs-on`);
      }
      
      if (!job.steps || job.steps.length === 0) {
        issues.push(`Job '${jobName}' has no steps`);
      }
      
      // Check for common issues in steps
      job.steps?.forEach((step, index) => {
        if (!step.name) {
          issues.push(`Job '${jobName}' step ${index + 1} missing name`);
        }
        
        if (!step.uses && !step.run) {
          issues.push(`Job '${jobName}' step '${step.name}' missing uses or run`);
        }
        
        // Check for deprecated actions
        if (step.uses) {
          if (step.uses.includes('actions/checkout@v1') || 
              step.uses.includes('actions/checkout@v2')) {
            warnings.push(`Job '${jobName}' step '${step.name}' uses deprecated checkout version`);
          }
          
          if (step.uses.includes('actions/setup-node@v1') || 
              step.uses.includes('actions/setup-node@v2')) {
            warnings.push(`Job '${jobName}' step '${step.name}' uses deprecated setup-node version`);
          }
        }
      });
    }
    
    // Check for security issues
    if (content.includes('${{ secrets.GITHUB_TOKEN }}') && !workflow.permissions) {
      warnings.push('Using GITHUB_TOKEN without explicit permissions');
    }
    
    // Check for hardcoded values
    if (content.includes('ubuntu-18.04')) {
      warnings.push('Using deprecated ubuntu-18.04 runner');
    }
    
    if (content.includes('node-version: 16')) {
      warnings.push('Using Node.js 16 (consider upgrading to 18 or 20)');
    }
    
    return { issues, warnings, valid: issues.length === 0 };
    
  } catch (error) {
    return { 
      issues: [`YAML parsing error: ${error.message}`], 
      warnings: [], 
      valid: false 
    };
  }
}

function checkPackageJsonScripts() {
  const packageJsonPath = join(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};
  
  log('\n📦 Checking package.json scripts', 'cyan');
  
  const missingScripts = [];
  const requiredScripts = [
    'lint:check', 'lint:fix', 'type:check', 'test:unit', 
    'test:integration', 'test:e2e', 'test:coverage',
    'agent:auto', 'agent:fix', 'agent:test', 'agent:optimize',
    'agent:refactor', 'agent:background', 'agent:monitor', 'agent:heal',
    'security:audit', 'security:fix', 'deploy:prod'
  ];
  
  requiredScripts.forEach(script => {
    if (!scripts[script]) {
      missingScripts.push(script);
    }
  });
  
  if (missingScripts.length > 0) {
    log(`❌ Missing scripts: ${missingScripts.join(', ')}`, 'red');
  } else {
    log('✅ All required scripts found', 'green');
  }
  
  return missingScripts;
}

function generateWorkflowReport(workflows, missingScripts) {
  log('\n📊 Workflow Validation Report', 'bright');
  log('='.repeat(50), 'bright');
  
  let totalIssues = 0;
  let totalWarnings = 0;
  
  workflows.forEach(({ file, result }) => {
    log(`\n📁 ${file}`, 'blue');
    
    if (result.valid) {
      log('✅ Valid workflow', 'green');
    } else {
      log('❌ Invalid workflow', 'red');
    }
    
    if (result.issues.length > 0) {
      log('Issues:', 'red');
      result.issues.forEach(issue => log(`  • ${issue}`, 'red'));
      totalIssues += result.issues.length;
    }
    
    if (result.warnings.length > 0) {
      log('Warnings:', 'yellow');
      result.warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
      totalWarnings += result.warnings.length;
    }
  });
  
  log('\n📈 Summary', 'bright');
  log(`Total workflows: ${workflows.length}`, 'blue');
  log(`Total issues: ${totalIssues}`, totalIssues > 0 ? 'red' : 'green');
  log(`Total warnings: ${totalWarnings}`, totalWarnings > 0 ? 'yellow' : 'green');
  log(`Missing scripts: ${missingScripts.length}`, missingScripts.length > 0 ? 'red' : 'green');
  
  return {
    totalWorkflows: workflows.length,
    totalIssues,
    totalWarnings,
    missingScripts: missingScripts.length,
    allValid: totalIssues === 0
  };
}

async function main() {
  log('🚀 GitHub Actions Workflow Validator', 'bright');
  log('='.repeat(40), 'bright');
  
  const workflowsDir = join(projectRoot, '.github', 'workflows');
  const workflowFiles = readdirSync(workflowsDir)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
    .map(file => join(workflowsDir, file));
  
  const workflows = workflowFiles.map(file => ({
    file: file.replace(projectRoot + '/', ''),
    result: validateWorkflow(file)
  }));
  
  const missingScripts = checkPackageJsonScripts();
  const report = generateWorkflowReport(workflows, missingScripts);
  
  if (report.allValid && missingScripts.length === 0) {
    log('\n🎉 All workflows are valid!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ Some issues found. Please review and fix.', 'yellow');
    process.exit(1);
  }
}

main().catch(error => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
