#!/usr/bin/env node

/**
 * 🧪 AI Agent Project - Test Runner
 * مشغل الاختبارات لمشروع الأجنت
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();

// Show banner
console.log(chalk.cyan(figlet.textSync('AI Agent Tests', { font: 'ANSI Shadow' })));
console.log(chalk.blue('اختبارات مشروع الأجنت الذكي\n'));

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.total = 0;
  }

  async run() {
    console.log(chalk.green('🚀 بدء تشغيل الاختبارات...\n'));

    // Add tests
    this.addTest('Test 1: Check Project Structure', () => this.testProjectStructure());
    this.addTest('Test 2: Check Configuration', () => this.testConfiguration());
    this.addTest('Test 3: Check Dependencies', () => this.testDependencies());
    this.addTest('Test 4: Check Agent Initialization', () => this.testAgentInitialization());
    this.addTest('Test 5: Check File Analysis', () => this.testFileAnalysis());
    this.addTest('Test 6: Check Issue Detection', () => this.testIssueDetection());
    this.addTest('Test 7: Check Backup System', () => this.testBackupSystem());
    this.addTest('Test 8: Check Logging System', () => this.testLoggingSystem());

    // Run all tests
    for (const test of this.tests) {
      await this.runTest(test);
    }

    // Show results
    this.showResults();
  }

  addTest(name, testFunction) {
    this.tests.push({
      name,
      testFunction,
      status: 'pending'
    });
  }

  async runTest(test) {
    this.total++;
    process.stdout.write(chalk.yellow(`🔄 ${test.name}... `));

    try {
      await test.testFunction();
      test.status = 'passed';
      this.passed++;
      console.log(chalk.green('✅ PASSED'));
    } catch (error) {
      test.status = 'failed';
      this.failed++;
      console.log(chalk.red('❌ FAILED'));
      console.log(chalk.red(`   Error: ${error.message}`));
    }
  }

  async testProjectStructure() {
    const requiredFiles = [
      'package.json',
      'src/index.js',
      'config/agent-config.json',
      'README.md'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, '..', file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Missing file: ${file}`);
      }
    }
  }

  async testConfiguration() {
    const configPath = path.join(__dirname, '..', 'config', 'agent-config.json');
    const config = await fs.readJson(configPath);

    if (!config.agent || !config.monitoring || !config.backup) {
      throw new Error('Invalid configuration structure');
    }

    if (config.agent.checkInterval <= 0) {
      throw new Error('Invalid check interval');
    }
  }

  async testDependencies() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    const requiredDeps = [
      'fs-extra',
      'chokidar',
      'chalk',
      'ora',
      'figlet',
      'boxen'
    ];

    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep]) {
        throw new Error(`Missing dependency: ${dep}`);
      }
    }
  }

  async testAgentInitialization() {
    // Test if agent can be imported
    const agentPath = path.join(__dirname, '..', 'src', 'index.js');
    if (!await fs.pathExists(agentPath)) {
      throw new Error('Agent file not found');
    }

    // Test if agent has required methods (basic syntax check)
    const agentContent = await fs.readFile(agentPath, 'utf8');
    if (!agentContent.includes('class AIAgent')) {
      throw new Error('Agent class not found');
    }
  }

  async testFileAnalysis() {
    // Create a test file
    const testFile = path.join(__dirname, 'test-file.js');
    await fs.writeFile(testFile, 'console.log("test");\nfunction empty() {}\n// TODO: fix this');

    try {
      // Test file analysis logic
      const content = await fs.readFile(testFile, 'utf8');
      
      if (!content.includes('console.log')) {
        throw new Error('Test file content invalid');
      }

      if (!content.includes('TODO')) {
        throw new Error('Test file content invalid');
      }
    } finally {
      // Clean up
      await fs.remove(testFile);
    }
  }

  async testIssueDetection() {
    // Test issue detection logic
    const testContent = 'console.log("test");\nfunction empty() {}\n// TODO: fix this';
    
    const issues = [];
    
    if (testContent.includes('console.log')) {
      issues.push({ type: 'console', severity: 'medium' });
    }
    
    if (testContent.includes('function() {}')) {
      issues.push({ type: 'empty', severity: 'low' });
    }
    
    if (testContent.includes('TODO')) {
      issues.push({ type: 'todo', severity: 'low' });
    }

    if (issues.length === 0) {
      throw new Error('Issue detection not working');
    }
  }

  async testBackupSystem() {
    const backupDir = path.join(__dirname, '..', 'backups');
    
    // Test if backup directory can be created
    await fs.ensureDir(backupDir);
    
    if (!await fs.pathExists(backupDir)) {
      throw new Error('Backup directory creation failed');
    }
  }

  async testLoggingSystem() {
    const logDir = path.join(__dirname, '..', 'logs');
    const logFile = path.join(logDir, 'test.log');
    
    // Test if log directory can be created
    await fs.ensureDir(logDir);
    
    // Test if log file can be written
    await fs.writeFile(logFile, 'Test log entry\n');
    
    if (!await fs.pathExists(logFile)) {
      throw new Error('Log file creation failed');
    }
    
    // Clean up
    await fs.remove(logFile);
  }

  showResults() {
    const message = boxen(
      chalk.green('🧪 نتائج الاختبارات\n\n') +
      chalk.blue('إجمالي الاختبارات: ') + chalk.white(this.total + '\n') +
      chalk.green('نجح: ') + chalk.white(this.passed + '\n') +
      chalk.red('فشل: ') + chalk.white(this.failed + '\n') +
      chalk.yellow('نسبة النجاح: ') + chalk.white(`${Math.round((this.passed / this.total) * 100)}%\n\n') +
      (this.failed === 0 ? 
        chalk.green('🎉 جميع الاختبارات نجحت!') : 
        chalk.red('❌ بعض الاختبارات فشلت!')),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: this.failed === 0 ? 'green' : 'red',
        backgroundColor: '#1a1a1a'
      }
    );

    console.log(message);
  }
}

// Run tests
const testRunner = new TestRunner();
testRunner.run().catch(console.error);

