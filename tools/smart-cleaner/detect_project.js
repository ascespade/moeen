#!/usr/bin/env node

/**
 * Project Type Detection Module
 * Detects the type of project and its configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectDetector {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.projectType = 'unknown';
    this.frameworks = [];
    this.tools = [];
    this.config = {};
  }

  detect() {
    console.log('🔍 Detecting project type...');
    
    this.detectPackageManager();
    this.detectFrameworks();
    this.detectTools();
    this.detectConfig();
    
    return {
      type: this.projectType,
      frameworks: this.frameworks,
      tools: this.tools,
      config: this.config,
      root: this.projectRoot
    };
  }

  detectPackageManager() {
    const packageFiles = ['package.json', 'yarn.lock', 'pnpm-lock.yaml', 'package-lock.json'];
    
    for (const file of packageFiles) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        if (file === 'yarn.lock') {
          this.tools.push('yarn');
        } else if (file === 'pnpm-lock.yaml') {
          this.tools.push('pnpm');
        } else if (file === 'package-lock.json') {
          this.tools.push('npm');
        }
      }
    }
  }

  detectFrameworks() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Detect frameworks
      if (dependencies.next) {
        this.projectType = 'nextjs';
        this.frameworks.push('Next.js');
      } else if (dependencies.react) {
        this.projectType = 'react';
        this.frameworks.push('React');
      } else if (dependencies.vue) {
        this.projectType = 'vue';
        this.frameworks.push('Vue.js');
      } else if (dependencies.angular) {
        this.projectType = 'angular';
        this.frameworks.push('Angular');
      } else if (dependencies.svelte) {
        this.projectType = 'svelte';
        this.frameworks.push('Svelte');
      }

      // Detect additional tools
      if (dependencies.typescript) {
        this.tools.push('TypeScript');
      }
      if (dependencies.tailwindcss) {
        this.tools.push('Tailwind CSS');
      }
      if (dependencies['@supabase/supabase-js']) {
        this.tools.push('Supabase');
      }
      if (dependencies.stripe) {
        this.tools.push('Stripe');
      }
      if (dependencies['@playwright/test']) {
        this.tools.push('Playwright');
      }
      if (dependencies.vitest) {
        this.tools.push('Vitest');
      }
      if (dependencies.jest) {
        this.tools.push('Jest');
      }

      this.config.packageJson = packageJson;
    } catch (error) {
      console.error('Error reading package.json:', error.message);
    }
  }

  detectTools() {
    // Detect TypeScript
    if (fs.existsSync(path.join(this.projectRoot, 'tsconfig.json'))) {
      this.tools.push('TypeScript');
      try {
        this.config.tsconfig = JSON.parse(
          fs.readFileSync(path.join(this.projectRoot, 'tsconfig.json'), 'utf8')
        );
      } catch (error) {
        console.error('Error reading tsconfig.json:', error.message);
      }
    }

    // Detect ESLint
    const eslintConfigs = [
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yaml',
      '.eslintrc.yml',
      'eslint.config.js'
    ];
    
    for (const config of eslintConfigs) {
      if (fs.existsSync(path.join(this.projectRoot, config))) {
        this.tools.push('ESLint');
        break;
      }
    }

    // Detect Prettier
    const prettierConfigs = [
      '.prettierrc',
      '.prettierrc.js',
      '.prettierrc.json',
      '.prettierrc.yaml',
      '.prettierrc.yml',
      'prettier.config.js'
    ];
    
    for (const config of prettierConfigs) {
      if (fs.existsSync(path.join(this.projectRoot, config))) {
        this.tools.push('Prettier');
        break;
      }
    }

    // Detect Tailwind
    if (fs.existsSync(path.join(this.projectRoot, 'tailwind.config.js')) ||
        fs.existsSync(path.join(this.projectRoot, 'tailwind.config.ts')) ||
        fs.existsSync(path.join(this.projectRoot, 'tailwind.config.cjs'))) {
      this.tools.push('Tailwind CSS');
    }

    // Detect Next.js config
    if (fs.existsSync(path.join(this.projectRoot, 'next.config.js')) ||
        fs.existsSync(path.join(this.projectRoot, 'next.config.ts'))) {
      this.tools.push('Next.js Config');
    }

    // Detect Docker
    if (fs.existsSync(path.join(this.projectRoot, 'Dockerfile')) ||
        fs.existsSync(path.join(this.projectRoot, 'docker-compose.yml'))) {
      this.tools.push('Docker');
    }

    // Detect GitHub Actions
    if (fs.existsSync(path.join(this.projectRoot, '.github/workflows'))) {
      this.tools.push('GitHub Actions');
    }
  }

  detectConfig() {
    // Detect src directory structure
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      this.config.hasSrcDir = true;
      this.config.srcStructure = this.analyzeDirectoryStructure(srcPath);
    }

    // Detect app directory (Next.js 13+)
    const appPath = path.join(this.projectRoot, 'src/app');
    if (fs.existsSync(appPath)) {
      this.config.hasAppDir = true;
      this.config.appStructure = this.analyzeDirectoryStructure(appPath);
    }

    // Detect pages directory (Next.js 12 and below)
    const pagesPath = path.join(this.projectRoot, 'src/pages');
    if (fs.existsSync(pagesPath)) {
      this.config.hasPagesDir = true;
      this.config.pagesStructure = this.analyzeDirectoryStructure(pagesPath);
    }

    // Detect components directory
    const componentsPath = path.join(this.projectRoot, 'src/components');
    if (fs.existsSync(componentsPath)) {
      this.config.hasComponentsDir = true;
      this.config.componentsStructure = this.analyzeDirectoryStructure(componentsPath);
    }
  }

  analyzeDirectoryStructure(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
      return { type: 'max_depth_reached' };
    }

    try {
      const items = fs.readdirSync(dirPath);
      const structure = {
        files: [],
        directories: {}
      };

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          structure.directories[item] = this.analyzeDirectoryStructure(
            itemPath,
            maxDepth,
            currentDepth + 1
          );
        } else {
          structure.files.push(item);
        }
      }

      return structure;
    } catch (error) {
      return { error: error.message };
    }
  }

  getRecommendations() {
    const recommendations = [];

    if (this.projectType === 'nextjs') {
      recommendations.push('Use Next.js App Router structure');
      recommendations.push('Organize components by feature');
      recommendations.push('Use TypeScript for type safety');
    }

    if (this.tools.includes('TypeScript')) {
      recommendations.push('Enable strict TypeScript settings');
      recommendations.push('Use path aliases for imports');
    }

    if (this.tools.includes('ESLint')) {
      recommendations.push('Configure ESLint rules for consistency');
      recommendations.push('Use ESLint plugins for React/Next.js');
    }

    return recommendations;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const detector = new ProjectDetector(projectRoot);
  const result = detector.detect();
  
  console.log('\n📊 Project Analysis Results:');
  console.log('============================');
  console.log(`Project Type: ${result.type}`);
  console.log(`Frameworks: ${result.frameworks.join(', ') || 'None detected'}`);
  console.log(`Tools: ${result.tools.join(', ') || 'None detected'}`);
  console.log(`Has src/ directory: ${result.config.hasSrcDir || false}`);
  console.log(`Has app/ directory: ${result.config.hasAppDir || false}`);
  console.log(`Has pages/ directory: ${result.config.hasPagesDir || false}`);
  console.log(`Has components/ directory: ${result.config.hasComponentsDir || false}`);
  
  const recommendations = detector.getRecommendations();
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
  
  // Write result to file for other scripts
  fs.writeFileSync(
    path.join(__dirname, '.project_analysis.json'),
    JSON.stringify(result, null, 2)
  );
}

export default ProjectDetector;
