#!/usr/bin/env node

/**
 * Final Comprehensive Evaluation
 * ????? ????? ????
 */

import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Final Comprehensive Evaluation...\n');
console.log('='.repeat(70));

const evaluation = {
  structure: { score: 0, maxScore: 100, details: [] },
  organization: { score: 0, maxScore: 100, details: [] },
  cleanCode: { score: 0, maxScore: 100, details: [] },
  centralization: { score: 0, maxScore: 100, details: [] },
  accessibility: { score: 0, maxScore: 100, details: [] },
  ux: { score: 0, maxScore: 100, details: [] },
  design: { score: 0, maxScore: 100, details: [] },
  security: { score: 0, maxScore: 100, details: [] },
  maintainability: { score: 0, maxScore: 100, details: [] },
  errorHandling: { score: 0, maxScore: 100, details: [] },
  performance: { score: 0, maxScore: 100, details: [] },
  speed: { score: 0, maxScore: 100, details: [] },
  marketCompetition: { score: 0, maxScore: 100, details: [] },
};

// 1. Performance Evaluation (23.3% ? target 90%+)
console.log('1??  Evaluating Performance...');
try {
  let perfScore = 0;
  const details = [];

  // Check for revalidate in API routes
  const apiRoutes = await glob('src/app/api/**/route.ts', { cwd: projectRoot });
  const routesWithRevalidate = apiRoutes.filter(f => {
    try {
      const content = readFileSync(join(projectRoot, f), 'utf-8');
      return content.includes('export const revalidate');
    } catch {
      return false;
    }
  }).length;
  
  const revalidateRatio = routesWithRevalidate / apiRoutes.length;
  perfScore += revalidateRatio * 30;
  details.push(`Revalidate: ${routesWithRevalidate}/${apiRoutes.length} (${(revalidateRatio * 100).toFixed(1)}%)`);

  // Check for lazy loading
  const lazyComponents = existsSync(join(projectRoot, 'src/components/lazy/LazyComponents.tsx')) ? 1 : 0;
  perfScore += lazyComponents * 20;
  if (lazyComponents) details.push('LazyComponents system exists');

  // Check next.config.js optimizations
  if (existsSync(join(projectRoot, 'next.config.js'))) {
    const config = readFileSync(join(projectRoot, 'next.config.js'), 'utf-8');
    if (config.includes('compress: true')) {
      perfScore += 15;
      details.push('Compression enabled');
    }
    if (config.includes('swcMinify: true')) {
      perfScore += 15;
      details.push('SWC minify enabled');
    }
    if (config.includes('optimizePackageImports')) {
      perfScore += 10;
      details.push('Package imports optimized');
    }
  }

  // Check for LoadingSkeleton
  const hasLoadingSkeleton = existsSync(join(projectRoot, 'src/components/ui/LoadingSkeleton.tsx'));
  perfScore += hasLoadingSkeleton ? 10 : 0;
  if (hasLoadingSkeleton) details.push('LoadingSkeleton component exists');

  evaluation.performance = { score: perfScore, maxScore: 100, details };
  console.log(`   Score: ${perfScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 2. Accessibility Evaluation (31.5% ? target 90%+)
console.log('2??  Evaluating Accessibility...');
try {
  let a11yScore = 0;
  const details = [];

  // Check for NotificationToast with aria-live
  const hasNotificationToast = existsSync(join(projectRoot, 'src/components/ui/NotificationToast.tsx'));
  if (hasNotificationToast) {
    const content = readFileSync(join(projectRoot, 'src/components/ui/NotificationToast.tsx'), 'utf-8');
    if (content.includes('aria-live')) {
      a11yScore += 25;
      details.push('NotificationToast with aria-live');
    }
  }

  // Check for aria-labels in components
  const componentFiles = await glob('src/components/**/*.tsx', { cwd: projectRoot });
  const filesWithAria = componentFiles.slice(0, 50).filter(f => {
    try {
      const content = readFileSync(join(projectRoot, f), 'utf-8');
      return content.includes('aria-label');
    } catch {
      return false;
    }
  }).length;
  const ariaRatio = filesWithAria / Math.min(componentFiles.length, 50);
  a11yScore += ariaRatio * 30;
  details.push(`Aria-labels: ${filesWithAria}/${Math.min(componentFiles.length, 50)} files`);

  // Check for semantic HTML
  const pageFiles = await glob('src/app/**/page.tsx', { cwd: projectRoot });
  const filesWithSemantic = pageFiles.slice(0, 20).filter(f => {
    try {
      const content = readFileSync(join(projectRoot, f), 'utf-8');
      return /<nav|<main|<header|<footer|<article|<section/.test(content);
    } catch {
      return false;
    }
  }).length;
  const semanticRatio = filesWithSemantic / Math.min(pageFiles.length, 20);
  a11yScore += semanticRatio * 25;
  details.push(`Semantic HTML: ${filesWithSemantic}/${Math.min(pageFiles.length, 20)} files`);

  // Check for keyboard navigation support
  const hasKeyboardSupport = componentFiles.slice(0, 30).filter(f => {
    try {
      const content = readFileSync(join(projectRoot, f), 'utf-8');
      return /onKeyDown|onKeyPress|tabIndex/.test(content);
    } catch {
      return false;
    }
  }).length;
  a11yScore += (hasKeyboardSupport / 30) * 20;
  details.push(`Keyboard navigation: ${hasKeyboardSupport} files`);

  evaluation.accessibility = { score: a11yScore, maxScore: 100, details };
  console.log(`   Score: ${a11yScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 3. UX Evaluation (37.7% ? target 90%+)
console.log('3??  Evaluating UX...');
try {
  let uxScore = 0;
  const details = [];

  // Check for LoadingSkeleton
  const hasLoadingSkeleton = existsSync(join(projectRoot, 'src/components/ui/LoadingSkeleton.tsx'));
  if (hasLoadingSkeleton) {
    uxScore += 30;
    details.push('LoadingSkeleton component exists');
  }

  // Check for NotificationManager
  const hasNotifications = existsSync(join(projectRoot, 'src/lib/notifications.ts'));
  if (hasNotifications) {
    uxScore += 30;
    details.push('NotificationManager system exists');
  }

  // Check if NotificationToast is in layout
  if (existsSync(join(projectRoot, 'src/app/layout.tsx'))) {
    const layout = readFileSync(join(projectRoot, 'src/app/layout.tsx'), 'utf-8');
    if (layout.includes('NotificationToast')) {
      uxScore += 20;
      details.push('NotificationToast integrated in layout');
    }
  }

  // Check for loading states in pages
  const pageFiles = await glob('src/app/**/page.tsx', { cwd: projectRoot });
  const filesWithLoading = pageFiles.slice(0, 30).filter(f => {
    try {
      const content = readFileSync(join(projectRoot, f), 'utf-8');
      return /loading|isLoading|isPending/.test(content);
    } catch {
      return false;
    }
  }).length;
  const loadingRatio = filesWithLoading / Math.min(pageFiles.length, 30);
  uxScore += loadingRatio * 20;
  details.push(`Loading states: ${filesWithLoading}/${Math.min(pageFiles.length, 30)} files`);

  evaluation.ux = { score: uxScore, maxScore: 100, details };
  console.log(`   Score: ${uxScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 4. Centralization Evaluation (91.7% ? target 95%+)
console.log('4??  Evaluating Centralization...');
try {
  let centralScore = 0;
  const details = [];

  // Check for centralized styles
  const hasCentralizedCSS = existsSync(join(projectRoot, 'src/styles/centralized.css'));
  if (hasCentralizedCSS) {
    centralScore += 20;
    details.push('Centralized CSS exists');
  }

  // Check for centralized notifications
  const hasNotifications = existsSync(join(projectRoot, 'src/lib/notifications.ts'));
  if (hasNotifications) {
    centralScore += 20;
    details.push('Centralized notifications');
  }

  // Check for centralized permissions
  const hasPermissions = existsSync(join(projectRoot, 'src/lib/permissions.ts'));
  if (hasPermissions) {
    centralScore += 20;
    details.push('Centralized permissions');
  }

  // Check for centralized workflows
  const hasWorkflows = existsSync(join(projectRoot, 'src/lib/workflows'));
  if (hasWorkflows) {
    centralScore += 15;
    details.push('Centralized workflows');
  }

  // Check for LazyComponents
  const hasLazyComponents = existsSync(join(projectRoot, 'src/components/lazy/LazyComponents.tsx'));
  if (hasLazyComponents) {
    centralScore += 15;
    details.push('Centralized LazyComponents');
  }

  // Check for LoadingSkeleton
  const hasLoadingSkeleton = existsSync(join(projectRoot, 'src/components/ui/LoadingSkeleton.tsx'));
  if (hasLoadingSkeleton) {
    centralScore += 10;
    details.push('Centralized LoadingSkeleton');
  }

  evaluation.centralization = { score: centralScore, maxScore: 100, details };
  console.log(`   Score: ${centralScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// Summary
console.log('='.repeat(70));
console.log('?? Final Evaluation Summary');
console.log('='.repeat(70));

const categories = [
  { key: 'performance', name: 'Performance' },
  { key: 'accessibility', name: 'Accessibility' },
  { key: 'ux', name: 'UX' },
  { key: 'centralization', name: 'Centralization' },
];

categories.forEach(cat => {
  const evalData = evaluation[cat.key];
  const percentage = (evalData.score / evalData.maxScore * 100).toFixed(1);
  const status = percentage >= 90 ? '?' : percentage >= 70 ? '??' : '?';
  console.log(`${status} ${cat.name}: ${percentage}% (${evalData.score}/${evalData.maxScore})`);
  if (evalData.details.length > 0) {
    evalData.details.forEach(d => console.log(`   - ${d}`));
  }
});

const totalScore = categories.reduce((sum, cat) => sum + evaluation[cat.key].score, 0);
const maxTotalScore = categories.reduce((sum, cat) => sum + evaluation[cat.key].maxScore, 0);
const overallPercentage = (totalScore / maxTotalScore * 100).toFixed(1);

console.log(`\n?? Overall Score: ${overallPercentage}% (${totalScore}/${maxTotalScore})`);
console.log('='.repeat(70) + '\n');

// Save report
import { writeFileSync } from 'fs';
writeFileSync(
  join(projectRoot, 'FINAL_EVALUATION_REPORT.json'),
  JSON.stringify({ evaluation, overallPercentage, timestamp: new Date().toISOString() }, null, 2)
);

console.log('?? Report saved to: FINAL_EVALUATION_REPORT.json\n');
