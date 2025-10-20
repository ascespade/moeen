import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

#!/usr/bin/env node

/**
 * Project Checks Runner
 * Runs various checks to ensure project health
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectChecksRunner {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.checks = [];
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: 0
    };
  }

  async runChecks() {
    console.log('🔍 Running project checks...');
    
    await this.checkGitStatus();
    await this.checkPackageJson();
    await this.checkTypeScript();
    await this.checkESLint();
    await this.checkPrettier();
    await this.checkBuild();
    await this.checkTests();
    await this.checkDependencies();
    await this.checkSecurity();
    await this.checkPerformance();
    
    return {
      checks: this.checks,
      results: this.results,
      summary: this.getSummary()
    };
  }

  async checkGitStatus() {
    console.log('  🔍 Checking Git status...');
    
    try {
      const status = execSync('git status --porcelain', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const hasChanges = status.trim().length > 0;
      
      this.checks.push({
        name: 'Git Status',
        status: hasChanges ? 'warning' : 'passed',
        message: hasChanges ? 'Uncommitted changes detected' : 'Working directory clean',
        details: hasChanges ? status : null
      });
      
      if (hasChanges) {
        this.results.warnings++;
      } else {
        this.results.passed++;
      }
    } catch (error) {
      this.checks.push({
        name: 'Git Status',
        status: 'failed',
        message: 'Git not available or not a git repository',
        details: error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkPackageJson() {
    console.log('  📦 Checking package.json...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      this.checks.push({
        name: 'Package.json',
        status: 'failed',
        message: 'package.json not found',
        details: null
      });
      this.results.failed++;
      this.results.total++;
      return;
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const issues = [];
      
      // Check for required fields
      if (!packageJson.name) issues.push('Missing name field');
      if (!packageJson.version) issues.push('Missing version field');
      if (!packageJson.scripts) issues.push('Missing scripts field');
      
      // Check for common scripts
      const requiredScripts = ['build', 'test'];
      for (const script of requiredScripts) {
        if (!packageJson.scripts[script]) {
          issues.push(`Missing ${script} script`);
        }
      }
      
      // Check for dependencies
      if (!packageJson.dependencies && !packageJson.devDependencies) {
        issues.push('No dependencies found');
      }
      
      const status = issues.length === 0 ? 'passed' : 'warning';
      const message = issues.length === 0 ? 'Package.json is valid' : `Issues found: ${issues.join(', ')}`;
      
      this.checks.push({
        name: 'Package.json',
        status: status,
        message: message,
        details: issues.length > 0 ? issues : null
      });
      
      if (status === 'passed') {
        this.results.passed++;
      } else {
        this.results.warnings++;
      }
    } catch (error) {
      this.checks.push({
        name: 'Package.json',
        status: 'failed',
        message: 'Invalid JSON format',
        details: error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkTypeScript() {
    console.log('  📝 Checking TypeScript...');
    
    const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
    
    if (!fs.existsSync(tsconfigPath)) {
      this.checks.push({
        name: 'TypeScript',
        status: 'warning',
        message: 'tsconfig.json not found',
        details: null
      });
      this.results.warnings++;
      this.results.total++;
      return;
    }
    
    try {
      const output = execSync('tsc --noEmit', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.checks.push({
        name: 'TypeScript',
        status: 'passed',
        message: 'TypeScript compilation successful',
        details: null
      });
      this.results.passed++;
    } catch (error) {
      this.checks.push({
        name: 'TypeScript',
        status: 'failed',
        message: 'TypeScript compilation failed',
        details: error.stdout || error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkESLint() {
    console.log('  🔍 Checking ESLint...');
    
    const eslintConfigs = [
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yaml',
      '.eslintrc.yml',
      'eslint.config.js'
    ];
    
    const hasConfig = eslintConfigs.some(config => 
      fs.existsSync(path.join(this.projectRoot, config))
    );
    
    if (!hasConfig) {
      this.checks.push({
        name: 'ESLint',
        status: 'warning',
        message: 'ESLint config not found',
        details: null
      });
      this.results.warnings++;
      this.results.total++;
      return;
    }
    
    try {
      const output = execSync('eslint src/ app/ --max-warnings 0', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.checks.push({
        name: 'ESLint',
        status: 'passed',
        message: 'ESLint passed with no issues',
        details: null
      });
      this.results.passed++;
    } catch (error) {
      this.checks.push({
        name: 'ESLint',
        status: 'failed',
        message: 'ESLint found issues',
        details: error.stdout || error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkPrettier() {
    console.log('  🎨 Checking Prettier...');
    
    const prettierConfigs = [
      '.prettierrc',
      '.prettierrc.js',
      '.prettierrc.json',
      '.prettierrc.yaml',
      '.prettierrc.yml',
      'prettier.config.js'
    ];
    
    const hasConfig = prettierConfigs.some(config => 
      fs.existsSync(path.join(this.projectRoot, config))
    );
    
    if (!hasConfig) {
      this.checks.push({
        name: 'Prettier',
        status: 'warning',
        message: 'Prettier config not found',
        details: null
      });
      this.results.warnings++;
      this.results.total++;
      return;
    }
    
    try {
      const output = execSync('prettier --check src/ app/', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.checks.push({
        name: 'Prettier',
        status: 'passed',
        message: 'Prettier formatting is correct',
        details: null
      });
      this.results.passed++;
    } catch (error) {
      this.checks.push({
        name: 'Prettier',
        status: 'failed',
        message: 'Prettier found formatting issues',
        details: error.stdout || error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkBuild() {
    console.log('  🏗️  Checking build...');
    
    try {
      const output = execSync('npm run build', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.checks.push({
        name: 'Build',
        status: 'passed',
        message: 'Build successful',
        details: null
      });
      this.results.passed++;
    } catch (error) {
      this.checks.push({
        name: 'Build',
        status: 'failed',
        message: 'Build failed',
        details: error.stdout || error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkTests() {
    console.log('  🧪 Checking tests...');
    
    const testScripts = ['test', 'test:unit', 'test:integration', 'test:e2e'];
    let testFound = false;
    
    for (const script of testScripts) {
      try {
        const output = execSync(`npm run ${script}`, {
          cwd: this.projectRoot,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        this.checks.push({
          name: `Tests (${script})`,
          status: 'passed',
          message: `${script} passed`,
          details: null
        });
        this.results.passed++;
        testFound = true;
        break;
      } catch (error) {
        // Continue to next test script
      }
    }
    
    if (!testFound) {
      this.checks.push({
        name: 'Tests',
        status: 'warning',
        message: 'No test scripts found or all tests failed',
        details: null
      });
      this.results.warnings++;
    }
    
    this.results.total++;
  }

  async checkDependencies() {
    console.log('  📦 Checking dependencies...');
    
    try {
      const output = execSync('npm audit --audit-level=moderate', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.checks.push({
        name: 'Dependencies',
        status: 'passed',
        message: 'No security vulnerabilities found',
        details: null
      });
      this.results.passed++;
    } catch (error) {
      this.checks.push({
        name: 'Dependencies',
        status: 'failed',
        message: 'Security vulnerabilities found',
        details: error.stdout || error.message
      });
      this.results.failed++;
    }
    
    this.results.total++;
  }

  async checkSecurity() {
    console.log('  🔒 Checking security...');
    
    const securityChecks = [];
    
    // Check for sensitive files
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      'secrets.json',
      'config.json'
    ];
    
    for (const file of sensitiveFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        securityChecks.push(`Sensitive file found: ${file}`);
      }
    }
    
    // Check for hardcoded secrets (basic check)
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];
    
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
          
          // Basic checks for hardcoded secrets
          if (content.includes('password') && content.includes('=')) {
            securityChecks.push(`Potential hardcoded password in ${file}`);
          }
          if (content.includes('api_key') && content.includes('=')) {
            securityChecks.push(`Potential hardcoded API key in ${file}`);
          }
          if (content.includes('secret') && content.includes('=')) {
            securityChecks.push(`Potential hardcoded secret in ${file}`);
          }
        } catch (error) {
          // Ignore errors
        }
      }
    }
    
    const status = securityChecks.length === 0 ? 'passed' : 'warning';
    const message = securityChecks.length === 0 ? 'No security issues found' : `Security issues found: ${securityChecks.length}`;
    
    this.checks.push({
      name: 'Security',
      status: status,
      message: message,
      details: securityChecks.length > 0 ? securityChecks : null
    });
    
    if (status === 'passed') {
      this.results.passed++;
    } else {
      this.results.warnings++;
    }
    
    this.results.total++;
  }

  async checkPerformance() {
    console.log('  ⚡ Checking performance...');
    
    const performanceChecks = [];
    
    // Check for large files
    const patterns = [
      'src/**/*',
      'app/**/*',
      'pages/**/*',
      'components/**/*',
      'public/**/*'
    ];
    
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        try {
          const stats = fs.statSync(path.join(this.projectRoot, file));
          
          // Check for files larger than 1MB
          if (stats.size > 1024 * 1024) {
            performanceChecks.push(`Large file: ${file} (${Math.round(stats.size / 1024 / 1024)}MB)`);
          }
        } catch (error) {
          // Ignore errors
        }
      }
    }
    
    // Check for bundle size (if build directory exists)
    const buildDir = path.join(this.projectRoot, '.next', 'static');
    if (fs.existsSync(buildDir)) {
      try {
        const output = execSync('du -sh .next/static', {
          cwd: this.projectRoot,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        const size = output.trim().split('\t')[0];
        performanceChecks.push(`Bundle size: ${size}`);
      } catch (error) {
        // Ignore errors
      }
    }
    
    const status = performanceChecks.length === 0 ? 'passed' : 'warning';
    const message = performanceChecks.length === 0 ? 'No performance issues found' : `Performance issues found: ${performanceChecks.length}`;
    
    this.checks.push({
      name: 'Performance',
      status: status,
      message: message,
      details: performanceChecks.length > 0 ? performanceChecks : null
    });
    
    if (status === 'passed') {
      this.results.passed++;
    } else {
      this.results.warnings++;
    }
    
    this.results.total++;
  }

  getSummary() {
    const total = this.results.total;
    const passed = this.results.passed;
    const failed = this.results.failed;
    const warnings = this.results.warnings;
    
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return {
      total,
      passed,
      failed,
      warnings,
      passRate,
      status: failed > 0 ? 'failed' : warnings > 0 ? 'warning' : 'passed'
    };
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const runner = new ProjectChecksRunner(projectRoot);
  
  runner.runChecks().then(result => {
    console.log('\n📊 Project Checks Summary:');
    console.log('==========================');
    console.log(`Total checks: ${result.summary.total}`);
    console.log(`Passed: ${result.summary.passed}`);
    console.log(`Failed: ${result.summary.failed}`);
    console.log(`Warnings: ${result.summary.warnings}`);
    console.log(`Pass rate: ${result.summary.passRate}%`);
    console.log(`Overall status: ${result.summary.status.toUpperCase()}`);
    
    console.log('\n📋 Detailed Results:');
    console.log('====================');
    
    for (const check of result.checks) {
      const statusIcon = check.status === 'passed' ? '✅' : 
                        check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${statusIcon} ${check.name}: ${check.message}`);
      
      if (check.details) {
        console.log(`   Details: ${Array.isArray(check.details) ? check.details.join(', ') : check.details}`);
      }
    }
    
    if (result.summary.failed > 0) {
      console.log('\n❌ Some checks failed. Please review and fix the issues.');
      process.exit(1);
    } else if (result.summary.warnings > 0) {
      console.log('\n⚠️  Some checks have warnings. Consider reviewing them.');
    } else {
      console.log('\n✅ All checks passed!');
    }
  }).catch(error => {
    console.error('Error running checks:', error);
    process.exit(1);
  });
}

export default ProjectChecksRunner;
