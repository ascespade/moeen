#!/usr/bin/env node

/**
 * GitHub Actions Workflow Documentation Generator
 * Creates comprehensive documentation for all workflows
 */

const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { join, dirname } = require('path');
const yaml = require('js-yaml');

const projectRoot = join(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function analyzeWorkflow(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const workflow = yaml.load(content);

  const analysis = {
    name: workflow.name || 'Unnamed Workflow',
    file: filePath.replace(projectRoot + '/', ''),
    triggers: workflow.on || {},
    jobs: {},
    env: workflow.env || {},
    permissions: workflow.permissions || {},
    description: extractDescription(content),
  };

  // Analyze jobs
  for (const [jobName, job] of Object.entries(workflow.jobs || {})) {
    analysis.jobs[jobName] = {
      name: job.name || jobName,
      runsOn: job['runs-on'] || 'ubuntu-latest',
      needs: job.needs || [],
      if: job.if || 'always',
      timeout: job.timeout_minutes || 'default',
      steps: (job.steps || []).map(step => ({
        name: step.name || 'Unnamed step',
        uses: step.uses || null,
        run: step.run || null,
        with: step.with || {},
        env: step.env || {},
        if: step.if || null,
        continueOnError: step.continue_on_error || false,
      })),
    };
  }

  return analysis;
}

function extractDescription(content) {
  // Try to extract description from comments
  const lines = content.split('\n');
  const descriptionLines = [];

  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') && !line.startsWith('##')) {
      descriptionLines.push(line.replace(/^#+\s*/, ''));
    }
  }

  return descriptionLines.join(' ') || 'No description available';
}

function generateWorkflowMarkdown(analysis) {
  const { name, file, triggers, jobs, env, permissions, description } =
    analysis;

  let markdown = `# ${name}\n\n`;
  markdown += `**File:** \`${file}\`\n\n`;
  markdown += `**Description:** ${description}\n\n`;

  // Triggers
  markdown += `## 🚀 Triggers\n\n`;
  for (const [trigger, config] of Object.entries(triggers)) {
    markdown += `- **${trigger}:** \`${JSON.stringify(config)}\`\n`;
  }
  markdown += '\n';

  // Environment Variables
  if (Object.keys(env).length > 0) {
    markdown += `## 🌍 Environment Variables\n\n`;
    for (const [key, value] of Object.entries(env)) {
      markdown += `- **${key}:** \`${value}\`\n`;
    }
    markdown += '\n';
  }

  // Permissions
  if (Object.keys(permissions).length > 0) {
    markdown += `## 🔒 Permissions\n\n`;
    for (const [permission, level] of Object.entries(permissions)) {
      markdown += `- **${permission}:** \`${level}\`\n`;
    }
    markdown += '\n';
  }

  // Jobs
  markdown += `## 📋 Jobs\n\n`;
  for (const [jobName, job] of Object.entries(jobs)) {
    markdown += `### ${job.name}\n\n`;
    markdown += `- **Runs on:** \`${job.runsOn}\`\n`;
    markdown += `- **Needs:** ${Array.isArray(job.needs) && job.needs.length > 0 ? job.needs.map(n => `\`${n}\``).join(', ') : 'None'}\n`;
    markdown += `- **Condition:** \`${job.if}\`\n`;
    markdown += `- **Timeout:** ${job.timeout === 'default' ? 'Default (6 hours)' : `${job.timeout} minutes`}\n`;
    markdown += `- **Steps:** ${job.steps.length}\n\n`;

    // Steps
    markdown += `#### Steps\n\n`;
    job.steps.forEach((step, index) => {
      markdown += `${index + 1}. **${step.name}**\n`;
      if (step.uses) {
        markdown += `   - Uses: \`${step.uses}\`\n`;
      }
      if (step.run) {
        markdown += `   - Run: \`${step.run.split('\n')[0]}${step.run.split('\n').length > 1 ? '...' : ''}\`\n`;
      }
      if (step.if) {
        markdown += `   - Condition: \`${step.if}\`\n`;
      }
      if (step.continueOnError) {
        markdown += `   - Continue on error: Yes\n`;
      }
      markdown += '\n';
    });
  }

  return markdown;
}

function generateOverviewMarkdown(analyses) {
  let markdown = `# 🤖 GitHub Actions Workflows Documentation\n\n`;
  markdown += `This document provides comprehensive documentation for all GitHub Actions workflows in this repository.\n\n`;
  markdown += `**Generated on:** ${new Date().toLocaleString()}\n\n`;

  // Summary
  markdown += `## 📊 Summary\n\n`;
  markdown += `- **Total Workflows:** ${analyses.length}\n`;
  markdown += `- **Total Jobs:** ${analyses.reduce((sum, a) => sum + Object.keys(a.jobs).length, 0)}\n`;
  markdown += `- **Total Steps:** ${analyses.reduce((sum, a) => sum + Object.values(a.jobs).reduce((s, j) => s + j.steps.length, 0), 0)}\n\n`;

  // Workflow List
  markdown += `## 📋 Workflow List\n\n`;
  analyses.forEach((analysis, index) => {
    markdown += `${index + 1}. [${analysis.name}](#${analysis.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}) - \`${analysis.file}\`\n`;
  });
  markdown += '\n';

  // Individual Workflows
  analyses.forEach(analysis => {
    markdown += `---\n\n`;
    markdown += generateWorkflowMarkdown(analysis);
  });

  // Best Practices
  markdown += `---\n\n`;
  markdown += `## 🏆 Best Practices\n\n`;
  markdown += `### ✅ Do's\n`;
  markdown += `- Use explicit permissions for security\n`;
  markdown += `- Set appropriate timeouts for jobs\n`;
  markdown += `- Use caching for dependencies\n`;
  markdown += `- Add error handling with \`continue-on-error\`\n`;
  markdown += `- Use latest action versions\n`;
  markdown += `- Add meaningful step names\n`;
  markdown += `- Use matrix strategies for parallel jobs\n`;
  markdown += `- Clean up artifacts and temporary files\n\n`;

  markdown += `### ❌ Don'ts\n`;
  markdown += `- Don't use deprecated runners (ubuntu-18.04)\n`;
  markdown += `- Don't hardcode secrets in workflows\n`;
  markdown += `- Don't skip error handling\n`;
  markdown += `- Don't use outdated Node.js versions\n`;
  markdown += `- Don't create jobs without timeouts\n`;
  markdown += `- Don't ignore security warnings\n\n`;

  // Troubleshooting
  markdown += `## 🔧 Troubleshooting\n\n`;
  markdown += `### Common Issues\n\n`;
  markdown += `1. **Artifact not found errors**\n`;
  markdown += `   - Check if the artifact was uploaded successfully\n`;
  markdown += `   - Verify artifact names match exactly\n`;
  markdown += `   - Ensure jobs run in correct order\n\n`;

  markdown += `2. **Permission denied errors**\n`;
  markdown += `   - Add explicit permissions to workflow\n`;
  markdown += `   - Check if GITHUB_TOKEN has required permissions\n\n`;

  markdown += `3. **Timeout errors**\n`;
  markdown += `   - Add \`timeout-minutes\` to jobs\n`;
  markdown += `   - Optimize long-running steps\n`;
  markdown += `   - Use caching to speed up builds\n\n`;

  markdown += `4. **Dependency installation failures**\n`;
  markdown += `   - Use \`npm ci\` instead of \`npm install\`\n`;
  markdown += `   - Add caching for node_modules\n`;
  markdown += `   - Check package-lock.json is committed\n\n`;

  return markdown;
}

async function main() {
  log('📚 GitHub Actions Workflow Documentation Generator', 'bright');
  log('='.repeat(50), 'bright');

  const workflowsDir = join(projectRoot, '.github', 'workflows');
  const workflowFiles = readdirSync(workflowsDir)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
    .map(file => join(workflowsDir, file));

  log(`📁 Found ${workflowFiles.length} workflow files`, 'cyan');

  const analyses = workflowFiles.map(file => analyzeWorkflow(file));

  // Generate individual workflow docs
  analyses.forEach(analysis => {
    const markdown = generateWorkflowMarkdown(analysis);
    const docPath = join(
      projectRoot,
      'docs',
      'workflows',
      `${analysis.file.replace('.github/workflows/', '').replace(/\.(yml|yaml)$/, '')}.md`
    );

    // Ensure directory exists
    const { mkdirSync } = require('fs');
    mkdirSync(join(projectRoot, 'docs', 'workflows'), { recursive: true });

    writeFileSync(docPath, markdown);
    log(`✅ Generated docs for ${analysis.name}`, 'green');
  });

  // Generate overview documentation
  const overviewMarkdown = generateOverviewMarkdown(analyses);
  const overviewPath = join(projectRoot, 'docs', 'WORKFLOWS.md');
  writeFileSync(overviewPath, overviewMarkdown);
  log(`✅ Generated overview documentation`, 'green');

  log(`\n📊 Documentation Summary`, 'bright');
  log(`- Individual workflow docs: ${analyses.length}`, 'blue');
  log(`- Overview documentation: 1`, 'blue');
  log(
    `- Total jobs documented: ${analyses.reduce((sum, a) => sum + Object.keys(a.jobs).length, 0)}`,
    'blue'
  );
  log(
    `- Total steps documented: ${analyses.reduce((sum, a) => sum + Object.values(a.jobs).reduce((s, j) => s + j.steps.length, 0), 0)}`,
    'blue'
  );

  log(`\n🎉 Documentation generation completed!`, 'green');
  log(`📁 Check the docs/ directory for generated files`, 'cyan');
}

main().catch(error => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
