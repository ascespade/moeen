#!/usr/bin/env node

/**
 * Workflow Validation Script
 * Validates GitHub Actions workflows for syntax and best practices
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

class WorkflowValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.workflows = [];
  }

  async validateAll() {
    console.log('🔍 Starting workflow validation...');
    
    const workflowsDir = '.github/workflows';
    if (!fs.existsSync(workflowsDir)) {
      console.error('❌ .github/workflows directory not found');
      return false;
    }

    const workflowFiles = fs.readdirSync(workflowsDir)
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

    console.log(`📁 Found ${workflowFiles.length} workflow files`);

    for (const file of workflowFiles) {
      const filePath = path.join(workflowsDir, file);
      console.log(`\n🔍 Validating ${file}...`);
      
      const isValid = await this.validateWorkflow(filePath);
      this.workflows.push({
        file,
        path: filePath,
        valid: isValid,
        errors: [...this.errors],
        warnings: [...this.warnings]
      });

      // Clear errors/warnings for next file
      this.errors = [];
      this.warnings = [];
    }

    return this.generateReport();
  }

  async validateWorkflow(filePath) {
    let isValid = true;

    try {
      // Read and parse YAML
      const content = fs.readFileSync(filePath, 'utf8');
      const workflow = yaml.load(content);

      // Basic YAML validation
      if (!workflow) {
        this.addError('Empty or invalid YAML file');
        return false;
      }

      // Required fields validation
      this.validateRequiredFields(workflow, filePath);

      // Workflow structure validation
      this.validateWorkflowStructure(workflow, filePath);

      // Best practices validation
      this.validateBestPractices(workflow, filePath);

      // Security validation
      this.validateSecurity(workflow, filePath);

      // Performance validation
      this.validatePerformance(workflow, filePath);

    } catch (error) {
      this.addError(`YAML parsing error: ${error.message}`);
      isValid = false;
    }

    return isValid;
  }

  validateRequiredFields(workflow, filePath) {
    const required = ['name', 'on'];
    
    for (const field of required) {
      if (!workflow[field]) {
        this.addError(`Missing required field: ${field}`);
      }
    }

    // Validate 'on' field
    if (workflow.on) {
      if (typeof workflow.on !== 'object') {
        this.addError("'on' field must be an object");
      }
    }
  }

  validateWorkflowStructure(workflow, filePath) {
    // Validate jobs
    if (workflow.jobs) {
      if (typeof workflow.jobs !== 'object') {
        this.addError("'jobs' must be an object");
        return;
      }

      for (const [jobName, job] of Object.entries(workflow.jobs)) {
        this.validateJob(jobName, job, filePath);
      }
    } else {
      this.addWarning("No jobs defined in workflow");
    }
  }

  validateJob(jobName, job, filePath) {
    // Required job fields
    if (!job['runs-on'] && !job.runs_on) {
      this.addError(`Job '${jobName}' missing 'runs-on' field`);
    }

    // Validate steps
    if (job.steps) {
      if (!Array.isArray(job.steps)) {
        this.addError(`Job '${jobName}' steps must be an array`);
        return;
      }

      for (let i = 0; i < job.steps.length; i++) {
        this.validateStep(jobName, job.steps[i], i, filePath);
      }
    }
  }

  validateStep(jobName, step, stepIndex, filePath) {
    if (!step.name) {
      this.addError(`Job '${jobName}' step ${stepIndex + 1} missing 'name' field`);
    }

    if (!step.run && !step.uses && !step.if) {
      this.addError(`Job '${jobName}' step ${stepIndex + 1} must have 'run', 'uses', or 'if' field`);
    }

    // Validate timeout
    if (step.timeout_minutes && (step.timeout_minutes < 1 || step.timeout_minutes > 360)) {
      this.addWarning(`Job '${jobName}' step ${stepIndex + 1} has unusual timeout: ${step.timeout_minutes} minutes`);
    }
  }

  validateBestPractices(workflow, filePath) {
    // Check for permissions
    if (!workflow.permissions) {
      this.addWarning("Workflow missing 'permissions' field - consider adding explicit permissions");
    }

    // Check for environment variables
    if (workflow.env) {
      for (const [key, value] of Object.entries(workflow.env)) {
        if (typeof value === 'string' && value.includes('${{') && !value.includes('secrets.')) {
          this.addWarning(`Environment variable '${key}' uses GitHub context without secrets - ensure this is intentional`);
        }
      }
    }

    // Check for proper artifact handling
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('actions/upload-artifact') && !content.includes('actions/download-artifact')) {
      this.addWarning("Workflow uploads artifacts but doesn't download them - ensure this is intentional");
    }
  }

  validateSecurity(workflow, filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for hardcoded secrets
    const secretPatterns = [
      /password\s*:\s*['"][^'"]+['"]/i,
      /token\s*:\s*['"][^'"]+['"]/i,
      /key\s*:\s*['"][^'"]+['"]/i
    ];

    for (const pattern of secretPatterns) {
      if (pattern.test(content)) {
        this.addWarning("Potential hardcoded secret detected - use GitHub secrets instead");
      }
    }

    // Check for dangerous actions
    const dangerousActions = [
      'actions/checkout@v1',
      'actions/checkout@v2'
    ];

    for (const action of dangerousActions) {
      if (content.includes(action)) {
        this.addWarning(`Using potentially vulnerable action: ${action} - consider updating to latest version`);
      }
    }
  }

  validatePerformance(workflow, filePath) {
    // Check for excessive parallelism
    if (workflow.jobs) {
      const jobCount = Object.keys(workflow.jobs).length;
      if (jobCount > 20) {
        this.addWarning(`Workflow has ${jobCount} jobs - consider splitting into multiple workflows`);
      }
    }

    // Check for long-running jobs
    const content = fs.readFileSync(filePath, 'utf8');
    const timeoutMatches = content.match(/timeout-minutes:\s*(\d+)/g);
    if (timeoutMatches) {
      for (const match of timeoutMatches) {
        const minutes = parseInt(match.split(':')[1].trim());
        if (minutes > 120) {
          this.addWarning(`Job timeout is ${minutes} minutes - consider optimizing for faster execution`);
        }
      }
    }
  }

  addError(message) {
    this.errors.push(message);
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  generateReport() {
    console.log('\n📊 Validation Report');
    console.log('='.repeat(50));

    let totalErrors = 0;
    let totalWarnings = 0;
    let validWorkflows = 0;

    for (const workflow of this.workflows) {
      console.log(`\n📄 ${workflow.file}`);
      console.log(`   Status: ${workflow.valid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (workflow.errors.length > 0) {
        console.log('   Errors:');
        workflow.errors.forEach(error => console.log(`     ❌ ${error}`));
        totalErrors += workflow.errors.length;
      }
      
      if (workflow.warnings.length > 0) {
        console.log('   Warnings:');
        workflow.warnings.forEach(warning => console.log(`     ⚠️  ${warning}`));
        totalWarnings += workflow.warnings.length;
      }

      if (workflow.valid) {
        validWorkflows++;
      }
    }

    console.log('\n📈 Summary');
    console.log(`   Total workflows: ${this.workflows.length}`);
    console.log(`   Valid workflows: ${validWorkflows}`);
    console.log(`   Total errors: ${totalErrors}`);
    console.log(`   Total warnings: ${totalWarnings}`);

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalWorkflows: this.workflows.length,
        validWorkflows,
        totalErrors,
        totalWarnings
      },
      workflows: this.workflows
    };

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync('reports/workflow-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to: reports/workflow-validation-report.json');

    return totalErrors === 0;
  }
}

// CLI interface
if (require.main === module) {
  const validator = new WorkflowValidator();

  async function main() {
    const isValid = await validator.validateAll();
    process.exit(isValid ? 0 : 1);
  }

  main().catch(console.error);
}

module.exports = WorkflowValidator;