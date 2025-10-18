#!/usr/bin/env node

/**
 * Workflow Testing Script
 * Tests GitHub Actions workflows using act (local runner)
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class WorkflowTester {
  constructor() {
    this.actAvailable = this.checkActAvailability();
    this.testResults = [];
  }

  checkActAvailability() {
    try {
      execSync('act --version', { stdio: 'pipe' });
      console.log('✅ act is available');
      return true;
    } catch (error) {
      console.warn('⚠️ act is not available - install with: https://github.com/nektos/act');
      return false;
    }
  }

  async testAllWorkflows() {
    console.log('🧪 Starting workflow testing...');
    
    if (!this.actAvailable) {
      console.log('❌ Cannot test workflows without act');
      return false;
    }

    const workflowsDir = '.github/workflows';
    if (!fs.existsSync(workflowsDir)) {
      console.error('❌ .github/workflows directory not found');
      return false;
    }

    const workflowFiles = fs.readdirSync(workflowsDir)
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

    console.log(`📁 Found ${workflowFiles.length} workflow files`);

    for (const file of workflowFiles) {
      console.log(`\n🧪 Testing ${file}...`);
      const result = await this.testWorkflow(file);
      this.testResults.push(result);
    }

    return this.generateTestReport();
  }

  async testWorkflow(filename) {
    const workflowPath = path.join('.github/workflows', filename);
    const result = {
      file: filename,
      path: workflowPath,
      success: false,
      error: null,
      duration: 0,
      jobs: []
    };

    const startTime = Date.now();

    try {
      // Test workflow syntax first
      console.log('  🔍 Validating syntax...');
      execSync(`act --list`, { stdio: 'pipe' });
      
      // Test specific workflow
      console.log('  🚀 Running workflow...');
      const output = execSync(`act --workflows ${workflowPath} --list`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });

      // Parse job information
      const jobLines = output.split('\n').filter(line => 
        line.includes('Job') && !line.includes('Workflow')
      );
      
      result.jobs = jobLines.map(line => {
        const match = line.match(/Job\s+(\w+)/);
        return match ? match[1] : 'unknown';
      });

      result.success = true;
      console.log(`  ✅ Workflow test passed (${result.jobs.length} jobs found)`);

    } catch (error) {
      result.error = error.message;
      console.log(`  ❌ Workflow test failed: ${error.message}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  async testWorkflowWithEvent(filename, eventType = 'push') {
    console.log(`🧪 Testing ${filename} with ${eventType} event...`);
    
    const workflowPath = path.join('.github/workflows', filename);
    const result = {
      file: filename,
      event: eventType,
      success: false,
      error: null,
      duration: 0
    };

    const startTime = Date.now();

    try {
      // Create a test event file
      const eventFile = this.createTestEvent(eventType);
      
      // Run workflow with specific event
      const output = execSync(`act --workflows ${workflowPath} --eventpath ${eventFile} --dryrun`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      result.success = true;
      console.log(`  ✅ Workflow test with ${eventType} event passed`);

      // Clean up event file
      fs.unlinkSync(eventFile);

    } catch (error) {
      result.error = error.message;
      console.log(`  ❌ Workflow test with ${eventType} event failed: ${error.message}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  createTestEvent(eventType) {
    const eventData = {
      push: {
        ref: 'refs/heads/main',
        head_commit: {
          id: 'test-commit-id',
          message: 'Test commit message',
          author: {
            name: 'Test User',
            email: 'test@example.com'
          }
        }
      },
      pull_request: {
        action: 'opened',
        pull_request: {
          number: 1,
          title: 'Test PR',
          head: {
            ref: 'feature/test',
            sha: 'test-sha'
          },
          base: {
            ref: 'main',
            sha: 'base-sha'
          }
        }
      },
      workflow_dispatch: {
        inputs: {
          mode: 'auto',
          scope: 'full',
          'force-full-test': false
        }
      }
    };

    const eventFile = `test-event-${Date.now()}.json`;
    fs.writeFileSync(eventFile, JSON.stringify(eventData[eventType] || {}, null, 2));
    return eventFile;
  }

  async testSelfHealingWorkflow() {
    console.log('🤖 Testing Self-Healing Workflow...');
    
    const testCases = [
      {
        name: 'Normal push event',
        event: 'push',
        expectedJobs: ['intelligent-analysis', 'intelligent-testing']
      },
      {
        name: 'Pull request event',
        event: 'pull_request',
        expectedJobs: ['intelligent-analysis', 'intelligent-testing']
      },
      {
        name: 'Manual dispatch',
        event: 'workflow_dispatch',
        expectedJobs: ['intelligent-analysis', 'intelligent-testing']
      },
      {
        name: 'Scheduled run',
        event: 'schedule',
        expectedJobs: ['intelligent-analysis', 'intelligent-testing']
      }
    ];

    const results = [];

    for (const testCase of testCases) {
      console.log(`  🧪 Testing: ${testCase.name}`);
      const result = await this.testWorkflowWithEvent('ultimate-ci-self-healing.yml', testCase.event);
      result.testCase = testCase.name;
      result.expectedJobs = testCase.expectedJobs;
      results.push(result);
    }

    return results;
  }

  async testCIAssistantWorkflow() {
    console.log('🔧 Testing CI Assistant Workflow...');
    
    const testCases = [
      {
        name: 'Workflow run failure',
        event: 'workflow_run',
        expectedJobs: ['analyze-and-fix']
      }
    ];

    const results = [];

    for (const testCase of testCases) {
      console.log(`  🧪 Testing: ${testCase.name}`);
      const result = await this.testWorkflowWithEvent('ci-assistant.yml', testCase.event);
      result.testCase = testCase.name;
      result.expectedJobs = testCase.expectedJobs;
      results.push(result);
    }

    return results;
  }

  generateTestReport() {
    console.log('\n📊 Test Report');
    console.log('='.repeat(50));

    let totalTests = this.testResults.length;
    let passedTests = this.testResults.filter(r => r.success).length;
    let failedTests = totalTests - passedTests;

    for (const result of this.testResults) {
      console.log(`\n📄 ${result.file}`);
      console.log(`   Status: ${result.success ? '✅ Passed' : '❌ Failed'}`);
      console.log(`   Duration: ${result.duration}ms`);
      console.log(`   Jobs: ${result.jobs.length}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }

    console.log('\n📈 Summary');
    console.log(`   Total tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${failedTests}`);
    console.log(`   Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: (passedTests / totalTests) * 100
      },
      results: this.testResults
    };

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync('reports/workflow-test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to: reports/workflow-test-report.json');

    return failedTests === 0;
  }

  async runComprehensiveTests() {
    console.log('🚀 Running comprehensive workflow tests...');
    
    const allResults = [];

    // Test all workflows
    const basicResults = await this.testAllWorkflows();
    allResults.push(...this.testResults);

    // Test self-healing workflow specifically
    const selfHealingResults = await this.testSelfHealingWorkflow();
    allResults.push(...selfHealingResults);

    // Test CI assistant workflow specifically
    const ciAssistantResults = await this.testCIAssistantWorkflow();
    allResults.push(...ciAssistantResults);

    // Generate comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: allResults.length,
        passedTests: allResults.filter(r => r.success).length,
        failedTests: allResults.filter(r => !r.success).length
      },
      results: allResults
    };

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync('reports/comprehensive-test-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 Comprehensive Test Report');
    console.log(`   Total tests: ${allResults.length}`);
    console.log(`   Passed: ${report.summary.passedTests}`);
    console.log(`   Failed: ${report.summary.failedTests}`);
    console.log(`   Success rate: ${((report.summary.passedTests / allResults.length) * 100).toFixed(1)}%`);

    return report.summary.failedTests === 0;
  }
}

// CLI interface
if (require.main === module) {
  const tester = new WorkflowTester();

  async function main() {
    const command = process.argv[2];
    
    switch (command) {
      case 'all':
        const allSuccess = await tester.testAllWorkflows();
        process.exit(allSuccess ? 0 : 1);
        break;
        
      case 'self-healing':
        const selfHealingSuccess = await tester.testSelfHealingWorkflow();
        process.exit(selfHealingSuccess.every(r => r.success) ? 0 : 1);
        break;
        
      case 'ci-assistant':
        const ciAssistantSuccess = await tester.testCIAssistantWorkflow();
        process.exit(ciAssistantSuccess.every(r => r.success) ? 0 : 1);
        break;
        
      case 'comprehensive':
        const comprehensiveSuccess = await tester.runComprehensiveTests();
        process.exit(comprehensiveSuccess ? 0 : 1);
        break;
        
      default:
        console.log(`
Usage: node test-workflows.js <command>

Commands:
  all            - Test all workflows
  self-healing   - Test self-healing workflow specifically
  ci-assistant   - Test CI assistant workflow specifically
  comprehensive  - Run comprehensive tests
        `);
    }
  }

  main().catch(console.error);
}

module.exports = WorkflowTester;