import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import Paths Updater Codemod
 * Updates import paths after file reorganization
 */

class ImportPathsUpdater {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.changes = [];
    this.dryRun = true;
    this.fileMap = new Map();
  }

  async updateImportPaths(options = {}) {
    const {
      dryRun = true,
      fileMap = {},
      patterns = [
        'src/**/*.{ts,tsx,js,jsx}',
        'app/**/*.{ts,tsx,js,jsx}',
        'pages/**/*.{ts,tsx,js,jsx}',
        'components/**/*.{ts,tsx,js,jsx}',
      ],
    } = options;

    this.dryRun = dryRun;
    this.fileMap = new Map(Object.entries(fileMap));

    console.log(
      `🔗 Updating import paths (${dryRun ? 'DRY RUN' : 'APPLYING CHANGES'})...`
    );

    // Build file mapping from actual file system
    await this.buildFileMapping();

    // Process all files
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });

      for (const file of files) {
        await this.updateFileImports(file);
      }
    }

    return {
      changes: this.changes,
      summary: this.getSummary(),
    };
  }

  async buildFileMapping() {
    console.log('  📋 Building file mapping...');

    const patterns = [
      'src/**/*.{ts,tsx,js,jsx}',
      'app/**/*.{ts,tsx,js,jsx}',
      'pages/**/*.{ts,tsx,js,jsx}',
      'components/**/*.{ts,tsx,js,jsx}',
    ];

    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });

      for (const file of files) {
        const filePath = path.join(this.projectRoot, file);

        if (fs.existsSync(filePath)) {
          // Map file without extension to actual file
          const baseName = path.basename(file, path.extname(file));
          const dirName = path.dirname(file);
          const key = path.join(dirName, baseName);

          this.fileMap.set(key, file);
          this.fileMap.set(file, file);
        }
      }
    }
  }

  async updateFileImports(file) {
    const filePath = path.join(this.projectRoot, file);

    if (!fs.existsSync(filePath)) {
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const updatedContent = this.updateImportsInContent(content, file);

      if (updatedContent !== content) {
        const change = {
          file: file,
          originalContent: content,
          updatedContent: updatedContent,
          changes: this.getChanges(content, updatedContent),
          timestamp: new Date().toISOString(),
        };

        this.changes.push(change);

        if (this.dryRun) {
          console.log(`  📝 Would update imports in: ${file}`);
        } else {
          fs.writeFileSync(filePath, updatedContent);
          console.log(`  ✅ Updated imports in: ${file}`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${file}:`, error.message);
    }
  }

  updateImportsInContent(content, currentFile) {
    let updatedContent = content;

    // Update various import patterns
    updatedContent = this.updateImportStatements(updatedContent, currentFile);
    updatedContent = this.updateRequireStatements(updatedContent, currentFile);
    updatedContent = this.updateDynamicImports(updatedContent, currentFile);

    return updatedContent;
  }

  updateImportStatements(content, currentFile) {
    // Match import statements
    const importRegex =
      /import\s+(?:{[^}]*}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;

    return content.replace(importRegex, (match, importPath) => {
      const updatedPath = this.resolveImportPath(importPath, currentFile);

      if (updatedPath !== importPath) {
        return match.replace(importPath, updatedPath);
      }

      return match;
    });
  }

  updateRequireStatements(content, currentFile) {
    // Match require statements
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    return content.replace(requireRegex, (match, importPath) => {
      const updatedPath = this.resolveImportPath(importPath, currentFile);

      if (updatedPath !== importPath) {
        return match.replace(importPath, updatedPath);
      }

      return match;
    });
  }

  updateDynamicImports(content, currentFile) {
    // Match dynamic imports
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

    return content.replace(dynamicImportRegex, (match, importPath) => {
      const updatedPath = this.resolveImportPath(importPath, currentFile);

      if (updatedPath !== importPath) {
        return match.replace(importPath, updatedPath);
      }

      return match;
    });
  }

  resolveImportPath(importPath, currentFile) {
    // Skip external dependencies
    if (
      !importPath.startsWith('.') &&
      !importPath.startsWith('/') &&
      !importPath.startsWith('@/')
    ) {
      return importPath;
    }

    // Handle alias imports
    if (importPath.startsWith('@/')) {
      return this.resolveAliasImport(importPath);
    }

    // Handle relative imports
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return this.resolveRelativeImport(importPath, currentFile);
    }

    // Handle absolute imports
    if (importPath.startsWith('/')) {
      return this.resolveAbsoluteImport(importPath);
    }

    return importPath;
  }

  resolveAliasImport(importPath) {
    // Convert @/ to src/
    const aliasPath = importPath.replace('@/', 'src/');

    // Check if file exists
    const filePath = path.join(this.projectRoot, aliasPath);

    if (fs.existsSync(filePath)) {
      return aliasPath;
    }

    // Try with extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];

    for (const ext of extensions) {
      const pathWithExt = aliasPath + ext;
      const filePathWithExt = path.join(this.projectRoot, pathWithExt);

      if (fs.existsSync(filePathWithExt)) {
        return pathWithExt;
      }
    }

    return importPath;
  }

  resolveRelativeImport(importPath, currentFile) {
    const currentDir = path.dirname(currentFile);
    const resolvedPath = path.resolve(currentDir, importPath);
    const relativePath = path.relative(this.projectRoot, resolvedPath);

    // Check if file exists
    const filePath = path.join(this.projectRoot, relativePath);

    if (fs.existsSync(filePath)) {
      return relativePath;
    }

    // Try with extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];

    for (const ext of extensions) {
      const pathWithExt = relativePath + ext;
      const filePathWithExt = path.join(this.projectRoot, pathWithExt);

      if (fs.existsSync(filePathWithExt)) {
        return pathWithExt;
      }
    }

    // Try to find the file in the file map
    const baseName = path.basename(relativePath, path.extname(relativePath));
    const dirName = path.dirname(relativePath);
    const key = path.join(dirName, baseName);

    if (this.fileMap.has(key)) {
      return this.fileMap.get(key);
    }

    return importPath;
  }

  resolveAbsoluteImport(importPath) {
    // Remove leading slash
    const relativePath = importPath.substring(1);
    const filePath = path.join(this.projectRoot, relativePath);

    if (fs.existsSync(filePath)) {
      return relativePath;
    }

    // Try with extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];

    for (const ext of extensions) {
      const pathWithExt = relativePath + ext;
      const filePathWithExt = path.join(this.projectRoot, pathWithExt);

      if (fs.existsSync(filePathWithExt)) {
        return pathWithExt;
      }
    }

    return importPath;
  }

  getChanges(originalContent, updatedContent) {
    const changes = [];
    const originalLines = originalContent.split('\n');
    const updatedLines = updatedContent.split('\n');

    for (
      let i = 0;
      i < Math.max(originalLines.length, updatedLines.length);
      i++
    ) {
      const originalLine = originalLines[i] || '';
      const updatedLine = updatedLines[i] || '';

      if (originalLine !== updatedLine) {
        changes.push({
          line: i + 1,
          original: originalLine,
          updated: updatedLine,
        });
      }
    }

    return changes;
  }

  getSummary() {
    return {
      totalChanges: this.changes.length,
      filesModified: this.changes.length,
      totalLinesChanged: this.changes.reduce(
        (sum, change) => sum + change.changes.length,
        0
      ),
    };
  }
}

// Main execution
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1] === fileURLToPath(import.meta.url)
) {
  const projectRoot = process.argv[2] || process.cwd();
  const dryRun = !process.argv.includes('--apply');
  const updater = new ImportPathsUpdater(projectRoot);

  updater
    .updateImportPaths({ dryRun })
    .then(result => {
      console.log('\n📊 Import Path Update Summary:');
      console.log('==============================');
      console.log(`Total changes: ${result.summary.totalChanges}`);
      console.log(`Files modified: ${result.summary.filesModified}`);
      console.log(`Total lines changed: ${result.summary.totalLinesChanged}`);

      if (dryRun) {
        console.log(
          '\n💡 This was a dry run. Use --apply to make actual changes.'
        );
      } else {
        console.log('\n✅ Import paths updated successfully!');
      }
    })
    .catch(error => {
      console.error('Error updating import paths:', error);
      process.exit(1);
    });
}

export default ImportPathsUpdater;
