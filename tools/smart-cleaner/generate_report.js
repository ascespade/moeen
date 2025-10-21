import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Report Generator
 * Generates comprehensive reports for the Smart Cleaner operations
 */


class ReportGenerator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.reportData = {
      timestamp: new Date().toISOString(),
      projectRoot: projectRoot,
      operations: [],
      statistics: {},
      recommendations: [],
      issues: []
    };
  }

  async generateReport() {
    console.log('📊 Generating comprehensive report...');
    
    await this.collectOperationData();
    await this.calculateStatistics();
    await this.generateRecommendations();
    await this.identifyIssues();
    
    const report = this.formatReport();
    
    // Write JSON report
    const jsonReportPath = path.join(this.projectRoot, 'cleanup-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(this.reportData, null, 2));
    
    // Write Markdown report
    const mdReportPath = path.join(this.projectRoot, 'cleanup-report.md');
    fs.writeFileSync(mdReportPath, report);
    
    console.log(`✅ Report generated:`);
    console.log(`  JSON: ${jsonReportPath}`);
    console.log(`  Markdown: ${mdReportPath}`);
    
    return {
      json: jsonReportPath,
      markdown: mdReportPath,
      data: this.reportData
    };
  }

  async collectOperationData() {
    console.log('  📋 Collecting operation data...');
    
    // Load dependency graph data
    const dependencyGraphPath = path.join(__dirname, 'dependency_graph.json');
    if (fs.existsSync(dependencyGraphPath)) {
      const dependencyData = JSON.parse(fs.readFileSync(dependencyGraphPath, 'utf8'));
      this.reportData.dependencyGraph = dependencyData;
    }
    
    // Load candidates data
    const candidatesPath = path.join(__dirname, '.smart-cleaner-candidates.json');
    if (fs.existsSync(candidatesPath)) {
      const candidatesData = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
      this.reportData.candidates = candidatesData;
    }
    
    // Load rollback data
    const rollbackPath = path.join(__dirname, '.rollback-data.json');
    if (fs.existsSync(rollbackPath)) {
      const rollbackData = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
      this.reportData.rollbackData = rollbackData;
    }
    
    // Load project analysis
    const analysisPath = path.join(__dirname, '.project_analysis.json');
    if (fs.existsSync(analysisPath)) {
      const analysisData = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
      this.reportData.projectAnalysis = analysisData;
    }
  }

  async calculateStatistics() {
    console.log('  📈 Calculating statistics...');
    
    const stats = {
      files: {
        total: 0,
        removed: 0,
        moved: 0,
        modified: 0
      },
      dependencies: {
        total: 0,
        removed: 0,
        unused: 0
      },
      imports: {
        total: 0,
        fixed: 0,
        dead: 0
      },
      space: {
        saved: 0,
        savedFormatted: '0 Bytes'
      },
      time: {
        startTime: this.reportData.timestamp,
        endTime: new Date().toISOString(),
        duration: 0
      }
    };
    
    // Calculate file statistics
    if (this.reportData.candidates) {
      stats.files.removed = this.reportData.candidates.deadFiles?.length || 0;
      stats.files.removed += this.reportData.candidates.orphanedFiles?.length || 0;
      stats.files.removed += this.reportData.candidates.duplicateFiles?.length || 0;
      
      stats.dependencies.removed = this.reportData.candidates.unusedDependencies?.length || 0;
      stats.imports.dead = this.reportData.candidates.deadImports?.length || 0;
      
      // Calculate space saved
      let spaceSaved = 0;
      if (this.reportData.candidates.deadFiles) {
        spaceSaved += this.reportData.candidates.deadFiles.reduce((sum, file) => sum + (file.size || 0), 0);
      }
      if (this.reportData.candidates.orphanedFiles) {
        spaceSaved += this.reportData.candidates.orphanedFiles.reduce((sum, file) => sum + (file.size || 0), 0);
      }
      if (this.reportData.candidates.duplicateFiles) {
        spaceSaved += this.reportData.candidates.duplicateFiles.reduce((sum, file) => sum + (file.size || 0), 0) / 2;
      }
      
      stats.space.saved = spaceSaved;
      stats.space.savedFormatted = this.formatFileSize(spaceSaved);
    }
    
    // Calculate dependency statistics
    if (this.reportData.dependencyGraph) {
      stats.files.total = this.reportData.dependencyGraph.stats?.totalFiles || 0;
      stats.imports.total = this.reportData.dependencyGraph.stats?.totalImports || 0;
      stats.dependencies.total = Object.keys(this.reportData.dependencyGraph.stats || {}).length;
    }
    
    // Calculate time duration
    const startTime = new Date(this.reportData.timestamp);
    const endTime = new Date();
    stats.time.duration = Math.round((endTime - startTime) / 1000); // seconds
    
    this.reportData.statistics = stats;
  }

  async generateRecommendations() {
    console.log('  💡 Generating recommendations...');
    
    const recommendations = [];
    
    // File organization recommendations
    if (this.reportData.candidates?.deadFiles?.length > 0) {
      recommendations.push({
        type: 'file_organization',
        priority: 'high',
        title: 'Remove Dead Files',
        description: `Found ${this.reportData.candidates.deadFiles.length} dead files that can be safely removed`,
        action: 'Run smart_clean.sh --apply to remove dead files',
        impact: 'Reduces project size and improves maintainability'
      });
    }
    
    // Dependency recommendations
    if (this.reportData.candidates?.unusedDependencies?.length > 0) {
      recommendations.push({
        type: 'dependencies',
        priority: 'medium',
        title: 'Remove Unused Dependencies',
        description: `Found ${this.reportData.candidates.unusedDependencies.length} unused dependencies`,
        action: 'Remove unused dependencies from package.json',
        impact: 'Reduces bundle size and security surface'
      });
    }
    
    // Import recommendations
    if (this.reportData.candidates?.deadImports?.length > 0) {
      recommendations.push({
        type: 'imports',
        priority: 'medium',
        title: 'Fix Dead Imports',
        description: `Found ${this.reportData.candidates.deadImports.length} dead imports`,
        action: 'Run fix_imports.sh to fix import paths',
        impact: 'Improves code quality and prevents runtime errors'
      });
    }
    
    // Structure recommendations
    if (this.reportData.projectAnalysis?.type === 'nextjs') {
      recommendations.push({
        type: 'structure',
        priority: 'low',
        title: 'Optimize Next.js Structure',
        description: 'Consider organizing components by feature',
        action: 'Use Next.js App Router best practices',
        impact: 'Improves code organization and maintainability'
      });
    }
    
    // Performance recommendations
    if (this.reportData.candidates?.largeFiles?.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        title: 'Optimize Large Files',
        description: `Found ${this.reportData.candidates.largeFiles.length} large files`,
        action: 'Consider splitting large files into smaller modules',
        impact: 'Improves build performance and maintainability'
      });
    }
    
    this.reportData.recommendations = recommendations;
  }

  async identifyIssues() {
    console.log('  ⚠️  Identifying issues...');
    
    const issues = [];
    
    // Check for circular dependencies
    if (this.reportData.dependencyGraph?.circularDependencies?.length > 0) {
      issues.push({
        type: 'circular_dependency',
        severity: 'high',
        title: 'Circular Dependencies Detected',
        description: 'Found circular dependencies that can cause issues',
        files: this.reportData.dependencyGraph.circularDependencies,
        solution: 'Refactor code to break circular dependencies'
      });
    }
    
    // Check for missing dependencies
    if (this.reportData.candidates?.deadImports?.length > 0) {
      issues.push({
        type: 'missing_dependencies',
        severity: 'medium',
        title: 'Missing Dependencies',
        description: 'Found imports that reference non-existent files',
        count: this.reportData.candidates.deadImports.length,
        solution: 'Fix import paths or remove unused imports'
      });
    }
    
    // Check for security issues
    if (this.reportData.candidates?.unusedDependencies?.length > 0) {
      issues.push({
        type: 'security',
        severity: 'low',
        title: 'Unused Dependencies',
        description: 'Unused dependencies increase security surface',
        count: this.reportData.candidates.unusedDependencies.length,
        solution: 'Remove unused dependencies from package.json'
      });
    }
    
    this.reportData.issues = issues;
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatReport() {
    const stats = this.reportData.statistics;
    const recommendations = this.reportData.recommendations;
    const issues = this.reportData.issues;
    
    let report = `# Smart Cleaner Report\n\n`;
    report += `**Generated:** ${new Date(this.reportData.timestamp).toLocaleString()}\n`;
    report += `**Project:** ${this.reportData.projectRoot}\n\n`;
    
    // Executive Summary
    report += `## Executive Summary\n\n`;
    report += `The Smart Cleaner has analyzed your project and identified opportunities for improvement.\n\n`;
    report += `- **Files removed:** ${stats.files.removed}\n`;
    report += `- **Dependencies removed:** ${stats.dependencies.removed}\n`;
    report += `- **Space saved:** ${stats.space.savedFormatted}\n`;
    report += `- **Dead imports fixed:** ${stats.imports.dead}\n\n`;
    
    // Statistics
    report += `## Statistics\n\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total files analyzed | ${stats.files.total} |\n`;
    report += `| Files removed | ${stats.files.removed} |\n`;
    report += `| Dependencies removed | ${stats.dependencies.removed} |\n`;
    report += `| Dead imports found | ${stats.imports.dead} |\n`;
    report += `| Space saved | ${stats.space.savedFormatted} |\n`;
    report += `| Processing time | ${stats.time.duration}s |\n\n`;
    
    // Recommendations
    if (recommendations.length > 0) {
      report += `## Recommendations\n\n`;
      
      for (const rec of recommendations) {
        const priorityIcon = rec.priority === 'high' ? '🔴' : 
                           rec.priority === 'medium' ? '🟡' : '🟢';
        
        report += `### ${priorityIcon} ${rec.title}\n\n`;
        report += `**Priority:** ${rec.priority.toUpperCase()}\n\n`;
        report += `**Description:** ${rec.description}\n\n`;
        report += `**Action:** ${rec.action}\n\n`;
        report += `**Impact:** ${rec.impact}\n\n`;
      }
    }
    
    // Issues
    if (issues.length > 0) {
      report += `## Issues Found\n\n`;
      
      for (const issue of issues) {
        const severityIcon = issue.severity === 'high' ? '🔴' : 
                            issue.severity === 'medium' ? '🟡' : '🟢';
        
        report += `### ${severityIcon} ${issue.title}\n\n`;
        report += `**Severity:** ${issue.severity.toUpperCase()}\n\n`;
        report += `**Description:** ${issue.description}\n\n`;
        report += `**Solution:** ${issue.solution}\n\n`;
        
        if (issue.files) {
          report += `**Files affected:**\n`;
          for (const file of issue.files) {
            report += `- ${file}\n`;
          }
          report += `\n`;
        }
        
        if (issue.count) {
          report += `**Count:** ${issue.count}\n\n`;
        }
      }
    }
    
    // Next Steps
    report += `## Next Steps\n\n`;
    report += `1. **Review the recommendations** above and prioritize based on your needs\n`;
    report += `2. **Apply changes** by running \`tools/smart-cleaner/smart_clean.sh --apply\`\n`;
    report += `3. **Fix imports** by running \`tools/smart-cleaner/fix_imports.sh\`\n`;
    report += `4. **Test your application** to ensure everything works correctly\n`;
    report += `5. **Commit changes** if satisfied with the results\n\n`;
    
    // Rollback Information
    report += `## Rollback Information\n\n`;
    report += `If you need to rollback changes:\n\n`;
    report += `\`\`\`bash\n`;
    report += `# List available rollback points\n`;
    report += `node tools/smart-cleaner/rollback_manager.js list\n\n`;
    report += `# Rollback to a specific point\n`;
    report += `node tools/smart-cleaner/rollback_manager.js rollback <rollback-id>\n`;
    report += `\`\`\`\n\n`;
    
    // Footer
    report += `---\n\n`;
    report += `*Report generated by Smart Cleaner v1.0.0*\n`;
    
    return report;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const projectRoot = process.argv[2] || process.cwd();
  const generator = new ReportGenerator(projectRoot);
  
  generator.generateReport().then(result => {
    console.log('\n📊 Report Generation Complete!');
    console.log('==============================');
    console.log(`JSON Report: ${result.json}`);
    console.log(`Markdown Report: ${result.markdown}`);
    
    // Show summary
    const stats = result.data.statistics;
    console.log('\n📈 Summary:');
    console.log(`Files removed: ${stats.files.removed}`);
    console.log(`Dependencies removed: ${stats.dependencies.removed}`);
    console.log(`Space saved: ${stats.space.savedFormatted}`);
    console.log(`Recommendations: ${result.data.recommendations.length}`);
    console.log(`Issues found: ${result.data.issues.length}`);
  }).catch(error => {
    console.error('Error generating report:', error);
    process.exit(1);
  });
}

export default ReportGenerator;
