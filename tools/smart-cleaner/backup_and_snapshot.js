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
 * Backup and Snapshot Manager
 * Creates backups and snapshots before making changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BackupManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.backupDir = path.join(projectRoot, '.smart-cleaner-backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  createBackup(options = {}) {
    console.log('💾 Creating backup...');
    
    const {
      type = 'full',
      description = 'Smart cleaner backup',
      excludePatterns = ['node_modules', '.git', '.next', 'dist', 'build']
    } = options;

    const backupName = `${type}_${this.timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);
    
    // Create backup directory
    fs.mkdirSync(backupPath, { recursive: true });

    try {
      switch (type) {
        case 'git':
          this.createGitBackup(backupPath, description);
          break;
        case 'tar':
          this.createTarBackup(backupPath, excludePatterns);
          break;
        case 'full':
          this.createGitBackup(backupPath, description);
          this.createTarBackup(backupPath, excludePatterns);
          break;
        default:
          throw new Error(`Unknown backup type: ${type}`);
      }

      // Create backup metadata
      this.createBackupMetadata(backupPath, {
        type,
        description,
        timestamp: this.timestamp,
        projectRoot: this.projectRoot,
        excludePatterns
      });

      console.log(`✅ Backup created: ${backupName}`);
      return backupPath;
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      // Clean up failed backup
      if (fs.existsSync(backupPath)) {
        fs.rmSync(backupPath, { recursive: true, force: true });
      }
      throw error;
    }
  }

  createGitBackup(backupPath, description) {
    console.log('  📦 Creating git bundle...');
    
    const bundlePath = path.join(backupPath, 'git-bundle.bundle');
    
    try {
      execSync(`git bundle create "${bundlePath}" HEAD`, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Git bundle creation failed: ${error.message}`);
    }
  }

  createTarBackup(backupPath, excludePatterns) {
    console.log('  📁 Creating tar backup...');
    
    const tarPath = path.join(backupPath, 'project-backup.tar.gz');
    
    // Build exclude arguments
    const excludeArgs = excludePatterns
      .map(pattern => `--exclude=${pattern}`)
      .join(' ');
    
    try {
      execSync(`tar -czf "${tarPath}" ${excludeArgs} .`, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Tar backup creation failed: ${error.message}`);
    }
  }

  createBackupMetadata(backupPath, metadata) {
    const metadataPath = path.join(backupPath, 'backup-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  }

  createSnapshot() {
    console.log('📸 Creating project snapshot...');
    
    const snapshotPath = path.join(this.backupDir, `snapshot_${this.timestamp}`);
    fs.mkdirSync(snapshotPath, { recursive: true });

    try {
      // Create file tree snapshot
      this.createFileTreeSnapshot(snapshotPath);
      
      // Create dependency snapshot
      this.createDependencySnapshot(snapshotPath);
      
      // Create git status snapshot
      this.createGitStatusSnapshot(snapshotPath);
      
      console.log(`✅ Snapshot created: ${path.basename(snapshotPath)}`);
      return snapshotPath;
    } catch (error) {
      console.error('❌ Snapshot failed:', error.message);
      if (fs.existsSync(snapshotPath)) {
        fs.rmSync(snapshotPath, { recursive: true, force: true });
      }
      throw error;
    }
  }

  createFileTreeSnapshot(snapshotPath) {
    console.log('  🌳 Creating file tree snapshot...');
    
    const treePath = path.join(snapshotPath, 'file-tree.txt');
    
    try {
      const treeOutput = execSync('tree -a -I "node_modules|.git|.next|dist|build"', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      fs.writeFileSync(treePath, treeOutput);
    } catch (error) {
      // Fallback to manual tree creation
      const manualTree = this.createManualFileTree();
      fs.writeFileSync(treePath, manualTree);
    }
  }

  createManualFileTree() {
    const createTree = (dir, prefix = '', maxDepth = 5, currentDepth = 0) => {
      if (currentDepth >= maxDepth) return '';
      
      let tree = '';
      const items = fs.readdirSync(dir).sort();
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        const isLast = i === items.length - 1;
        const currentPrefix = isLast ? '└── ' : '├── ';
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        
        tree += `${prefix}${currentPrefix}${item}\n`;
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          tree += createTree(itemPath, nextPrefix, maxDepth, currentDepth + 1);
        }
      }
      
      return tree;
    };
    
    return createTree(this.projectRoot);
  }

  createDependencySnapshot(snapshotPath) {
    console.log('  📋 Creating dependency snapshot...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependenciesPath = path.join(snapshotPath, 'dependencies.json');
      fs.writeFileSync(dependenciesPath, JSON.stringify(packageJson, null, 2));
    }
  }

  createGitStatusSnapshot(snapshotPath) {
    console.log('  🔍 Creating git status snapshot...');
    
    try {
      const gitStatus = execSync('git status --porcelain', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const gitLog = execSync('git log --oneline -10', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const statusPath = path.join(snapshotPath, 'git-status.txt');
      fs.writeFileSync(statusPath, `Git Status:\n${gitStatus}\n\nRecent Commits:\n${gitLog}`);
    } catch (error) {
      console.warn('Warning: Could not create git status snapshot:', error.message);
    }
  }

  listBackups() {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }
    
    const backups = fs.readdirSync(this.backupDir)
      .filter(item => {
        const itemPath = path.join(this.backupDir, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .map(backup => {
        const backupPath = path.join(this.backupDir, backup);
        const metadataPath = path.join(backupPath, 'backup-metadata.json');
        
        let metadata = {};
        if (fs.existsSync(metadataPath)) {
          try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          } catch (error) {
            console.warn(`Warning: Could not read metadata for ${backup}`);
          }
        }
        
        return {
          name: backup,
          path: backupPath,
          metadata
        };
      })
      .sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp));
    
    return backups;
  }

  restoreBackup(backupName) {
    console.log(`🔄 Restoring backup: ${backupName}...`);
    
    const backupPath = path.join(this.backupDir, backupName);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }
    
    const metadataPath = path.join(backupPath, 'backup-metadata.json');
    let metadata = {};
    
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
    
    try {
      if (metadata.type === 'git' || metadata.type === 'full') {
        this.restoreGitBackup(backupPath);
      }
      
      if (metadata.type === 'tar' || metadata.type === 'full') {
        this.restoreTarBackup(backupPath);
      }
      
      console.log(`✅ Backup restored: ${backupName}`);
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
      throw error;
    }
  }

  restoreGitBackup(backupPath) {
    console.log('  📦 Restoring git bundle...');
    
    const bundlePath = path.join(backupPath, 'git-bundle.bundle');
    
    if (!fs.existsSync(bundlePath)) {
      throw new Error('Git bundle not found in backup');
    }
    
    try {
      execSync(`git bundle verify "${bundlePath}"`, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      execSync(`git reset --hard $(git bundle list-heads "${bundlePath}" | head -1 | cut -d' ' -f1)`, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Git restore failed: ${error.message}`);
    }
  }

  restoreTarBackup(backupPath) {
    console.log('  📁 Restoring tar backup...');
    
    const tarPath = path.join(backupPath, 'project-backup.tar.gz');
    
    if (!fs.existsSync(tarPath)) {
      throw new Error('Tar backup not found in backup');
    }
    
    try {
      execSync(`tar -xzf "${tarPath}"`, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Tar restore failed: ${error.message}`);
    }
  }

  cleanupOldBackups(keepCount = 5) {
    console.log(`🧹 Cleaning up old backups (keeping ${keepCount} most recent)...`);
    
    const backups = this.listBackups();
    
    if (backups.length <= keepCount) {
      console.log('No cleanup needed');
      return;
    }
    
    const toDelete = backups.slice(keepCount);
    
    for (const backup of toDelete) {
      console.log(`  🗑️  Deleting: ${backup.name}`);
      fs.rmSync(backup.path, { recursive: true, force: true });
    }
    
    console.log(`✅ Cleaned up ${toDelete.length} old backups`);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const action = process.argv[3] || 'create';
  const backupManager = new BackupManager(projectRoot);
  
  switch (action) {
    case 'create':
      backupManager.createBackup();
      break;
    case 'snapshot':
      backupManager.createSnapshot();
      break;
    case 'list':
      const backups = backupManager.listBackups();
      console.log('\n📋 Available Backups:');
      console.log('======================');
      backups.forEach(backup => {
        console.log(`• ${backup.name} (${backup.metadata.type || 'unknown'})`);
        if (backup.metadata.description) {
          console.log(`  ${backup.metadata.description}`);
        }
      });
      break;
    case 'restore':
      const backupName = process.argv[4];
      if (!backupName) {
        console.error('Please specify backup name to restore');
        process.exit(1);
      }
      backupManager.restoreBackup(backupName);
      break;
    case 'cleanup':
      const keepCount = parseInt(process.argv[4]) || 5;
      backupManager.cleanupOldBackups(keepCount);
      break;
    default:
      console.log('Usage: node backup_and_snapshot.js [create|snapshot|list|restore|cleanup] [options]');
      process.exit(1);
  }
}

export default BackupManager;
