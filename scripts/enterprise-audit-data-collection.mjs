#!/usr/bin/env node
/**
 * Enterprise Audit - Automated Data Collection System
 * نظام جمع البيانات الآلية للتقرير الشامل
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = join(__dirname, '..');

const REPORT_DIR = join(workspaceRoot, 'reports', 'enterprise-audit');
const REPORT_FILE = join(REPORT_DIR, 'data-collection-report.json');

// Ensure reports directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(REPORT_DIR, { recursive: true });
} catch (e) {
  // Directory already exists
}

class DataCollector {
  constructor() {
    this.data = {
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
      },
      results: {},
      errors: [],
      summary: {},
    };
  }

  runCommand(command, description, captureJson = false) {
    console.log(`\n🔍 ${description}...`);
    try {
      const output = execSync(command, {
        cwd: workspaceRoot,
        encoding: 'utf-8',
        stdio: captureJson ? ['ignore', 'pipe', 'pipe'] : 'pipe',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });
      
      if (captureJson) {
        try {
          return JSON.parse(output);
        } catch (e) {
          return { raw: output, parseError: e.message };
        }
      }
      return { output, success: true };
    } catch (error) {
      const errorData = {
        message: error.message,
        stdout: error.stdout?.toString(),
        stderr: error.stderr?.toString(),
        status: error.status,
      };
      this.data.errors.push({
        command,
        description,
        error: errorData,
      });
      console.error(`❌ Error: ${description}`);
      return { error: errorData, success: false };
    }
  }

  collectEslintData() {
    console.log('\n📋 Collecting ESLint data...');
    
    // ESLint check
    const eslintResult = this.runCommand(
      'npm run lint:check',
      'Running ESLint check',
      false
    );
    
    // ESLint with JSON output (if possible)
    let eslintJson = null;
    try {
      const eslintJsonOutput = execSync(
        'npx eslint . --format json --max-warnings 0 || true',
        { cwd: workspaceRoot, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      try {
        eslintJson = JSON.parse(eslintJsonOutput);
      } catch (e) {
        // If JSON parsing fails, try to extract summary
        eslintJson = { raw: eslintJsonOutput };
      }
    } catch (e) {
      eslintJson = { error: e.message };
    }

    // Count issues
    let errorCount = 0;
    let warningCount = 0;
    let fileCount = 0;
    
    if (eslintJson && Array.isArray(eslintJson)) {
      eslintJson.forEach(file => {
        if (file.messages && file.messages.length > 0) {
          fileCount++;
          file.messages.forEach(msg => {
            if (msg.severity === 2) errorCount++;
            else if (msg.severity === 1) warningCount++;
          });
        }
      });
    }

    this.data.results.eslint = {
      check: eslintResult,
      json: eslintJson,
      summary: {
        errorCount,
        warningCount,
        fileCount,
        totalIssues: errorCount + warningCount,
      },
    };

    return this.data.results.eslint;
  }

  collectTypeScriptData() {
    console.log('\n📋 Collecting TypeScript data...');
    
    const tsResult = this.runCommand(
      'npm run type:check',
      'Running TypeScript type check',
      false
    );

    // Extract error count from output
    let errorCount = 0;
    let warningCount = 0;
    
    if (tsResult.output) {
      const output = tsResult.output;
      const errorMatches = output.match(/(\d+)\s+error/i);
      const warningMatches = output.match(/(\d+)\s+warning/i);
      
      if (errorMatches) errorCount = parseInt(errorMatches[1], 10);
      if (warningMatches) warningCount = parseInt(warningMatches[1], 10);
    }

    // Count TypeScript files
    const tsFilesResult = this.runCommand(
      'find src -name "*.ts" -o -name "*.tsx" | wc -l',
      'Counting TypeScript files',
      false
    );
    const tsFileCount = parseInt(tsFilesResult.output?.trim() || '0', 10);

    this.data.results.typescript = {
      check: tsResult,
      summary: {
        errorCount,
        warningCount,
        fileCount: tsFileCount,
        hasErrors: errorCount > 0,
      },
    };

    return this.data.results.typescript;
  }

  collectSecurityData() {
    console.log('\n🔒 Collecting security audit data...');
    
    // npm audit
    const auditResult = this.runCommand(
      'npm audit --json',
      'Running npm audit',
      true
    );

    // Extract vulnerability summary
    const vulnerabilities = auditResult?.vulnerabilities || {};
    const metadata = auditResult?.metadata || {};
    const vulnSummary = metadata.vulnerabilities || {};

    this.data.results.security = {
      audit: auditResult,
      summary: {
        total: vulnSummary.total || 0,
        critical: vulnSummary.critical || 0,
        high: vulnSummary.high || 0,
        moderate: vulnSummary.moderate || 0,
        low: vulnSummary.low || 0,
        info: vulnSummary.info || 0,
        vulnerabilities: Object.keys(vulnerabilities).length,
      },
    };

    // npm audit fix (dry run)
    try {
      const auditFixResult = execSync(
        'npm audit fix --dry-run --json || true',
        { cwd: workspaceRoot, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      try {
        this.data.results.security.fixPreview = JSON.parse(auditFixResult);
      } catch (e) {
        this.data.results.security.fixPreview = { raw: auditFixResult };
      }
    } catch (e) {
      this.data.results.security.fixPreview = { error: e.message };
    }

    return this.data.results.security;
  }

  collectDependencyData() {
    console.log('\n📦 Collecting dependency analysis...');
    
    const packageJson = JSON.parse(
      readFileSync(join(workspaceRoot, 'package.json'), 'utf-8')
    );

    const dependencies = {
      production: Object.keys(packageJson.dependencies || {}).length,
      development: Object.keys(packageJson.devDependencies || {}).length,
      total: 0,
    };
    dependencies.total = dependencies.production + dependencies.development;

    // Analyze dependency versions
    const depVersions = {
      production: packageJson.dependencies || {},
      development: packageJson.devDependencies || {},
    };

    // Check for outdated packages (npm outdated)
    let outdatedPackages = null;
    try {
      const outdatedResult = execSync(
        'npm outdated --json || true',
        { cwd: workspaceRoot, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      try {
        outdatedPackages = JSON.parse(outdatedResult);
      } catch (e) {
        outdatedPackages = { parseError: e.message };
      }
    } catch (e) {
      outdatedPackages = { error: e.message };
    }

    // Check for deprecated packages
    let deprecatedPackages = [];
    try {
      const deprecateResult = execSync(
        'npm ls --depth=0 --json || true',
        { cwd: workspaceRoot, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      const depData = JSON.parse(deprecateResult);
      
      // Recursively search for deprecated packages
      const findDeprecated = (deps, path = '') => {
        if (!deps) return;
        Object.entries(deps).forEach(([name, data]) => {
          if (data.deprecated) {
            deprecatedPackages.push({
              name,
              path,
              reason: data.deprecated,
            });
          }
          if (data.dependencies) {
            findDeprecated(data.dependencies, path ? `${path} > ${name}` : name);
          }
        });
      };
      findDeprecated(depData.dependencies);
    } catch (e) {
      // Ignore errors
    }

    // Check package sizes
    let packageSizes = null;
    try {
      const sizeResult = execSync(
        'du -sh node_modules 2>/dev/null | cut -f1 || echo "unknown"',
        { cwd: workspaceRoot, encoding: 'utf-8' }
      );
      packageSizes = { nodeModulesSize: sizeResult.trim() };
    } catch (e) {
      packageSizes = { error: e.message };
    }

    this.data.results.dependencies = {
      count: dependencies,
      versions: depVersions,
      outdated: outdatedPackages,
      deprecated: deprecatedPackages,
      sizes: packageSizes,
      summary: {
        totalPackages: dependencies.total,
        outdatedCount: outdatedPackages && typeof outdatedPackages === 'object' 
          ? Object.keys(outdatedPackages).length 
          : 0,
        deprecatedCount: deprecatedPackages.length,
      },
    };

    return this.data.results.dependencies;
  }

  collectCodeMetrics() {
    console.log('\n📊 Collecting code metrics...');
    
    const metrics = {};

    // Count files by type
    const fileTypes = ['ts', 'tsx', 'js', 'jsx', 'css', 'json'];
    fileTypes.forEach(ext => {
      try {
        const result = execSync(
          `find src -name "*.${ext}" 2>/dev/null | wc -l || echo "0"`,
          { cwd: workspaceRoot, encoding: 'utf-8' }
        );
        metrics[`${ext}Files`] = parseInt(result.trim(), 10);
      } catch (e) {
        metrics[`${ext}Files`] = 0;
      }
    });

    // Count lines of code (if available)
    try {
      const locResult = execSync(
        'find src -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | tail -1 || echo "0 total"',
        { cwd: workspaceRoot, encoding: 'utf-8' }
      );
      const locMatch = locResult.match(/(\d+)\s+total/);
      metrics.totalLines = locMatch ? parseInt(locMatch[1], 10) : 0;
    } catch (e) {
      metrics.totalLines = 0;
    }

    // Count components
    try {
      const componentResult = execSync(
        'find src -name "*.tsx" | wc -l',
        { cwd: workspaceRoot, encoding: 'utf-8' }
      );
      metrics.componentFiles = parseInt(componentResult.trim(), 10);
    } catch (e) {
      metrics.componentFiles = 0;
    }

    // Count API routes (if Next.js app directory structure)
    try {
      const apiRoutesResult = execSync(
        'find src/app -name "route.ts" -o -name "route.tsx" 2>/dev/null | wc -l || echo "0"',
        { cwd: workspaceRoot, encoding: 'utf-8' }
      );
      metrics.apiRoutes = parseInt(apiRoutesResult.trim(), 10);
    } catch (e) {
      metrics.apiRoutes = 0;
    }

    this.data.results.codeMetrics = metrics;
    return metrics;
  }

  collectBuildData() {
    console.log('\n🏗️ Collecting build information...');
    
    const buildInfo = {};

    // Check if build directory exists
    buildInfo.buildExists = existsSync(join(workspaceRoot, '.next'));

    // Read next.config.js if exists
    if (existsSync(join(workspaceRoot, 'next.config.js'))) {
      try {
        const configContent = readFileSync(
          join(workspaceRoot, 'next.config.js'),
          'utf-8'
        );
        buildInfo.hasNextConfig = true;
        // Extract some key settings (basic parsing)
        buildInfo.nextConfig = {
          hasConfig: configContent.length > 0,
          size: configContent.length,
        };
      } catch (e) {
        buildInfo.nextConfigError = e.message;
      }
    }

    // Check TypeScript config
    buildInfo.tsConfigExists = existsSync(join(workspaceRoot, 'tsconfig.json'));

    this.data.results.build = buildInfo;
    return buildInfo;
  }

  generateSummary() {
    console.log('\n📈 Generating summary...');
    
    const summary = {
      timestamp: this.data.timestamp,
      status: 'completed',
      errors: this.data.errors.length,
    };

    // ESLint summary
    if (this.data.results.eslint) {
      summary.eslint = {
        status: this.data.results.eslint.summary.errorCount === 0 ? 'pass' : 'fail',
        errors: this.data.results.eslint.summary.errorCount,
        warnings: this.data.results.eslint.summary.warningCount,
      };
    }

    // TypeScript summary
    if (this.data.results.typescript) {
      summary.typescript = {
        status: this.data.results.typescript.summary.errorCount === 0 ? 'pass' : 'fail',
        errors: this.data.results.typescript.summary.errorCount,
        warnings: this.data.results.typescript.summary.warningCount,
      };
    }

    // Security summary
    if (this.data.results.security) {
      summary.security = {
        status: this.data.results.security.summary.total === 0 ? 'pass' : 'warning',
        vulnerabilities: this.data.results.security.summary.total,
        critical: this.data.results.security.summary.critical,
        high: this.data.results.security.summary.high,
        moderate: this.data.results.security.summary.moderate,
      };
    }

    // Dependencies summary
    if (this.data.results.dependencies) {
      summary.dependencies = {
        total: this.data.results.dependencies.count.total,
        outdated: this.data.results.dependencies.summary.outdatedCount,
        deprecated: this.data.results.dependencies.summary.deprecatedCount,
      };
    }

    // Overall health score
    let healthScore = 100;
    if (summary.eslint?.errors > 0) healthScore -= 10;
    if (summary.typescript?.errors > 0) healthScore -= 15;
    if (summary.security?.critical > 0) healthScore -= 20;
    if (summary.security?.high > 0) healthScore -= 10;
    if (summary.security?.moderate > 0) healthScore -= 5;
    if (summary.dependencies?.outdated > 10) healthScore -= 5;
    
    summary.healthScore = Math.max(0, healthScore);
    summary.healthStatus = 
      healthScore >= 90 ? 'excellent' :
      healthScore >= 75 ? 'good' :
      healthScore >= 60 ? 'fair' :
      'needs_attention';

    this.data.summary = summary;
    return summary;
  }

  async collectAll() {
    console.log('🚀 Starting Enterprise Audit Data Collection...');
    console.log(`📁 Workspace: ${workspaceRoot}`);
    console.log(`📄 Report will be saved to: ${REPORT_FILE}`);

    // Collect all data
    this.collectEslintData();
    this.collectTypeScriptData();
    this.collectSecurityData();
    this.collectDependencyData();
    this.collectCodeMetrics();
    this.collectBuildData();

    // Generate summary
    this.generateSummary();

    // Save report
    writeFileSync(
      REPORT_FILE,
      JSON.stringify(this.data, null, 2),
      'utf-8'
    );

    console.log(`\n✅ Data collection complete!`);
    console.log(`📄 Report saved to: ${REPORT_FILE}`);
    console.log(`\n📊 Summary:`);
    console.log(JSON.stringify(this.data.summary, null, 2));

    return this.data;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const collector = new DataCollector();
  collector.collectAll().catch(console.error);
}

export default DataCollector;
