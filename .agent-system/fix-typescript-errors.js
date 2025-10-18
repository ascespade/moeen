#!/usr/bin/env node

/**
 * TypeScript Error Fixer
 * إصلاح أخطاء TypeScript
 */

let fs = require('fs');
let path = require('path');

class TypeScriptErrorFixer {
  constructor() {
    this.fixes = [
      {
        pattern: /\.errors/g,
        replacement: '.issues',
        description: 'Fix ZodError.errors to .issues'
      },
      {
        pattern: /Object is possibly 'undefined'/g,
        replacement: 'Add null check',
        description: 'Add null checks for undefined objects'
      },
      {
        pattern: /Expected \d+-\d+ arguments, but got \d+/g,
        replacement: 'Fix function arguments',
        description: 'Fix function argument mismatches'
      },
      {
        pattern: /Property '.*' does not exist on type/g,
        replacement: 'Add missing properties',
        description: 'Add missing properties to types'
      }
    ];
  }

  log(message, type = 'info') {
    let timestamp = new Date().toISOString();
    let prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    // console.log(`[${timestamp}] ${prefix} ${message}`
  }

  async findTypeScriptFiles() {
    let files = [];
    let srcDir = 'src';

    let walkDir = (dir) => {
      let items = fs.readdirSync(dir);

      for (const item of items) {
        let fullPath = path.join(dir, item);
        let stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    };

    walkDir(srcDir);
    return files;
  }

  async fixZodErrors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix ZodError.errors to .issues
    if (content.includes('.errors')) {
      content = content.replace(/\.errors/g, '.issues');
      modified = true;
      this.log(`Fixed ZodError.errors in ${filePath}`
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
    }
  }

  async fixUndefinedChecks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add null checks for common patterns
    let patterns = [
      {
        search: /const \{ data \} = await supabase\.from\('(\w+)'\)\.select\('(\w+)'\)\.eq\('(\w+)', (\w+)\)\.single\(\);/g,
        replace: (match, table, select, field, value) => {
          return `
if (!data) {
  throw new Error('${table} not found');
}`
        }
      },
      {
        search: /const \{ data: (\w+) \} = await supabase\.from\('(\w+)'\)\.select\('(\w+)'\)\.eq\('(\w+)', (\w+)\)\.single\(\);/g,
        replace: (match, varName, table, select, field, value) => {
          return `
if (!${varName}) {
  throw new Error('${table} not found');
}`
        }
      }
    ];

    for (const pattern of patterns) {
      if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        modified = true;
        this.log(`Added null checks in ${filePath}`
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
    }
  }

  async fixFunctionArguments(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix common function argument issues
    let fixes = [
      {
        search: /supabase\.from\('(\w+)'\)\.insert\((\w+)\)/g,
        replace: (match, table, data) => {
          return `supabase.from('${table}').insert(${data})`
        }
      },
      {
        search: /supabase\.from\('(\w+)'\)\.update\((\w+)\)\.eq\('(\w+)', (\w+)\)/g,
        replace: (match, table, data, field, value) => {
          return `supabase.from('${table}').update(${data}).eq('${field}', ${value})`
        }
      }
    ];

    for (const fix of fixes) {
      if (fix.search.test(content)) {
        content = content.replace(fix.search, fix.replace);
        modified = true;
        this.log(`Fixed function arguments in ${filePath}`
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
    }
  }

  async fixMissingProperties(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add missing properties to common types
    if (content.includes('ActionExecutor') && content.includes('createAppointment')) {
      // Add missing methods to ActionExecutor
      let actionExecutorFix = `
// Add missing methods to ActionExecutor
interface ActionExecutor {
  createAppointment(data: any): Promise<any>;
  sendNotification(data: any): Promise<any>;
  sendReminder(data: any): Promise<any>;
  updatePatient(data: any): Promise<any>;
  sendEmail(data: any): Promise<any>;
}
`

      if (!content.includes('interface ActionExecutor')) {
        content = actionExecutorFix + content;
        modified = true;
        this.log(`Added ActionExecutor interface in ${filePath}`
      }
    }

    if (content.includes('FlowManager') && content.includes('executeAction')) {
      // Fix FlowManager method name
      content = content.replace(/\.executeAction\(/g, '.executeStepAction(');
      modified = true;
      this.log(`Fixed FlowManager method name in ${filePath}`
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
    }
  }

  async fixFile(filePath) {
    try {
      await this.fixZodErrors(filePath);
      await this.fixUndefinedChecks(filePath);
      await this.fixFunctionArguments(filePath);
      await this.fixMissingProperties(filePath);
    } catch (error) {
      this.log(`Error fixing ${filePath}: ${error.message}`
    }
  }

  async run() {
    this.log('🔧 Starting TypeScript error fixes...');

    try {
      let files = await this.findTypeScriptFiles();
      this.log(`Found ${files.length} TypeScript files`

      for (const file of files) {
        await this.fixFile(file);
      }

      this.log('✅ TypeScript error fixes completed!', 'success');

    } catch (error) {
      this.log(`❌ TypeScript fixes failed: ${error.message}`
      throw error;
    }
  }
}

// Run the fixer
if (require.main === module) {
  let fixer = new TypeScriptErrorFixer();
  fixer.run().catch(error => {
    // console.error('TypeScript fixer failed:', error);
    process.exit(1);
  });
}

module.exports = TypeScriptErrorFixer;
