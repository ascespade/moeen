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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

#!/usr/bin/env node

/**
 * Project Structure Refactorer
 * Reorganizes project structure for better maintainability
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class ProjectStructureRefactorer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.operations = [];
    this.dryRun = true;
    this.structure = {
      components: [],
      pages: [],
      utils: [],
      hooks: [],
      types: [],
      services: [],
      lib: [],
      config: []
    };
  }

  async refactor(options = {}) {
    const {
      dryRun = true,
      structure = 'nextjs-app-router'
    } = options;

    this.dryRun = dryRun;
    
    console.log(`🏗️  Refactoring project structure (${dryRun ? 'DRY RUN' : 'APPLYING CHANGES'})...`);
    
    await this.analyzeCurrentStructure();
    await this.planRefactoring(structure);
    await this.executeRefactoring();
    
    return {
      operations: this.operations,
      summary: this.getSummary()
    };
  }

  async analyzeCurrentStructure() {
    console.log('  🔍 Analyzing current structure...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        this.categorizeFile(file);
      }
    }
  }

  categorizeFile(file) {
    const fileName = path.basename(file);
    const fileDir = path.dirname(file);
    
    // Categorize based on file name and location
    if (fileName.includes('Component') || fileName.includes('component') || 
        fileDir.includes('components') || fileDir.includes('Components')) {
      this.structure.components.push(file);
    } else if (fileName.includes('page') || fileName.includes('Page') ||
               fileDir.includes('pages') || fileDir.includes('Pages')) {
      this.structure.pages.push(file);
    } else if (fileName.includes('util') || fileName.includes('Util') ||
               fileName.includes('helper') || fileName.includes('Helper') ||
               fileDir.includes('utils') || fileDir.includes('Utils')) {
      this.structure.utils.push(file);
    } else if (fileName.includes('hook') || fileName.includes('Hook') ||
               fileName.includes('use') || fileDir.includes('hooks') || 
               fileDir.includes('Hooks')) {
      this.structure.hooks.push(file);
    } else if (fileName.includes('type') || fileName.includes('Type') ||
               fileName.includes('interface') || fileName.includes('Interface') ||
               fileDir.includes('types') || fileDir.includes('Types')) {
      this.structure.types.push(file);
    } else if (fileName.includes('service') || fileName.includes('Service') ||
               fileDir.includes('services') || fileDir.includes('Services')) {
      this.structure.services.push(file);
    } else if (fileDir.includes('lib') || fileDir.includes('Lib')) {
      this.structure.lib.push(file);
    } else if (fileDir.includes('config') || fileDir.includes('Config')) {
      this.structure.config.push(file);
    }
  }

  async planRefactoring(structure) {
    console.log('  📋 Planning refactoring...');
    
    switch (structure) {
      case 'nextjs-app-router':
        await this.planNextJSAppRouter();
        break;
      case 'nextjs-pages-router':
        await this.planNextJSPagesRouter();
        break;
      case 'react-standard':
        await this.planReactStandard();
        break;
      default:
        console.warn(`Unknown structure type: ${structure}`);
    }
  }

  async planNextJSAppRouter() {
    console.log('  📐 Planning Next.js App Router structure...');
    
    // Plan component organization
    await this.planComponentOrganization();
    
    // Plan utility organization
    await this.planUtilityOrganization();
    
    // Plan type organization
    await this.planTypeOrganization();
    
    // Plan hook organization
    await this.planHookOrganization();
  }

  async planComponentOrganization() {
    const targetDir = 'src/components';
    
    for (const component of this.structure.components) {
      const newPath = this.getNewComponentPath(component, targetDir);
      
      if (newPath !== component) {
        this.operations.push({
          type: 'move',
          from: component,
          to: newPath,
          reason: 'component_organization',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  getNewComponentPath(file, targetDir) {
    const fileName = path.basename(file);
    const fileDir = path.dirname(file);
    
    // If already in components directory, keep it
    if (fileDir.includes('components')) {
      return file;
    }
    
    // Determine subdirectory based on component type
    let subDir = 'common';
    
    if (fileName.includes('Button') || fileName.includes('Input') || 
        fileName.includes('Modal') || fileName.includes('Card')) {
      subDir = 'ui';
    } else if (fileName.includes('Layout') || fileName.includes('Header') || 
               fileName.includes('Footer') || fileName.includes('Sidebar')) {
      subDir = 'layout';
    } else if (fileName.includes('Form') || fileName.includes('Input') || 
               fileName.includes('Select') || fileName.includes('Checkbox')) {
      subDir = 'forms';
    } else if (fileName.includes('Chart') || fileName.includes('Graph') || 
               fileName.includes('Table') || fileName.includes('List')) {
      subDir = 'data-display';
    }
    
    return path.join(targetDir, subDir, fileName);
  }

  async planUtilityOrganization() {
    const targetDir = 'src/utils';
    
    for (const util of this.structure.utils) {
      const newPath = this.getNewUtilityPath(util, targetDir);
      
      if (newPath !== util) {
        this.operations.push({
          type: 'move',
          from: util,
          to: newPath,
          reason: 'utility_organization',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  getNewUtilityPath(file, targetDir) {
    const fileName = path.basename(file);
    const fileDir = path.dirname(file);
    
    // If already in utils directory, keep it
    if (fileDir.includes('utils')) {
      return file;
    }
    
    // Determine subdirectory based on utility type
    let subDir = 'common';
    
    if (fileName.includes('date') || fileName.includes('time') || 
        fileName.includes('format')) {
      subDir = 'date';
    } else if (fileName.includes('string') || fileName.includes('text') || 
               fileName.includes('parse')) {
      subDir = 'string';
    } else if (fileName.includes('number') || fileName.includes('math') || 
               fileName.includes('calculate')) {
      subDir = 'number';
    } else if (fileName.includes('array') || fileName.includes('list') || 
               fileName.includes('collection')) {
      subDir = 'array';
    } else if (fileName.includes('object') || fileName.includes('data') || 
               fileName.includes('transform')) {
      subDir = 'object';
    }
    
    return path.join(targetDir, subDir, fileName);
  }

  async planTypeOrganization() {
    const targetDir = 'src/types';
    
    for (const type of this.structure.types) {
      const newPath = this.getNewTypePath(type, targetDir);
      
      if (newPath !== type) {
        this.operations.push({
          type: 'move',
          from: type,
          to: newPath,
          reason: 'type_organization',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  getNewTypePath(file, targetDir) {
    const fileName = path.basename(file);
    const fileDir = path.dirname(file);
    
    // If already in types directory, keep it
    if (fileDir.includes('types')) {
      return file;
    }
    
    // Determine subdirectory based on type
    let subDir = 'common';
    
    if (fileName.includes('api') || fileName.includes('Api')) {
      subDir = 'api';
    } else if (fileName.includes('user') || fileName.includes('User') || 
               fileName.includes('auth') || fileName.includes('Auth')) {
      subDir = 'auth';
    } else if (fileName.includes('component') || fileName.includes('Component')) {
      subDir = 'components';
    } else if (fileName.includes('database') || fileName.includes('Database') || 
               fileName.includes('db') || fileName.includes('Db')) {
      subDir = 'database';
    }
    
    return path.join(targetDir, subDir, fileName);
  }

  async planHookOrganization() {
    const targetDir = 'src/hooks';
    
    for (const hook of this.structure.hooks) {
      const newPath = this.getNewHookPath(hook, targetDir);
      
      if (newPath !== hook) {
        this.operations.push({
          type: 'move',
          from: hook,
          to: newPath,
          reason: 'hook_organization',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  getNewHookPath(file, targetDir) {
    const fileName = path.basename(file);
    const fileDir = path.dirname(file);
    
    // If already in hooks directory, keep it
    if (fileDir.includes('hooks')) {
      return file;
    }
    
    // Determine subdirectory based on hook type
    let subDir = 'common';
    
    if (fileName.includes('useApi') || fileName.includes('useFetch') || 
        fileName.includes('useRequest')) {
      subDir = 'api';
    } else if (fileName.includes('useAuth') || fileName.includes('useUser') || 
               fileName.includes('useLogin')) {
      subDir = 'auth';
    } else if (fileName.includes('useForm') || fileName.includes('useInput') || 
               fileName.includes('useValidation')) {
      subDir = 'forms';
    } else if (fileName.includes('useLocalStorage') || fileName.includes('useSessionStorage') || 
               fileName.includes('useStorage')) {
      subDir = 'storage';
    }
    
    return path.join(targetDir, subDir, fileName);
  }

  async planNextJSPagesRouter() {
    console.log('  📐 Planning Next.js Pages Router structure...');
    // Similar to App Router but with pages/ directory
  }

  async planReactStandard() {
    console.log('  📐 Planning React Standard structure...');
    // Standard React project structure
  }

  async executeRefactoring() {
    console.log('  🔨 Executing refactoring...');
    
    for (const operation of this.operations) {
      if (operation.type === 'move') {
        await this.executeMove(operation);
      }
    }
  }

  async executeMove(operation) {
    const fromPath = path.join(this.projectRoot, operation.from);
    const toPath = path.join(this.projectRoot, operation.to);
    
    if (!fs.existsSync(fromPath)) {
      console.warn(`  ⚠️  Source file not found: ${operation.from}`);
      return;
    }
    
    if (this.dryRun) {
      console.log(`  📝 Would move: ${operation.from} → ${operation.to}`);
    } else {
      try {
        // Create target directory
        fs.mkdirSync(path.dirname(toPath), { recursive: true });
        
        // Move file
        fs.renameSync(fromPath, toPath);
        console.log(`  ✅ Moved: ${operation.from} → ${operation.to}`);
        
        // Update import references
        await this.updateImportReferences(operation.from, operation.to);
      } catch (error) {
        console.error(`  ❌ Failed to move ${operation.from}:`, error.message);
      }
    }
  }

  async updateImportReferences(oldPath, newPath) {
    console.log(`  🔗 Updating import references for ${oldPath}...`);
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        await this.updateFileImports(file, oldPath, newPath);
      }
    }
  }

  async updateFileImports(file, oldPath, newPath) {
    try {
      const filePath = path.join(this.projectRoot, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Update relative imports
      const oldRelativePath = this.getRelativePath(file, oldPath);
      const newRelativePath = this.getRelativePath(file, newPath);
      
      if (content.includes(oldRelativePath)) {
        content = content.replace(
          new RegExp(oldRelativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          newRelativePath
        );
        modified = true;
      }
      
      // Update alias imports
      const oldAliasPath = oldPath.replace('src/', '@/');
      const newAliasPath = newPath.replace('src/', '@/');
      
      if (content.includes(oldAliasPath)) {
        content = content.replace(
          new RegExp(oldAliasPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          newAliasPath
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`    ✅ Updated imports in: ${file}`);
      }
    } catch (error) {
      console.warn(`    ⚠️  Could not update imports in ${file}:`, error.message);
    }
  }

  getRelativePath(fromFile, toFile) {
    const fromDir = path.dirname(fromFile);
    const relativePath = path.relative(fromDir, toFile);
    
    // Ensure relative path starts with ./
    if (!relativePath.startsWith('.')) {
      return './' + relativePath;
    }
    
    return relativePath;
  }

  getSummary() {
    return {
      totalOperations: this.operations.length,
      moves: this.operations.filter(op => op.type === 'move').length,
      components: this.structure.components.length,
      pages: this.structure.pages.length,
      utils: this.structure.utils.length,
      hooks: this.structure.hooks.length,
      types: this.structure.types.length
    };
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const dryRun = !process.argv.includes('--apply');
  const refactorer = new ProjectStructureRefactorer(projectRoot);
  
  refactorer.refactor({ dryRun }).then(result => {
    console.log('\n📊 Refactoring Summary:');
    console.log('========================');
    console.log(`Total operations: ${result.summary.totalOperations}`);
    console.log(`Moves: ${result.summary.moves}`);
    console.log(`Components found: ${result.summary.components}`);
    console.log(`Pages found: ${result.summary.pages}`);
    console.log(`Utils found: ${result.summary.utils}`);
    console.log(`Hooks found: ${result.summary.hooks}`);
    console.log(`Types found: ${result.summary.types}`);
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Use --apply to make actual changes.');
    } else {
      console.log('\n✅ Refactoring completed successfully!');
    }
  }).catch(error => {
    console.error('Error during refactoring:', error);
    process.exit(1);
  });
}

export default ProjectStructureRefactorer;
