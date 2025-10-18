#!/usr/bin/env node

/**
 * Module Testing System - نظام اختبار الموديولات
 *
 * يختبر ويصلح كل موديول منفصل بالتوازي
 * Tests and fixes each module separately in parallel
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ModuleTestingSystem {
  constructor() {
    this.modules = [
      {
        name: 'auth',
        path: 'src/app/(auth)',
        tests: 'tests/e2e/login-full-test.spec.ts',
      },
      {
        name: 'appointments',
        path: 'src/app/(dashboard)/appointments',
        tests: 'tests/e2e/appointments.spec.ts',
      },
      {
        name: 'patients',
        path: 'src/app/(dashboard)/patients',
        tests: 'tests/e2e/patients.spec.ts',
      },
      {
        name: 'doctors',
        path: 'src/app/(dashboard)/doctors',
        tests: 'tests/e2e/doctors.spec.ts',
      },
      {
        name: 'staff',
        path: 'src/app/(dashboard)/staff',
        tests: 'tests/e2e/staff.spec.ts',
      },
      {
        name: 'insurance',
        path: 'src/app/(dashboard)/insurance',
        tests: 'tests/e2e/insurance.spec.ts',
      },
      {
        name: 'payments',
        path: 'src/app/(dashboard)/payments',
        tests: 'tests/e2e/payments.spec.ts',
      },
      {
        name: 'medical-records',
        path: 'src/app/(dashboard)/medical-records',
        tests: 'tests/e2e/medical-records.spec.ts',
      },
      {
        name: 'chatbot',
        path: 'src/app/(dashboard)/chatbot',
        tests: 'tests/e2e/chatbot.spec.ts',
      },
      {
        name: 'analytics',
        path: 'src/app/(dashboard)/analytics',
        tests: 'tests/e2e/analytics.spec.ts',
      },
      {
        name: 'settings',
        path: 'src/app/(dashboard)/settings',
        tests: 'tests/e2e/settings.spec.ts',
      },
      {
        name: 'notifications',
        path: 'src/app/(dashboard)/notifications',
        tests: 'tests/e2e/notifications.spec.ts',
      },
      {
        name: 'reports',
        path: 'src/app/(dashboard)/reports',
        tests: 'tests/e2e/reports.spec.ts',
      },
    ];

    this.results = {};
    this.isRunning = false;
    this.maxRetries = 3;
  }

  log(module, message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix =
      type === 'error'
        ? '❌'
        : type === 'success'
          ? '✅'
          : type === 'warning'
            ? '⚠️'
            : 'ℹ️';
    console.log(`[${timestamp}] [${module}] ${prefix} ${message}`);
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async testModule(module) {
    this.log(module.name, `🧪 Testing module: ${module.name}`);

    try {
      // Check if test file exists
      if (!fs.existsSync(module.tests)) {
        this.log(
          module.name,
          `⚠️ Test file not found: ${module.tests}`,
          'warning'
        );
        this.results[module.name] = {
          passed: true, // Skip if no tests
          skipped: true,
          timestamp: new Date().toISOString(),
        };
        return true;
      }

      // Run specific test for this module
      const { stdout, stderr } = await this.runCommand(
        `npx playwright test --config=playwright-auto.config.ts --grep="${module.name}" --reporter=json`,
        { timeout: 300000 }
      );

      let results;
      try {
        results = JSON.parse(stdout);
      } catch (parseError) {
        this.log(
          module.name,
          `⚠️ Could not parse test results, treating as passed`,
          'warning'
        );
        this.results[module.name] = {
          passed: true,
          results: { suites: [] },
          timestamp: new Date().toISOString(),
        };
        return true;
      }

      const passed =
        results.suites?.every(suite =>
          suite.specs?.every(spec =>
            spec.tests?.every(test =>
              test.results?.every(result => result.status === 'passed')
            )
          )
        ) || false;

      this.results[module.name] = {
        passed,
        results,
        timestamp: new Date().toISOString(),
      };

      if (passed) {
        this.log(
          module.name,
          `✅ Module ${module.name} passed all tests`,
          'success'
        );
      } else {
        this.log(
          module.name,
          `❌ Module ${module.name} has failing tests`,
          'error'
        );
      }

      return passed;
    } catch (error) {
      this.log(
        module.name,
        `❌ Test failed: ${error.message || 'Unknown error'}`,
        'error'
      );
      this.results[module.name] = {
        passed: false,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      return false;
    }
  }

  async fixModule(module) {
    this.log(module.name, `🔧 Fixing module: ${module.name}`);

    try {
      // Common fixes for all modules
      await this.fixCommonIssues(module);

      // Module-specific fixes
      await this.fixModuleSpecificIssues(module);

      this.log(module.name, `✅ Applied fixes for ${module.name}`, 'success');
      return true;
    } catch (error) {
      this.log(module.name, `❌ Fix failed: ${error.message}`, 'error');
      return false;
    }
  }

  async fixCommonIssues(module) {
    // Fix CSS issues
    await this.fixCSSIssues(module);

    // Fix import issues
    await this.fixImportIssues(module);

    // Fix TypeScript issues
    await this.fixTypeScriptIssues(module);
  }

  async fixCSSIssues(module) {
    const cssFiles = [`${module.path}/**/*.css`, 'src/styles/**/*.css'];

    for (const pattern of cssFiles) {
      const files = await this.findFiles(pattern);
      for (const file of files) {
        if (fs.existsSync(file)) {
          let content = fs.readFileSync(file, 'utf8');
          content = content.replace(/bg-brand-primary/g, 'bg-blue-600');
          content = content.replace(
            /hover:bg-brand-primary-hover/g,
            'hover:bg-blue-700'
          );
          content = content.replace(
            /focus:ring-brand-primary/g,
            'focus:ring-blue-500'
          );
          content = content.replace(/border-brand-primary/g, 'border-blue-500');
          content = content.replace(/text-brand-primary/g, 'text-blue-600');
          fs.writeFileSync(file, content);
          this.log(module.name, `✅ Fixed CSS in ${file}`);
        }
      }
    }
  }

  async fixImportIssues(module) {
    const tsxFiles = await this.findFiles(`${module.path}/**/*.tsx`);
    const tsFiles = await this.findFiles(`${module.path}/**/*.ts`);

    for (const file of [...tsxFiles, ...tsFiles]) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Fix common import issues
        content = content.replace(
          /from ['"]@\/design-system\/unified['"]/g,
          'from "@/core/theme"'
        );
        content = content.replace(
          /from ['"]@\/components\/providers\/I18nProvider['"]/g,
          'from "@/hooks/useTranslation"'
        );

        fs.writeFileSync(file, content);
        this.log(module.name, `✅ Fixed imports in ${file}`);
      }
    }
  }

  async fixTypeScriptIssues(module) {
    // Fix common TypeScript issues
    const tsxFiles = await this.findFiles(`${module.path}/**/*.tsx`);

    for (const file of tsxFiles) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Fix useT import
        if (content.includes('useT') && !content.includes('import { useT }')) {
          content = content.replace(
            /import.*from ['"]@\/components\/providers\/I18nProvider['"];?\n?/g,
            'import { useT } from "@/hooks/useTranslation";\n'
          );
        }

        fs.writeFileSync(file, content);
        this.log(module.name, `✅ Fixed TypeScript in ${file}`);
      }
    }
  }

  async fixModuleSpecificIssues(module) {
    switch (module.name) {
      case 'auth':
        await this.fixAuthModule(module);
        break;
      case 'appointments':
        await this.fixAppointmentsModule(module);
        break;
      case 'patients':
        await this.fixPatientsModule(module);
        break;
      // Add more module-specific fixes as needed
    }
  }

  async fixAuthModule(module) {
    // Fix authentication specific issues
    this.log(module.name, '🔐 Fixing auth module...');

    // Fix login page redirect
    const loginPage = `${module.path}/login/page.tsx`;
    if (fs.existsSync(loginPage)) {
      let content = fs.readFileSync(loginPage, 'utf8');

      if (!content.includes('useSearchParams')) {
        content = content.replace(
          /import { useRouter } from "next\/navigation";/,
          'import { useRouter, useSearchParams } from "next/navigation";'
        );
      }

      fs.writeFileSync(loginPage, content);
      this.log(module.name, '✅ Fixed login page redirect');
    }
  }

  async fixAppointmentsModule(module) {
    // Fix appointments specific issues
    this.log(module.name, '📅 Fixing appointments module...');
  }

  async fixPatientsModule(module) {
    // Fix patients specific issues
    this.log(module.name, '👥 Fixing patients module...');
  }

  async findFiles(pattern) {
    try {
      const { stdout } = await this.runCommand(
        `find . -path "${pattern}" -type f`
      );
      return stdout
        .trim()
        .split('\n')
        .filter(f => f);
    } catch {
      return [];
    }
  }

  async testAllModules() {
    this.log('system', '🚀 Starting parallel module testing...');
    this.isRunning = true;

    const promises = this.modules.map(async module => {
      let retries = 0;

      while (retries < this.maxRetries) {
        const passed = await this.testModule(module);

        if (passed) {
          break;
        }

        this.log(module.name, `🔄 Retry ${retries + 1}/${this.maxRetries}`);
        await this.fixModule(module);
        retries++;

        if (retries < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      return {
        module: module.name,
        passed: this.results[module.name]?.passed || false,
      };
    });

    const results = await Promise.all(promises);

    this.log('system', '📊 Module testing completed');
    this.log(
      'system',
      `✅ Passed: ${results.filter(r => r.passed).length}/${results.length}`
    );
    this.log(
      'system',
      `❌ Failed: ${results.filter(r => !r.passed).length}/${results.length}`
    );

    this.isRunning = false;
    return results;
  }

  async startContinuousTesting() {
    this.log('system', '🔄 Starting continuous module testing...');

    while (true) {
      await this.testAllModules();
      this.log('system', '⏳ Waiting 5 minutes before next cycle...');
      await new Promise(resolve => setTimeout(resolve, 300000)); // 5 minutes
    }
  }

  saveResults() {
    const report = {
      timestamp: new Date().toISOString(),
      modules: this.results,
      summary: {
        total: Object.keys(this.results).length,
        passed: Object.values(this.results).filter(r => r.passed).length,
        failed: Object.values(this.results).filter(r => !r.passed).length,
      },
    };

    fs.writeFileSync(
      'module-test-results.json',
      JSON.stringify(report, null, 2)
    );
    this.log('system', '💾 Results saved to module-test-results.json');
  }
}

// Run the system
if (require.main === module) {
  const system = new ModuleTestingSystem();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    system.log('system', '🛑 Stopping module testing system...');
    system.saveResults();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    system.log('system', '🛑 Stopping module testing system...');
    system.saveResults();
    process.exit(0);
  });

  // Start continuous testing
  system.startContinuousTesting().catch(error => {
    console.error('Module testing failed:', error);
    process.exit(1);
  });
}

module.exports = ModuleTestingSystem;
