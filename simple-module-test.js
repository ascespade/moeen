#!/usr/bin/env node

/**
 * Simple Module Testing System
 * نظام اختبار الموديولات المبسط
 */

const { exec } = require('child_process');
const fs = require('fs');

class SimpleModuleTest {
  constructor() {
    this.modules = [
      { name: 'auth', path: 'src/app/(auth)' },
      { name: 'dashboard', path: 'src/app/dashboard' },
      { name: 'admin', path: 'src/app/(admin)' },
      { name: 'doctor', path: 'src/app/(doctor)' },
      { name: 'staff', path: 'src/app/(staff)' },
      { name: 'supervisor', path: 'src/app/(supervisor)' },
      { name: 'patient', path: 'src/app/(patient)' },
      { name: 'api', path: 'src/app/api' },
      { name: 'components', path: 'src/components' },
      { name: 'hooks', path: 'src/hooks' },
      { name: 'lib', path: 'src/lib' },
      { name: 'styles', path: 'src/styles' },
      { name: 'context', path: 'src/context' }
    ];
    
    this.results = {};
  }

  log(module, message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] [${module}] ${prefix} ${message}`);
  }

  async runCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async checkModule(module) {
    this.log(module.name, `🔍 Checking module: ${module.name}`);
    
    try {
      // Check if module directory exists
      if (!fs.existsSync(module.path)) {
        this.log(module.name, `⚠️ Module directory not found: ${module.path}`, 'warning');
        this.results[module.name] = {
          status: 'missing',
          message: 'Directory not found',
          timestamp: new Date().toISOString()
        };
        return false;
      }

      // Check for common files
      const commonFiles = ['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx'];
      const foundFiles = commonFiles.filter(file => 
        fs.existsSync(`${module.path}/${file}`)
      );

      // Check for TypeScript errors
      let hasErrors = false;
      try {
        await this.runCommand(`npx tsc --noEmit --skipLibCheck ${module.path}/**/*.tsx ${module.path}/**/*.ts`);
      } catch (error) {
        hasErrors = true;
        this.log(module.name, `⚠️ TypeScript errors found`, 'warning');
      }

      // Check for CSS issues
      let cssIssues = 0;
      const cssFiles = await this.findFiles(`${module.path}/**/*.css`);
      for (const file of cssFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('bg-brand-primary')) {
            cssIssues++;
          }
        }
      }

      const status = hasErrors || cssIssues > 0 ? 'issues' : 'ok';
      
      this.results[module.name] = {
        status,
        foundFiles: foundFiles.length,
        totalFiles: commonFiles.length,
        hasErrors,
        cssIssues,
        timestamp: new Date().toISOString()
      };

      if (status === 'ok') {
        this.log(module.name, `✅ Module ${module.name} is healthy`, 'success');
      } else {
        this.log(module.name, `⚠️ Module ${module.name} has issues`, 'warning');
      }

      return status === 'ok';

    } catch (error) {
      this.log(module.name, `❌ Check failed: ${error.message}`, 'error');
      this.results[module.name] = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      return false;
    }
  }

  async findFiles(pattern) {
    try {
      const { stdout } = await this.runCommand(`find . -path "${pattern}" -type f 2>/dev/null`);
      return stdout.trim().split('\n').filter(f => f);
    } catch {
      return [];
    }
  }

  async fixModule(module) {
    this.log(module.name, `🔧 Fixing module: ${module.name}`);
    
    try {
      // Fix CSS issues
      const cssFiles = await this.findFiles(`${module.path}/**/*.css`);
      for (const file of cssFiles) {
        if (fs.existsSync(file)) {
          let content = fs.readFileSync(file, 'utf8');
          content = content.replace(/bg-brand-primary/g, 'bg-blue-600');
          content = content.replace(/hover:bg-brand-primary-hover/g, 'hover:bg-blue-700');
          content = content.replace(/focus:ring-brand-primary/g, 'focus:ring-blue-500');
          content = content.replace(/border-brand-primary/g, 'border-blue-500');
          content = content.replace(/text-brand-primary/g, 'text-blue-600');
          fs.writeFileSync(file, content);
          this.log(module.name, `✅ Fixed CSS in ${file}`);
        }
      }

      // Fix TypeScript issues
      const tsxFiles = await this.findFiles(`${module.path}/**/*.tsx`);
      for (const file of tsxFiles) {
        if (fs.existsSync(file)) {
          let content = fs.readFileSync(file, 'utf8');
          
          // Fix common import issues
          content = content.replace(/from ['"]@\/design-system\/unified['"]/g, 'from "@/core/theme"');
          content = content.replace(/from ['"]@\/components\/providers\/I18nProvider['"]/g, 'from "@/hooks/useTranslation"');
          
          fs.writeFileSync(file, content);
          this.log(module.name, `✅ Fixed imports in ${file}`);
        }
      }

      this.log(module.name, `✅ Applied fixes for ${module.name}`, 'success');
      return true;
      
    } catch (error) {
      this.log(module.name, `❌ Fix failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testAllModules() {
    this.log('system', '🚀 Starting module health check...');
    
    const results = [];
    
    for (const module of this.modules) {
      const isHealthy = await this.checkModule(module);
      
      if (!isHealthy && this.results[module.name].status !== 'missing') {
        await this.fixModule(module);
        // Re-check after fixing
        await this.checkModule(module);
      }
      
      results.push({
        module: module.name,
        healthy: this.results[module.name].status === 'ok',
        status: this.results[module.name].status
      });
    }
    
    this.log('system', '📊 Module health check completed');
    this.log('system', `✅ Healthy: ${results.filter(r => r.healthy).length}/${results.length}`);
    this.log('system', `⚠️ Issues: ${results.filter(r => !r.healthy).length}/${results.length}`);
    
    return results;
  }

  saveResults() {
    const report = {
      timestamp: new Date().toISOString(),
      modules: this.results,
      summary: {
        total: Object.keys(this.results).length,
        healthy: Object.values(this.results).filter(r => r.status === 'ok').length,
        issues: Object.values(this.results).filter(r => r.status === 'issues').length,
        missing: Object.values(this.results).filter(r => r.status === 'missing').length,
        errors: Object.values(this.results).filter(r => r.status === 'error').length
      }
    };
    
    fs.writeFileSync('module-health-report.json', JSON.stringify(report, null, 2));
    this.log('system', '💾 Health report saved to module-health-report.json');
  }
}

// Run the system
if (require.main === module) {
  const system = new SimpleModuleTest();
  
  system.testAllModules().then(() => {
    system.saveResults();
    process.exit(0);
  }).catch(error => {
    console.error('Module testing failed:', error);
    process.exit(1);
  });
}

module.exports = SimpleModuleTest;
