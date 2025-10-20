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
 * Safe Remove or Move Manager
 * Safely removes or moves files with proper validation and rollback support
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SafeRemoveOrMoveManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.operations = [];
    this.rollbackData = [];
    this.dryRun = true;
  }

  async process(options = {}) {
    const {
      dryRun = true,
      candidatesFile = path.join(__dirname, '.smart-cleaner-candidates.json'),
      backupBeforeRemove = true
    } = options;

    this.dryRun = dryRun;
    
    console.log(`🔧 Processing file removals and moves (${dryRun ? 'DRY RUN' : 'APPLYING CHANGES'})...`);
    
    if (!fs.existsSync(candidatesFile)) {
      console.error('❌ Candidates file not found. Run identify_dead_files.js first.');
      return;
    }

    const candidates = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));
    
    await this.processDeadFiles(candidates.deadFiles);
    await this.processOrphanedFiles(candidates.orphanedFiles);
    await this.processDuplicateFiles(candidates.duplicateFiles);
    await this.processUnusedDependencies(candidates.unusedDependencies);
    
    if (!dryRun) {
      this.createRollbackData();
    }
    
    return {
      operations: this.operations,
      rollbackData: this.rollbackData,
      summary: this.getSummary()
    };
  }

  async processDeadFiles(deadFiles) {
    console.log('  🗑️  Processing dead files...');
    
    for (const fileInfo of deadFiles) {
      const filePath = path.join(this.projectRoot, fileInfo.file);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  File not found: ${fileInfo.file}`);
        continue;
      }
      
      const operation = {
        type: 'remove',
        file: fileInfo.file,
        reason: fileInfo.reason,
        size: fileInfo.size,
        timestamp: new Date().toISOString()
      };
      
      if (this.dryRun) {
        console.log(`  📝 Would remove: ${fileInfo.file} (${this.formatFileSize(fileInfo.size)})`);
        this.operations.push(operation);
      } else {
        try {
          // Create backup before removal
          await this.createFileBackup(filePath);
          
          fs.unlinkSync(filePath);
          console.log(`  ✅ Removed: ${fileInfo.file}`);
          this.operations.push(operation);
        } catch (error) {
          console.error(`  ❌ Failed to remove ${fileInfo.file}:`, error.message);
        }
      }
    }
  }

  async processOrphanedFiles(orphanedFiles) {
    console.log('  👻 Processing orphaned files...');
    
    for (const fileInfo of orphanedFiles) {
      const filePath = path.join(this.projectRoot, fileInfo.file);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  File not found: ${fileInfo.file}`);
        continue;
      }
      
      const operation = {
        type: 'remove',
        file: fileInfo.file,
        reason: 'orphaned',
        size: fileInfo.size,
        timestamp: new Date().toISOString()
      };
      
      if (this.dryRun) {
        console.log(`  📝 Would remove orphaned: ${fileInfo.file} (${this.formatFileSize(fileInfo.size)})`);
        this.operations.push(operation);
      } else {
        try {
          // Create backup before removal
          await this.createFileBackup(filePath);
          
          fs.unlinkSync(filePath);
          console.log(`  ✅ Removed orphaned: ${fileInfo.file}`);
          this.operations.push(operation);
        } catch (error) {
          console.error(`  ❌ Failed to remove orphaned ${fileInfo.file}:`, error.message);
        }
      }
    }
  }

  async processDuplicateFiles(duplicateFiles) {
    console.log('  🔄 Processing duplicate files...');
    
    for (const duplicateInfo of duplicateFiles) {
      const duplicatePath = path.join(this.projectRoot, duplicateInfo.duplicate);
      
      if (!fs.existsSync(duplicatePath)) {
        console.warn(`  ⚠️  Duplicate file not found: ${duplicateInfo.duplicate}`);
        continue;
      }
      
      const operation = {
        type: 'remove',
        file: duplicateInfo.duplicate,
        reason: 'duplicate',
        original: duplicateInfo.original,
        size: this.getFileSize(duplicatePath),
        timestamp: new Date().toISOString()
      };
      
      if (this.dryRun) {
        console.log(`  📝 Would remove duplicate: ${duplicateInfo.duplicate} (original: ${duplicateInfo.original})`);
        this.operations.push(operation);
      } else {
        try {
          // Create backup before removal
          await this.createFileBackup(duplicatePath);
          
          fs.unlinkSync(duplicatePath);
          console.log(`  ✅ Removed duplicate: ${duplicateInfo.duplicate}`);
          this.operations.push(operation);
        } catch (error) {
          console.error(`  ❌ Failed to remove duplicate ${duplicateInfo.duplicate}:`, error.message);
        }
      }
    }
  }

  async processUnusedDependencies(unusedDependencies) {
    console.log('  📦 Processing unused dependencies...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.warn('  ⚠️  package.json not found');
      return;
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      let modified = false;
      
      for (const depInfo of unusedDependencies) {
        const operation = {
          type: 'remove_dependency',
          dependency: depInfo.name,
          version: depInfo.version,
          type: depInfo.type,
          timestamp: new Date().toISOString()
        };
        
        if (this.dryRun) {
          console.log(`  📝 Would remove dependency: ${depInfo.name} (${depInfo.type})`);
          this.operations.push(operation);
        } else {
          try {
            // Create backup of package.json
            await this.createFileBackup(packageJsonPath);
            
            // Remove from dependencies or devDependencies
            if (depInfo.type === 'dependency' && packageJson.dependencies) {
              delete packageJson.dependencies[depInfo.name];
              modified = true;
            } else if (depInfo.type === 'devDependency' && packageJson.devDependencies) {
              delete packageJson.devDependencies[depInfo.name];
              modified = true;
            }
            
            console.log(`  ✅ Removed dependency: ${depInfo.name}`);
            this.operations.push(operation);
          } catch (error) {
            console.error(`  ❌ Failed to remove dependency ${depInfo.name}:`, error.message);
          }
        }
      }
      
      // Write modified package.json
      if (modified && !this.dryRun) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log('  ✅ Updated package.json');
      }
    } catch (error) {
      console.error('  ❌ Error processing package.json:', error.message);
    }
  }

  async createFileBackup(filePath) {
    const backupDir = path.join(this.projectRoot, '.smart-cleaner-backups', 'file-backups');
    fs.mkdirSync(backupDir, { recursive: true });
    
    const relativePath = path.relative(this.projectRoot, filePath);
    const backupPath = path.join(backupDir, relativePath);
    
    // Create directory structure
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    
    // Copy file
    fs.copyFileSync(filePath, backupPath);
    
    return backupPath;
  }

  createRollbackData() {
    console.log('  💾 Creating rollback data...');
    
    const rollbackFile = path.join(__dirname, '.rollback-data.json');
    
    this.rollbackData = {
      timestamp: new Date().toISOString(),
      operations: this.operations,
      projectRoot: this.projectRoot,
      gitCommit: this.getCurrentGitCommit()
    };
    
    fs.writeFileSync(rollbackFile, JSON.stringify(this.rollbackData, null, 2));
    console.log('  ✅ Rollback data created');
  }

  getCurrentGitCommit() {
    try {
      return execSync('git rev-parse HEAD', { 
        cwd: this.projectRoot, 
        encoding: 'utf8' 
      }).trim();
    } catch (error) {
      return null;
    }
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  getSummary() {
    const summary = {
      totalOperations: this.operations.length,
      removedFiles: 0,
      removedDependencies: 0,
      totalSizeRemoved: 0
    };
    
    for (const operation of this.operations) {
      if (operation.type === 'remove') {
        summary.removedFiles++;
        summary.totalSizeRemoved += operation.size || 0;
      } else if (operation.type === 'remove_dependency') {
        summary.removedDependencies++;
      }
    }
    
    summary.totalSizeRemovedFormatted = this.formatFileSize(summary.totalSizeRemoved);
    
    return summary;
  }

  async rollback() {
    console.log('🔄 Rolling back changes...');
    
    const rollbackFile = path.join(__dirname, '.rollback-data.json');
    
    if (!fs.existsSync(rollbackFile)) {
      console.error('❌ Rollback data not found');
      return false;
    }
    
    try {
      const rollbackData = JSON.parse(fs.readFileSync(rollbackFile, 'utf8'));
      
      // Restore files from backup
      const backupDir = path.join(this.projectRoot, '.smart-cleaner-backups', 'file-backups');
      
      for (const operation of rollbackData.operations) {
        if (operation.type === 'remove') {
          const backupPath = path.join(backupDir, operation.file);
          
          if (fs.existsSync(backupPath)) {
            const originalPath = path.join(this.projectRoot, operation.file);
            
            // Create directory if it doesn't exist
            fs.mkdirSync(path.dirname(originalPath), { recursive: true });
            
            // Restore file
            fs.copyFileSync(backupPath, originalPath);
            console.log(`  ✅ Restored: ${operation.file}`);
          }
        }
      }
      
      // Restore package.json if it was modified
      const packageJsonBackup = path.join(backupDir, 'package.json');
      if (fs.existsSync(packageJsonBackup)) {
        const packageJsonPath = path.join(this.projectRoot, 'package.json');
        fs.copyFileSync(packageJsonBackup, packageJsonPath);
        console.log('  ✅ Restored package.json');
      }
      
      console.log('✅ Rollback completed');
      return true;
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      return false;
    }
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const dryRun = !process.argv.includes('--apply');
  const manager = new SafeRemoveOrMoveManager(projectRoot);
  
  manager.process({ dryRun }).then(result => {
    console.log('\n📊 Removal/Move Summary:');
    console.log('========================');
    console.log(`Total operations: ${result.summary.totalOperations}`);
    console.log(`Files removed: ${result.summary.removedFiles}`);
    console.log(`Dependencies removed: ${result.summary.removedDependencies}`);
    console.log(`Total size removed: ${result.summary.totalSizeRemovedFormatted}`);
    
    if (dryRun) {
      console.log('\n💡 This was a dry run. Use --apply to make actual changes.');
    } else {
      console.log('\n✅ Changes applied successfully!');
      console.log('💾 Rollback data saved for potential recovery.');
    }
  }).catch(error => {
    console.error('Error processing removals:', error);
    process.exit(1);
  });
}

export default SafeRemoveOrMoveManager;
