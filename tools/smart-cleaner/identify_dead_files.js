import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dead Files Identifier
 * Identifies unused files, dead code, and orphaned dependencies
 */


class DeadFilesIdentifier {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.deadFiles = [];
    this.unusedDependencies = [];
    this.deadImports = [];
    this.orphanedFiles = [];
    this.duplicateFiles = [];
    this.largeFiles = [];
  }

  async identify() {
    console.log('🔍 Identifying dead files and unused code...');
    
    await this.loadDependencyGraph();
    await this.findDeadFiles();
    await this.findUnusedDependencies();
    await this.findDeadImports();
    await this.findOrphanedFiles();
    await this.findDuplicateFiles();
    await this.findLargeFiles();
    
    return {
      deadFiles: this.deadFiles,
      unusedDependencies: this.unusedDependencies,
      deadImports: this.deadImports,
      orphanedFiles: this.orphanedFiles,
      duplicateFiles: this.duplicateFiles,
      largeFiles: this.largeFiles,
      summary: this.getSummary()
    };
  }

  async loadDependencyGraph() {
    const graphPath = path.join(__dirname, 'dependency_graph.json');
    
    if (fs.existsSync(graphPath)) {
      try {
        const graphData = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
        this.dependencyGraph = graphData.graph || {};
        this.fileDependencies = graphData.fileDependencies || {};
        this.moduleUsage = graphData.moduleUsage || {};
      } catch (error) {
        console.warn('Warning: Could not load dependency graph:', error.message);
        this.dependencyGraph = {};
        this.fileDependencies = {};
        this.moduleUsage = {};
      }
    } else {
      console.warn('Warning: Dependency graph not found. Run build_dependency_graph.js first.');
      this.dependencyGraph = {};
      this.fileDependencies = {};
      this.moduleUsage = {};
    }
  }

  async findDeadFiles() {
    console.log('  🗑️  Finding dead files...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    const allFiles = new Set();
    
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      files.forEach(file => allFiles.add(file));
    }

    // Find files that are not imported by any other file
    for (const file of allFiles) {
      if (this.isDeadFile(file, allFiles)) {
        this.deadFiles.push({
          file,
          reason: this.getDeadFileReason(file),
          size: this.getFileSize(file),
          lastModified: this.getLastModified(file)
        });
      }
    }
  }

  isDeadFile(file, allFiles) {
    // Skip certain files that are always needed
    if (this.isAlwaysNeededFile(file)) {
      return false;
    }

    // Check if file is imported by any other file
    for (const otherFile of allFiles) {
      if (otherFile === file) continue;
      
      if (this.isFileImportedBy(otherFile, file)) {
        return false;
      }
    }

    // Check if file is referenced in configuration files
    if (this.isReferencedInConfig(file)) {
      return false;
    }

    return true;
  }

  isAlwaysNeededFile(file) {
    const alwaysNeeded = [
      'layout.tsx',
      'page.tsx',
      'loading.tsx',
      'error.tsx',
      'not-found.tsx',
      'global.css',
      'globals.css',
      'index.ts',
      'index.tsx',
      'main.tsx',
      'app.tsx',
      'App.tsx'
    ];

    const fileName = path.basename(file);
    return alwaysNeeded.includes(fileName);
  }

  isFileImportedBy(importingFile, importedFile) {
    const imports = this.fileDependencies[importingFile] || [];
    
    // Check direct imports
    if (imports.includes(importedFile)) {
      return true;
    }

    // Check if imported file is in the same directory and might be imported relatively
    const importingDir = path.dirname(importingFile);
    const importedDir = path.dirname(importedFile);
    
    if (importingDir === importedDir) {
      const importedFileName = path.basename(importedFile, path.extname(importedFile));
      const importingFileName = path.basename(importingFile, path.extname(importingFile));
      
      // Skip if it's the same file
      if (importedFileName === importingFileName) {
        return false;
      }
      
      // Check if the importing file might import the imported file
      if (this.mightImportFile(importingFile, importedFile)) {
        return true;
      }
    }

    return false;
  }

  mightImportFile(importingFile, importedFile) {
    try {
      const content = fs.readFileSync(path.join(this.projectRoot, importingFile), 'utf8');
      const importedFileName = path.basename(importedFile, path.extname(importedFile));
      
      // Check for various import patterns
      const importPatterns = [
        new RegExp(`import.*from\\s+['"]\\./${importedFileName}['"]`, 'g'),
        new RegExp(`import.*from\\s+['"]\\.\\./${importedFileName}['"]`, 'g'),
        new RegExp(`import\\s+['"]\\./${importedFileName}['"]`, 'g'),
        new RegExp(`import\\s+['"]\\.\\./${importedFileName}['"]`, 'g'),
        new RegExp(`require\\s*\\(\\s*['"]\\./${importedFileName}['"]\\s*\\)`, 'g'),
        new RegExp(`require\\s*\\(\\s*['"]\\.\\./${importedFileName}['"]\\s*\\)`, 'g')
      ];

      for (const pattern of importPatterns) {
        if (pattern.test(content)) {
          return true;
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return false;
  }

  isReferencedInConfig(file) {
    const configFiles = [
      'next.config.js',
      'next.config.ts',
      'tailwind.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      'package.json',
      'vite.config.js',
      'vite.config.ts'
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(this.projectRoot, configFile);
      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, 'utf8');
          if (content.includes(file)) {
            return true;
          }
        } catch (error) {
          // Ignore errors
        }
      }
    }

    return false;
  }

  getDeadFileReason(file) {
    const reasons = [];
    
    if (this.isTestFile(file)) {
      reasons.push('Test file');
    }
    
    if (this.isUtilityFile(file)) {
      reasons.push('Utility file');
    }
    
    if (this.isComponentFile(file)) {
      reasons.push('Component file');
    }
    
    if (this.isPageFile(file)) {
      reasons.push('Page file');
    }
    
    return reasons.join(', ') || 'Unused file';
  }

  isTestFile(file) {
    return file.includes('.test.') || file.includes('.spec.') || file.includes('__tests__');
  }

  isUtilityFile(file) {
    return file.includes('utils') || file.includes('helpers') || file.includes('lib');
  }

  isComponentFile(file) {
    return file.includes('components') || file.includes('Component');
  }

  isPageFile(file) {
    return file.includes('pages') || file.includes('page.tsx');
  }

  getFileSize(file) {
    try {
      const stats = fs.statSync(path.join(this.projectRoot, file));
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  getLastModified(file) {
    try {
      const stats = fs.statSync(path.join(this.projectRoot, file));
      return stats.mtime.toISOString();
    } catch (error) {
      return null;
    }
  }

  async findUnusedDependencies() {
    console.log('  📦 Finding unused dependencies...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      for (const [depName, depVersion] of Object.entries(dependencies)) {
        if (this.isUnusedDependency(depName)) {
          this.unusedDependencies.push({
            name: depName,
            version: depVersion,
            type: packageJson.dependencies[depName] ? 'dependency' : 'devDependency'
          });
        }
      }
    } catch (error) {
      console.warn('Warning: Could not analyze dependencies:', error.message);
    }
  }

  isUnusedDependency(depName) {
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}',
      '*.{ts,tsx,js,jsx}',
      '*.json',
      '*.md'
    ];

    for (const pattern of patterns) {
      const files = glob.sync(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
          
          // Check for various import patterns
          const importPatterns = [
            new RegExp(`import.*from\\s+['"]${depName}['"]`, 'g'),
            new RegExp(`import\\s+['"]${depName}['"]`, 'g'),
            new RegExp(`require\\s*\\(\\s*['"]${depName}['"]\\s*\\)`, 'g'),
            new RegExp(`from\\s+['"]${depName}['"]`, 'g'),
            new RegExp(`['"]${depName}['"]`, 'g')
          ];

          for (const pattern of importPatterns) {
            if (pattern.test(content)) {
              return false;
            }
          }
        } catch (error) {
          // Ignore errors
        }
      }
    }

    return true;
  }

  async findDeadImports() {
    console.log('  🔗 Finding dead imports...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        const deadImports = this.findDeadImportsInFile(file);
        this.deadImports.push(...deadImports);
      }
    }
  }

  findDeadImportsInFile(file) {
    const deadImports = [];
    
    try {
      const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
      
      // Extract imports
      const importRegex = /import\s+(?:{[^}]*}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        
        // Skip external dependencies
        if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
          continue;
        }
        
        // Resolve import path
        const resolvedPath = this.resolveImportPath(file, importPath);
        
        if (resolvedPath && !fs.existsSync(path.join(this.projectRoot, resolvedPath))) {
          deadImports.push({
            file,
            import: importPath,
            resolved: resolvedPath,
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    return deadImports;
  }

  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    
    if (importPath.startsWith('@/')) {
      const aliasPath = importPath.replace('@/', 'src/');
      return path.resolve(this.projectRoot, aliasPath);
    } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return path.resolve(fromDir, importPath);
    } else if (importPath.startsWith('/')) {
      return path.resolve(this.projectRoot, importPath);
    }
    
    return null;
  }

  async findOrphanedFiles() {
    console.log('  👻 Finding orphaned files...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx,css,scss,json}',
      'app/**/*.{ts,tsx,js,jsx,css,scss,json}',
      'pages/**/*.{ts,tsx,js,jsx,css,scss,json}',
      'components/**/*.{ts,tsx,js,jsx,css,scss,json}'
    ];

    const allFiles = new Set();
    
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      files.forEach(file => allFiles.add(file));
    }

    for (const file of allFiles) {
      if (this.isOrphanedFile(file, allFiles)) {
        this.orphanedFiles.push({
          file,
          reason: 'No references found',
          size: this.getFileSize(file),
          lastModified: this.getLastModified(file)
        });
      }
    }
  }

  isOrphanedFile(file, allFiles) {
    // Skip certain files that are always needed
    if (this.isAlwaysNeededFile(file)) {
      return false;
    }

    // Check if file is referenced by any other file
    for (const otherFile of allFiles) {
      if (otherFile === file) continue;
      
      if (this.isFileReferencedBy(otherFile, file)) {
        return false;
      }
    }

    return true;
  }

  isFileReferencedBy(referencingFile, referencedFile) {
    try {
      const content = fs.readFileSync(path.join(this.projectRoot, referencingFile), 'utf8');
      const referencedFileName = path.basename(referencedFile);
      
      return content.includes(referencedFileName);
    } catch (error) {
      return false;
    }
  }

  async findDuplicateFiles() {
    console.log('  🔄 Finding duplicate files...');
    
    const fileHashes = new Map();
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        const hash = this.getFileHash(file);
        
        if (fileHashes.has(hash)) {
          const existingFile = fileHashes.get(hash);
          this.duplicateFiles.push({
            original: existingFile,
            duplicate: file,
            hash
          });
        } else {
          fileHashes.set(hash, file);
        }
      }
    }
  }

  getFileHash(file) {
    try {
      const content = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
      // Simple hash function
      let hash = 0;
      for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString();
    } catch (error) {
      return '0';
    }
  }

  async findLargeFiles() {
    console.log('  📏 Finding large files...');
    
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
        const size = this.getFileSize(file);
        
        // Consider files larger than 100KB as large
        if (size > 100 * 1024) {
          this.largeFiles.push({
            file,
            size,
            sizeFormatted: this.formatFileSize(size),
            lastModified: this.getLastModified(file)
          });
        }
      }
    }

    // Sort by size (largest first)
    this.largeFiles.sort((a, b) => b.size - a.size);
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  getSummary() {
    return {
      totalDeadFiles: this.deadFiles.length,
      totalUnusedDependencies: this.unusedDependencies.length,
      totalDeadImports: this.deadImports.length,
      totalOrphanedFiles: this.orphanedFiles.length,
      totalDuplicateFiles: this.duplicateFiles.length,
      totalLargeFiles: this.largeFiles.length,
      estimatedSpaceSaved: this.calculateSpaceSaved()
    };
  }

  calculateSpaceSaved() {
    let totalSize = 0;
    
    // Add dead files size
    this.deadFiles.forEach(file => totalSize += file.size);
    
    // Add orphaned files size
    this.orphanedFiles.forEach(file => totalSize += file.size);
    
    // Add duplicate files size (half, since we keep one copy)
    this.duplicateFiles.forEach(file => {
      totalSize += this.getFileSize(file.duplicate) / 2;
    });
    
    return this.formatFileSize(totalSize);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const identifier = new DeadFilesIdentifier(projectRoot);
  
  identifier.identify().then(result => {
    console.log('\n📊 Dead Files Analysis Results:');
    console.log('================================');
    console.log(`Dead files: ${result.summary.totalDeadFiles}`);
    console.log(`Unused dependencies: ${result.summary.totalUnusedDependencies}`);
    console.log(`Dead imports: ${result.summary.totalDeadImports}`);
    console.log(`Orphaned files: ${result.summary.totalOrphanedFiles}`);
    console.log(`Duplicate files: ${result.summary.totalDuplicateFiles}`);
    console.log(`Large files: ${result.summary.totalLargeFiles}`);
    console.log(`Estimated space saved: ${result.summary.estimatedSpaceSaved}`);
    
    // Write results to file
    fs.writeFileSync(
      path.join(__dirname, '.smart-cleaner-candidates.json'),
      JSON.stringify(result, null, 2)
    );
    
    console.log('\n✅ Results saved to .smart-cleaner-candidates.json');
  }).catch(error => {
    console.error('Error identifying dead files:', error);
    process.exit(1);
  });
}

export default DeadFilesIdentifier;
