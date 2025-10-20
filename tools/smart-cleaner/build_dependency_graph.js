import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DependencyGraphBuilder {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.dependencyGraph = new Map();
    this.fileDependencies = new Map();
    this.moduleUsage = new Map();
    this.imports = new Map();
  }

  async build() {
    console.log('🔗 Building dependency graph...');
    
    await this.analyzeImports();
    await this.analyzeExports();
    await this.buildGraph();
    await this.analyzeUsage();
    
    return {
      graph: Object.fromEntries(this.dependencyGraph),
      fileDependencies: Object.fromEntries(this.fileDependencies),
      moduleUsage: Object.fromEntries(this.moduleUsage),
      imports: Object.fromEntries(this.imports),
      stats: this.getStats()
    };
  }

  async analyzeImports() {
    console.log('  📥 Analyzing imports...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        const filePath = path.join(this.projectRoot, file);
        const imports = this.extractImports(filePath);
        
        if (imports.length > 0) {
          this.imports.set(file, imports);
        }
      }
    }
  }

  extractImports(filePath) {
    const imports = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Match various import patterns
      const importRegexes = [
        /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
        /import\s+['"]([^'"]+)['"]/g,
        /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
        /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
      ];

      for (const regex of importRegexes) {
        let match;
        while ((match = regex.exec(content)) !== null) {
          const importPath = match[1];
          
          // Skip node_modules imports
          if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
            continue;
          }
          
          imports.push({
            path: importPath,
            type: this.getImportType(importPath),
            resolved: this.resolveImportPath(filePath, importPath)
          });
        }
      }
    } catch (error) {
      console.warn(`Error reading file ${filePath}:`, error.message);
    }
    
    return imports;
  }

  getImportType(importPath) {
    if (importPath.startsWith('@/')) {
      return 'alias';
    } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return 'relative';
    } else if (importPath.startsWith('/')) {
      return 'absolute';
    } else {
      return 'external';
    }
  }

  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    
    if (importPath.startsWith('@/')) {
      // Handle alias imports
      const aliasPath = importPath.replace('@/', 'src/');
      return path.resolve(this.projectRoot, aliasPath);
    } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
      // Handle relative imports
      return path.resolve(fromDir, importPath);
    } else if (importPath.startsWith('/')) {
      // Handle absolute imports
      return path.resolve(this.projectRoot, importPath);
    }
    
    return null;
  }

  async analyzeExports() {
    console.log('  📤 Analyzing exports...');
    
    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}'
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      
      for (const file of files) {
        const filePath = path.join(this.projectRoot, file);
        const exports = this.extractExports(filePath);
        
        if (exports.length > 0) {
          this.moduleUsage.set(file, { exports, used: false });
        }
      }
    }
  }

  extractExports(filePath) {
    const exports = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Match various export patterns
      const exportRegexes = [
        /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/g,
        /export\s*\{\s*([^}]+)\s*\}/g,
        /export\s+default\s+/g
      ];

      for (const regex of exportRegexes) {
        let match;
        while ((match = regex.exec(content)) !== null) {
          if (match[1]) {
            // Named exports
            const names = match[1].split(',').map(name => name.trim());
            exports.push(...names);
          } else {
            // Default export
            exports.push('default');
          }
        }
      }
    } catch (error) {
      console.warn(`Error reading file ${filePath}:`, error.message);
    }
    
    return exports;
  }

  async buildGraph() {
    console.log('  🕸️  Building dependency graph...');
    
    // Build file-to-file dependencies
    for (const [file, imports] of this.imports) {
      const dependencies = [];
      
      for (const importInfo of imports) {
        if (importInfo.resolved) {
          const relativePath = path.relative(this.projectRoot, importInfo.resolved);
          dependencies.push(relativePath);
        }
      }
      
      this.fileDependencies.set(file, dependencies);
    }

    // Build module dependency graph
    for (const [file, imports] of this.imports) {
      const moduleDeps = new Set();
      
      for (const importInfo of imports) {
        if (importInfo.type === 'external') {
          moduleDeps.add(importInfo.path);
        }
      }
      
      if (moduleDeps.size > 0) {
        this.dependencyGraph.set(file, Array.from(moduleDeps));
      }
    }
  }

  async analyzeUsage() {
    console.log('  📊 Analyzing usage patterns...');
    
    // Mark modules as used if they're imported
    for (const [file, imports] of this.imports) {
      for (const importInfo of imports) {
        if (importInfo.resolved) {
          const targetFile = path.relative(this.projectRoot, importInfo.resolved);
          
          if (this.moduleUsage.has(targetFile)) {
            this.moduleUsage.get(targetFile).used = true;
          }
        }
      }
    }

    // Analyze circular dependencies
    this.detectCircularDependencies();
  }

  detectCircularDependencies() {
    const visited = new Set();
    const recursionStack = new Set();
    const circularDeps = [];

    const dfs = (file) => {
      visited.add(file);
      recursionStack.add(file);

      const dependencies = this.fileDependencies.get(file) || [];
      
      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          if (dfs(dep)) {
            return true;
          }
        } else if (recursionStack.has(dep)) {
          circularDeps.push([file, dep]);
          return true;
        }
      }

      recursionStack.delete(file);
      return false;
    };

    for (const file of this.fileDependencies.keys()) {
      if (!visited.has(file)) {
        dfs(file);
      }
    }

    if (circularDeps.length > 0) {
      console.warn('⚠️  Circular dependencies detected:', circularDeps);
    }
  }

  getStats() {
    const totalFiles = this.fileDependencies.size;
    const totalImports = Array.from(this.imports.values()).reduce((sum, imports) => sum + imports.length, 0);
    const unusedModules = Array.from(this.moduleUsage.entries())
      .filter(([_, usage]) => !usage.used)
      .map(([file, _]) => file);

    return {
      totalFiles,
      totalImports,
      unusedModules: unusedModules.length,
      unusedModuleFiles: unusedModules,
      averageImportsPerFile: totalFiles > 0 ? (totalImports / totalFiles).toFixed(2) : 0
    };
  }

  getUnusedFiles() {
    return Array.from(this.moduleUsage.entries())
      .filter(([_, usage]) => !usage.used)
      .map(([file, _]) => file);
  }

  getDeadImports() {
    const deadImports = [];
    
    for (const [file, imports] of this.imports) {
      for (const importInfo of imports) {
        if (importInfo.resolved) {
          const targetFile = path.relative(this.projectRoot, importInfo.resolved);
          
          if (!fs.existsSync(path.join(this.projectRoot, targetFile))) {
            deadImports.push({
              file,
              import: importInfo.path,
              target: targetFile
            });
          }
        }
      }
    }
    
    return deadImports;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const builder = new DependencyGraphBuilder(projectRoot);
  
  builder.build().then(result => {
    console.log('\n📈 Dependency Graph Stats:');
    console.log('==========================');
    console.log(`Total files analyzed: ${result.stats.totalFiles}`);
    console.log(`Total imports: ${result.stats.totalImports}`);
    console.log(`Average imports per file: ${result.stats.averageImportsPerFile}`);
    console.log(`Unused modules: ${result.stats.unusedModules}`);
    
    if (result.stats.unusedModuleFiles.length > 0) {
      console.log('\n🗑️  Unused files:');
      result.stats.unusedModuleFiles.forEach(file => console.log(`  • ${file}`));
    }
    
    // Write result to file
    fs.writeFileSync(
      path.join(__dirname, 'dependency_graph.json'),
      JSON.stringify(result, null, 2)
    );
    
    console.log('\n✅ Dependency graph saved to dependency_graph.json');
  }).catch(error => {
    console.error('Error building dependency graph:', error);
    process.exit(1);
  });
}

export default DependencyGraphBuilder;
