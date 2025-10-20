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
 * Format and Lint Manager
 * Handles code formatting and linting operations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FormatAndLintManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.operations = [];
    this.dryRun = true;
    this.config = {
      prettier: this.detectPrettierConfig(),
      eslint: this.detectESLintConfig(),
      typescript: this.detectTypeScriptConfig()
    };
  }

  async formatAndLint(options = {}) {
    const {
      dryRun = true,
      fix = true,
      format = true,
      lint = true
    } = options;

    this.dryRun = dryRun;
    
    console.log(`🎨 Formatting and linting code (${dryRun ? 'DRY RUN' : 'APPLYING CHANGES'})...`);
    
    if (format) {
      await this.runPrettier(fix);
    }
    
    if (lint) {
      await this.runESLint(fix);
    }
    
    await this.runTypeScriptCheck();
    
    return {
      operations: this.operations,
      summary: this.getSummary()
    };
  }

  detectPrettierConfig() {
    const configFiles = [
      '.prettierrc',
      '.prettierrc.js',
      '.prettierrc.json',
      '.prettierrc.yaml',
      '.prettierrc.yml',
      'prettier.config.js'
    ];
    
    for (const configFile of configFiles) {
      const configPath = path.join(this.projectRoot, configFile);
      if (fs.existsSync(configPath)) {
        return {
          found: true,
          configFile,
          configPath
        };
      }
    }
    
    return { found: false };
  }

  detectESLintConfig() {
    const configFiles = [
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yaml',
      '.eslintrc.yml',
      'eslint.config.js'
    ];
    
    for (const configFile of configFiles) {
      const configPath = path.join(this.projectRoot, configFile);
      if (fs.existsSync(configPath)) {
        return {
          found: true,
          configFile,
          configPath
        };
      }
    }
    
    return { found: false };
  }

  detectTypeScriptConfig() {
    const configPath = path.join(this.projectRoot, 'tsconfig.json');
    
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return {
          found: true,
          configPath,
          config
        };
      } catch (error) {
        console.warn('Warning: Could not parse tsconfig.json:', error.message);
      }
    }
    
    return { found: false };
  }

  async runPrettier(fix) {
    console.log('  🎨 Running Prettier...');
    
    if (!this.config.prettier.found) {
      console.log('    ⚠️  Prettier config not found, skipping');
      return;
    }
    
    try {
      const command = fix ? 'prettier --write' : 'prettier --check';
      const files = 'src/**/*.{ts,tsx,js,jsx,json,css,md} app/**/*.{ts,tsx,js,jsx,json,css,md}';
      
      if (this.dryRun) {
        console.log(`    📝 Would run: ${command} ${files}`);
        this.operations.push({
          type: 'prettier',
          command: `${command} ${files}`,
          timestamp: new Date().toISOString()
        });
      } else {
        const output = execSync(`${command} ${files}`, {
          cwd: this.projectRoot,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        console.log('    ✅ Prettier completed');
        this.operations.push({
          type: 'prettier',
          command: `${command} ${files}`,
          output: output,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      if (error.status === 1 && !fix) {
        console.log('    ⚠️  Prettier found formatting issues (expected in check mode)');
      } else {
        console.error('    ❌ Prettier failed:', error.message);
      }
    }
  }

  async runESLint(fix) {
    console.log('  🔍 Running ESLint...');
    
    if (!this.config.eslint.found) {
      console.log('    ⚠️  ESLint config not found, skipping');
      return;
    }
    
    try {
      const command = fix ? 'eslint --fix' : 'eslint';
      const files = 'src/**/*.{ts,tsx,js,jsx} app/**/*.{ts,tsx,js,jsx}';
      
      if (this.dryRun) {
        console.log(`    📝 Would run: ${command} ${files}`);
        this.operations.push({
          type: 'eslint',
          command: `${command} ${files}`,
          timestamp: new Date().toISOString()
        });
      } else {
        const output = execSync(`${command} ${files}`, {
          cwd: this.projectRoot,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        console.log('    ✅ ESLint completed');
        this.operations.push({
          type: 'eslint',
          command: `${command} ${files}`,
          output: output,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      if (error.status === 1 && !fix) {
        console.log('    ⚠️  ESLint found linting issues (expected in check mode)');
      } else {
        console.error('    ❌ ESLint failed:', error.message);
      }
    }
  }

  async runTypeScriptCheck() {
    console.log('  📝 Running TypeScript check...');
    
    if (!this.config.typescript.found) {
      console.log('    ⚠️  TypeScript config not found, skipping');
      return;
    }
    
    try {
      const command = 'tsc --noEmit';
      
      if (this.dryRun) {
        console.log(`    📝 Would run: ${command}`);
        this.operations.push({
          type: 'typescript',
          command: command,
          timestamp: new Date().toISOString()
        });
      } else {
        const output = execSync(command, {
          cwd: this.projectRoot,
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        console.log('    ✅ TypeScript check completed');
        this.operations.push({
          type: 'typescript',
          command: command,
          output: output,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('    ❌ TypeScript check failed:', error.message);
    }
  }

  async fixImportOrder() {
    console.log('  📦 Fixing import order...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        await this.fixFileImportOrder(file);
      }
    }
  }

  async fixFileImportOrder(file) {
    try {
      const filePath = path.join(this.projectRoot, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Extract imports
      const imports = this.extractImports(content);
      
      if (imports.length > 0) {
        // Sort imports
        const sortedImports = this.sortImports(imports);
        
        // Check if sorting changed anything
        if (JSON.stringify(imports) !== JSON.stringify(sortedImports)) {
          // Replace imports in content
          const newContent = this.replaceImports(content, sortedImports);
          
          if (this.dryRun) {
            console.log(`    📝 Would fix import order in: ${file}`);
          } else {
            fs.writeFileSync(filePath, newContent);
            console.log(`    ✅ Fixed import order in: ${file}`);
            modified = true;
          }
        }
      }
      
      if (modified) {
        this.operations.push({
          type: 'import_order',
          file: file,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn(`    ⚠️  Could not fix import order in ${file}:`, error.message);
    }
  }

  extractImports(content) {
    const imports = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('import ') || line.startsWith('import{') || line.startsWith('import(')) {
        imports.push({
          line: i,
          content: line,
          type: this.getImportType(line)
        });
      } else if (line.startsWith('from ') || line.startsWith('} from ')) {
        // This is a continuation of the previous import
        if (imports.length > 0) {
          imports[imports.length - 1].content += ' ' + line;
        }
      }
    }
    
    return imports;
  }

  getImportType(importLine) {
    if (importLine.includes('from \'react\'') || importLine.includes('from "react"')) {
      return 'react';
    } else if (importLine.includes('from \'next/') || importLine.includes('from "next/')) {
      return 'next';
    } else if (importLine.includes('from \'@/') || importLine.includes('from "@/')) {
      return 'alias';
    } else if (importLine.includes('from \'./') || importLine.includes('from "../')) {
      return 'relative';
    } else {
      return 'external';
    }
  }

  sortImports(imports) {
    const typeOrder = ['react', 'next', 'external', 'alias', 'relative'];
    
    return imports.sort((a, b) => {
      const aTypeIndex = typeOrder.indexOf(a.type);
      const bTypeIndex = typeOrder.indexOf(b.type);
      
      if (aTypeIndex !== bTypeIndex) {
        return aTypeIndex - bTypeIndex;
      }
      
      // Within the same type, sort alphabetically
      return a.content.localeCompare(b.content);
    });
  }

  replaceImports(content, sortedImports) {
    const lines = content.split('\n');
    let newLines = [...lines];
    
    // Remove old imports
    for (const importInfo of sortedImports) {
      newLines[importInfo.line] = '';
    }
    
    // Add sorted imports at the beginning
    const importLines = sortedImports.map(imp => imp.content);
    newLines = [...importLines, ...newLines.filter(line => line !== '')];
    
    return newLines.join('\n');
  }

  async addMissingImports() {
    console.log('  ➕ Adding missing imports...');
    
    // This would require more sophisticated analysis
    // For now, just log what would be done
    console.log('    📝 Would analyze and add missing imports');
  }

  async removeUnusedImports() {
    console.log('  🗑️  Removing unused imports...');
    
    // This would require more sophisticated analysis
    // For now, just log what would be done
    console.log('    📝 Would analyze and remove unused imports');
  }

  getSummary() {
    const summary = {
      totalOperations: this.operations.length,
      prettier: this.operations.filter(op => op.type === 'prettier').length,
      eslint: this.operations.filter(op => op.type === 'eslint').length,
      typescript: this.operations.filter(op => op.type === 'typescript').length,
      importOrder: this.operations.filter(op => op.type === 'import_order').length,
      config: this.config
    };
    
    return summary;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const dryRun = !process.argv.includes('--apply');
  const manager = new FormatAndLintManager(projectRoot);
  
  manager.formatAndLint({ dryRun }).then(result => {
    console.log('\n📊 Format and Lint Summary:');
    console.log('============================');
    console.log(`Total operations: ${result.summary.totalOperations}`);
    console.log(`Prettier runs: ${result.summary.prettier}`);
    console.log(`ESLint runs: ${result.summary.eslint}`);
    console.log(`TypeScript checks: ${result.summary.typescript}`);
    console.log(`Import order fixes: ${result.summary.importOrder}`);
    
    console.log('\n🔧 Configuration:');
    console.log(`Prettier config: ${result.summary.config.prettier.found ? 'Found' : 'Not found'}`);
    console.log(`ESLint config: ${result.summary.config.eslint.found ? 'Found' : 'Not found'}`);
    console.log(`TypeScript config: ${result.summary.config.typescript.found ? 'Found' : 'Not found'}`);
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Use --apply to make actual changes.');
    } else {
      console.log('\n✅ Formatting and linting completed successfully!');
    }
  }).catch(error => {
    console.error('Error during formatting and linting:', error);
    process.exit(1);
  });
}

export default FormatAndLintManager;
