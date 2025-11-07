#!/usr/bin/env node

/**
 * Comprehensive Project Evaluation
 * ????? ???? ???????
 *
 * Evaluates:
 * - Structure
 * - Organization
 * - Clean Code
 * - Centralization
 * - Accessibility
 * - UX
 * - Design & Consistency
 * - Security
 * - Maintainability
 * - Error Handling
 * - Performance
 * - Speed
 * - Market Competition & Key Selling Points
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('?? Comprehensive Project Evaluation...\n');
console.log('='.repeat(70) + '\n');

const evaluation = {
  structure: { score: 0, maxScore: 100, issues: [], strengths: [] },
  organization: { score: 0, maxScore: 100, issues: [], strengths: [] },
  cleanCode: { score: 0, maxScore: 100, issues: [], strengths: [] },
  centralization: { score: 0, maxScore: 100, issues: [], strengths: [] },
  accessibility: { score: 0, maxScore: 100, issues: [], strengths: [] },
  ux: { score: 0, maxScore: 100, issues: [], strengths: [] },
  design: { score: 0, maxScore: 100, issues: [], strengths: [] },
  security: { score: 0, maxScore: 100, issues: [], strengths: [] },
  maintainability: { score: 0, maxScore: 100, issues: [], strengths: [] },
  errorHandling: { score: 0, maxScore: 100, issues: [], strengths: [] },
  performance: { score: 0, maxScore: 100, issues: [], strengths: [] },
  speed: { score: 0, maxScore: 100, issues: [], strengths: [] },
  marketCompetition: { score: 0, maxScore: 100, issues: [], strengths: [] },
};

// 1. Structure Evaluation
console.log('1??  Evaluating Structure...');
try {
  const srcDir = join(projectRoot, 'src');
  const appDir = join(srcDir, 'app');
  const componentsDir = join(srcDir, 'components');
  const libDir = join(srcDir, 'lib');

  let structureScore = 0;
  const issues = [];
  const strengths = [];

  // Check directory structure
  if (existsSync(srcDir)) structureScore += 10;
  else issues.push('Missing src/ directory');

  if (existsSync(appDir)) {
    structureScore += 10;
    strengths.push('Next.js App Router structure present');
  } else issues.push('Missing app/ directory');

  if (existsSync(componentsDir)) {
    structureScore += 10;
    strengths.push('Components directory organized');
  } else issues.push('Missing components/ directory');

  if (existsSync(libDir)) {
    structureScore += 10;
    strengths.push('Lib directory for utilities');
  } else issues.push('Missing lib/ directory');

  // Check for separation of concerns
  const hasApiRoutes = existsSync(join(appDir, 'api'));
  const hasPages =
    existsSync(join(appDir, '(admin)')) ||
    existsSync(join(appDir, '(patient)'));
  const hasLayouts = glob.sync('**/layout.tsx', { cwd: appDir }).length > 0;

  if (hasApiRoutes) {
    structureScore += 15;
    strengths.push('API routes separated from pages');
  } else issues.push('API routes not properly separated');

  if (hasPages) {
    structureScore += 15;
    strengths.push('Route groups for organization');
  } else issues.push('No route groups found');

  if (hasLayouts) {
    structureScore += 10;
    strengths.push('Layout files for shared UI');
  } else issues.push('Missing layout files');

  // Check for config files
  const configFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.js',
    'tailwind.config.js',
  ];
  const existingConfigs = configFiles.filter(f =>
    existsSync(join(projectRoot, f))
  ).length;
  structureScore += (existingConfigs / configFiles.length) * 20;

  evaluation.structure = {
    score: structureScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${structureScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 2. Organization Evaluation
console.log('2??  Evaluating Organization...');
try {
  let orgScore = 0;
  const issues = [];
  const strengths = [];

  // Check for organized directories
  const organizedDirs = ['components', 'lib', 'hooks', 'utils', 'constants'];
  const srcFiles = readdirSync(join(projectRoot, 'src'));
  const hasOrganizedDirs = organizedDirs.filter(
    d =>
      srcFiles.includes(d) ||
      glob.sync(`**/${d}/**`, { cwd: join(projectRoot, 'src') }).length > 0
  ).length;
  orgScore += (hasOrganizedDirs / organizedDirs.length) * 30;
  if (hasOrganizedDirs === organizedDirs.length)
    strengths.push('Well-organized directory structure');
  else issues.push('Some directories could be better organized');

  // Check for duplicate files
  const allFiles = glob.sync('**/*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  });
  const fileNames = allFiles.map(f => f.split('/').pop());
  const duplicates = fileNames.filter(
    (name, idx) => fileNames.indexOf(name) !== idx
  );
  if (duplicates.length === 0) {
    orgScore += 20;
    strengths.push('No duplicate files');
  } else {
    issues.push(`${duplicates.length} duplicate files found`);
  }

  // Check for archive directory
  if (existsSync(join(projectRoot, '.archive'))) {
    orgScore += 15;
    strengths.push('Archive directory for old files');
  } else issues.push('No archive directory for old files');

  // Check for documentation
  const docsFiles = glob.sync('*.md', { cwd: projectRoot });
  const essentialDocs = [
    'README.md',
    'WORKFLOWS_DOCUMENTATION.md',
    'ACCOUNTS_TYPES_AND_PERMISSIONS.md',
  ];
  const hasEssentialDocs = essentialDocs.filter(d =>
    docsFiles.includes(d)
  ).length;
  orgScore += (hasEssentialDocs / essentialDocs.length) * 20;
  if (hasEssentialDocs === essentialDocs.length)
    strengths.push('Essential documentation present');
  else issues.push('Some documentation missing');

  // Check .gitignore
  if (existsSync(join(projectRoot, '.gitignore'))) {
    const gitignore = readFileSync(join(projectRoot, '.gitignore'), 'utf-8');
    const requiredIgnores = ['node_modules', '.next', 'test-results'];
    const hasRequired = requiredIgnores.filter(r =>
      gitignore.includes(r)
    ).length;
    orgScore += (hasRequired / requiredIgnores.length) * 15;
    if (hasRequired === requiredIgnores.length)
      strengths.push('.gitignore properly configured');
    else issues.push('.gitignore missing some entries');
  }

  evaluation.organization = {
    score: orgScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${orgScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 3. Clean Code Evaluation
console.log('3??  Evaluating Clean Code...');
try {
  let cleanScore = 0;
  const issues = [];
  const strengths = [];

  // Check for TypeScript usage
  const tsFiles = glob.sync('**/*.ts', {
    cwd: join(projectRoot, 'src'),
  }).length;
  const tsxFiles = glob.sync('**/*.tsx', {
    cwd: join(projectRoot, 'src'),
  }).length;
  const jsFiles = glob.sync('**/*.js', {
    cwd: join(projectRoot, 'src'),
  }).length;
  const totalFiles = tsFiles + tsxFiles + jsFiles;
  const tsRatio = (tsFiles + tsxFiles) / totalFiles;
  cleanScore += tsRatio * 25;
  if (tsRatio > 0.9) strengths.push('High TypeScript usage');
  else issues.push(`Only ${(tsRatio * 100).toFixed(1)}% TypeScript usage`);

  // Check for any types
  const anyUsage = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /:\s*any\b/.test(content)).length;
  const totalTsFiles = tsFiles + tsxFiles;
  const anyRatio = anyUsage / totalTsFiles;
  cleanScore += (1 - anyRatio) * 20;
  if (anyRatio < 0.1) strengths.push('Minimal use of any type');
  else issues.push(`${(anyRatio * 100).toFixed(1)}% of files use any type`);

  // Check for error handling
  const filesWithTryCatch = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /try\s*\{/.test(content)).length;
  const tryCatchRatio = filesWithTryCatch / totalTsFiles;
  cleanScore += tryCatchRatio * 20;
  if (tryCatchRatio > 0.5) strengths.push('Good error handling coverage');
  else issues.push('Low error handling coverage');

  // Check for consistent naming
  const componentFiles = glob.sync('**/*.tsx', {
    cwd: join(projectRoot, 'src/components'),
  });
  const pascalCaseFiles = componentFiles.filter(f =>
    /^[A-Z]/.test(f.split('/').pop() || '')
  ).length;
  const namingRatio = pascalCaseFiles / componentFiles.length;
  cleanScore += namingRatio * 15;
  if (namingRatio > 0.9) strengths.push('Consistent naming conventions');
  else issues.push("Some files don't follow naming conventions");

  // Check for comments
  const filesWithComments = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .slice(0, 50) // Sample
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /\/\//.test(content) || /\/\*/.test(content)).length;
  const commentRatio = filesWithComments / 50;
  cleanScore += commentRatio * 20;
  if (commentRatio > 0.3) strengths.push('Good code documentation');
  else issues.push('Low code documentation');

  evaluation.cleanCode = {
    score: cleanScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${cleanScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 4. Centralization Evaluation
console.log('4??  Evaluating Centralization...');
try {
  let centralScore = 0;
  const issues = [];
  const strengths = [];

  // Check for centralized styles
  const centralizedStyles = glob.sync('**/centralized.css', {
    cwd: projectRoot,
  }).length;
  if (centralizedStyles > 0) {
    centralScore += 25;
    strengths.push('Centralized CSS variables');
  } else issues.push('No centralized CSS file');

  // Check for utility files
  const utilityDirs = ['lib', 'utils', 'helpers'];
  const hasUtils = utilityDirs.filter(
    d =>
      glob.sync(`**/${d}/**/*.ts`, { cwd: join(projectRoot, 'src') }).length > 0
  ).length;
  centralScore += (hasUtils / utilityDirs.length) * 25;
  if (hasUtils === utilityDirs.length) strengths.push('Centralized utilities');
  else issues.push('Some utilities not centralized');

  // Check for constants file
  const constantsFiles = glob.sync('**/constants/**/*.ts', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (constantsFiles > 0) {
    centralScore += 15;
    strengths.push('Centralized constants');
  } else issues.push('No constants directory');

  // Check for permissions system
  const permissionsFile = glob.sync('**/permissions.ts', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (permissionsFile > 0) {
    centralScore += 20;
    strengths.push('Centralized permissions system');
  } else issues.push('No centralized permissions');

  // Check for workflows system
  const workflowsFile = glob.sync('**/workflows/**/*.ts', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (workflowsFile > 0) {
    centralScore += 15;
    strengths.push('Centralized workflows');
  } else issues.push('No centralized workflows');

  evaluation.centralization = {
    score: centralScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${centralScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 5. Accessibility Evaluation
console.log('5??  Evaluating Accessibility...');
try {
  let a11yScore = 0;
  const issues = [];
  const strengths = [];

  // Check for aria-labels
  const componentFiles = glob
    .sync('**/*.tsx', { cwd: join(projectRoot, 'src/components') })
    .slice(0, 30);
  const filesWithAria = componentFiles
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content => /aria-label/.test(content)).length;
  const ariaRatio = filesWithAria / componentFiles.length;
  a11yScore += ariaRatio * 30;
  if (ariaRatio > 0.5) strengths.push('Good aria-label usage');
  else issues.push('Low aria-label usage');

  // Check for alt text in images
  const filesWithImages = componentFiles
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content => /<img/.test(content) || /Image/.test(content)).length;
  const filesWithAlt = componentFiles
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content => /alt=/.test(content) || /alt:/.test(content)).length;
  const altRatio = filesWithImages > 0 ? filesWithAlt / filesWithImages : 1;
  a11yScore += altRatio * 25;
  if (altRatio > 0.8) strengths.push('Good alt text usage');
  else issues.push('Some images missing alt text');

  // Check for semantic HTML
  const filesWithSemantic = componentFiles
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content =>
      /<nav|main|header|footer|article|section/.test(content)
    ).length;
  const semanticRatio = filesWithSemantic / componentFiles.length;
  a11yScore += semanticRatio * 25;
  if (semanticRatio > 0.3) strengths.push('Good semantic HTML usage');
  else issues.push('Low semantic HTML usage');

  // Check for keyboard navigation
  const filesWithKeyboard = componentFiles
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content => /onKeyDown|onKeyPress|tabIndex/.test(content)).length;
  const keyboardRatio = filesWithKeyboard / componentFiles.length;
  a11yScore += keyboardRatio * 20;
  if (keyboardRatio > 0.2) strengths.push('Keyboard navigation support');
  else issues.push('Limited keyboard navigation');

  evaluation.accessibility = {
    score: a11yScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${a11yScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 6. UX Evaluation
console.log('6??  Evaluating UX...');
try {
  let uxScore = 0;
  const issues = [];
  const strengths = [];

  // Check for loading states
  const filesWithLoading = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .slice(0, 50)
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /loading|isLoading|isPending/.test(content)).length;
  const loadingRatio = filesWithLoading / 50;
  uxScore += loadingRatio * 25;
  if (loadingRatio > 0.4) strengths.push('Good loading state handling');
  else issues.push('Limited loading states');

  // Check for error states
  const filesWithError = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .slice(0, 50)
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /error|Error|catch/.test(content)).length;
  const errorRatio = filesWithError / 50;
  uxScore += errorRatio * 25;
  if (errorRatio > 0.5) strengths.push('Good error state handling');
  else issues.push('Limited error handling');

  // Check for responsive design
  const filesWithResponsive = glob
    .sync('**/*.tsx', { cwd: join(projectRoot, 'src/app') })
    .slice(0, 30)
    .map(f => readFileSync(join(projectRoot, 'src/app', f), 'utf-8'))
    .filter(content => /md:|lg:|xl:|sm:/.test(content)).length;
  const responsiveRatio = filesWithResponsive / 30;
  uxScore += responsiveRatio * 25;
  if (responsiveRatio > 0.6) strengths.push('Good responsive design');
  else issues.push('Limited responsive design');

  // Check for user feedback
  const filesWithFeedback = glob
    .sync('**/*.tsx', { cwd: join(projectRoot, 'src/components') })
    .slice(0, 30)
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content => /toast|notification|message|alert/.test(content)).length;
  const feedbackRatio = filesWithFeedback / 30;
  uxScore += feedbackRatio * 25;
  if (feedbackRatio > 0.3) strengths.push('User feedback mechanisms');
  else issues.push('Limited user feedback');

  evaluation.ux = { score: uxScore, maxScore: 100, issues, strengths };
  console.log(`   Score: ${uxScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 7. Design & Consistency Evaluation
console.log('7??  Evaluating Design & Consistency...');
try {
  let designScore = 0;
  const issues = [];
  const strengths = [];

  // Check for design system
  const designSystemFiles = glob.sync('**/*design*.{ts,tsx,css}', {
    cwd: projectRoot,
  }).length;
  if (designSystemFiles > 0) {
    designScore += 20;
    strengths.push('Design system files present');
  } else issues.push('No design system files');

  // Check for consistent color usage
  const filesWithColors = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .slice(0, 50)
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /var\(--|--brand-|--text-/.test(content)).length;
  const colorRatio = filesWithColors / 50;
  designScore += colorRatio * 30;
  if (colorRatio > 0.5) strengths.push('Consistent color variable usage');
  else issues.push('Inconsistent color usage');

  // Check for theme support
  const themeFiles = glob.sync('**/*theme*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (themeFiles > 0) {
    designScore += 25;
    strengths.push('Theme system present');
  } else issues.push('No theme system');

  // Check for consistent spacing
  const filesWithSpacing = glob
    .sync('**/*.tsx', { cwd: join(projectRoot, 'src/components') })
    .slice(0, 30)
    .map(f => readFileSync(join(projectRoot, 'src/components', f), 'utf-8'))
    .filter(content => /p-|m-|gap-|space-/.test(content)).length;
  const spacingRatio = filesWithSpacing / 30;
  designScore += spacingRatio * 25;
  if (spacingRatio > 0.7) strengths.push('Consistent spacing');
  else issues.push('Inconsistent spacing');

  evaluation.design = { score: designScore, maxScore: 100, issues, strengths };
  console.log(`   Score: ${designScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 8. Security Evaluation
console.log('8??  Evaluating Security...');
try {
  let securityScore = 0;
  const issues = [];
  const strengths = [];

  // Check for authentication
  const authFiles = glob.sync('**/*auth*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (authFiles > 0) {
    securityScore += 20;
    strengths.push('Authentication system present');
  } else issues.push('No authentication system');

  // Check for authorization
  const authzFiles = glob.sync('**/*authorize*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (authzFiles > 0) {
    securityScore += 20;
    strengths.push('Authorization system present');
  } else issues.push('No authorization system');

  // Check for input validation
  const validationFiles = glob.sync('**/*validation*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (validationFiles > 0) {
    securityScore += 15;
    strengths.push('Input validation system');
  } else issues.push('No validation system');

  // Check for protected routes
  const protectedRouteFiles = glob.sync('**/*Protected*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (protectedRouteFiles > 0) {
    securityScore += 15;
    strengths.push('Protected route components');
  } else issues.push('No protected route components');

  // Check for API security
  const apiFiles = glob
    .sync('**/api/**/*.ts', { cwd: join(projectRoot, 'src') })
    .slice(0, 30);
  const securedApis = apiFiles
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content =>
      /requireAuth|authorize|requireRole/.test(content)
    ).length;
  const apiSecurityRatio = securedApis / apiFiles.length;
  securityScore += apiSecurityRatio * 30;
  if (apiSecurityRatio > 0.7) strengths.push('Most APIs are secured');
  else issues.push('Some APIs not secured');

  evaluation.security = {
    score: securityScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${securityScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 9. Maintainability Evaluation
console.log('9??  Evaluating Maintainability...');
try {
  let maintainScore = 0;
  const issues = [];
  const strengths = [];

  // Check for modular structure
  const componentFiles = glob.sync('**/*.tsx', {
    cwd: join(projectRoot, 'src/components'),
  }).length;
  const avgFileSize =
    glob
      .sync('**/*.tsx', { cwd: join(projectRoot, 'src/components') })
      .slice(0, 20)
      .map(f => statSync(join(projectRoot, 'src/components', f)).size)
      .reduce((a, b) => a + b, 0) / 20;
  const isModular = avgFileSize < 10000; // Less than 10KB average
  maintainScore += isModular ? 25 : 10;
  if (isModular) strengths.push('Modular component structure');
  else issues.push('Some components too large');

  // Check for documentation
  const docsCount = glob.sync('*.md', { cwd: projectRoot }).length;
  maintainScore += Math.min(docsCount * 5, 25);
  if (docsCount > 3) strengths.push('Good documentation');
  else issues.push('Limited documentation');

  // Check for type safety
  const tsFiles = glob.sync('**/*.ts', {
    cwd: join(projectRoot, 'src'),
  }).length;
  const totalFiles =
    tsFiles + glob.sync('**/*.tsx', { cwd: join(projectRoot, 'src') }).length;
  const tsRatio = tsFiles / totalFiles;
  maintainScore += tsRatio * 25;
  if (tsRatio > 0.3) strengths.push('Good TypeScript usage');
  else issues.push('Limited TypeScript');

  // Check for test files
  const testFiles = glob.sync('**/*.{test,spec}.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  maintainScore += Math.min(testFiles * 2, 25);
  if (testFiles > 5) strengths.push('Test files present');
  else issues.push('Limited test coverage');

  evaluation.maintainability = {
    score: maintainScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${maintainScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 10. Error Handling Evaluation
console.log('?? Evaluating Error Handling...');
try {
  let errorHandlingScore = 0;
  const issues = [];
  const strengths = [];

  // Check for try-catch blocks
  const apiFiles = glob
    .sync('**/api/**/*.ts', { cwd: join(projectRoot, 'src') })
    .slice(0, 30);
  const filesWithTryCatch = apiFiles
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(
      content => /try\s*\{/.test(content) && /catch/.test(content)
    ).length;
  const tryCatchRatio = filesWithTryCatch / apiFiles.length;
  errorHandlingScore += tryCatchRatio * 30;
  if (tryCatchRatio > 0.8) strengths.push('Excellent error handling');
  else issues.push('Some files missing error handling');

  // Check for error boundaries
  const errorBoundaryFiles = glob.sync('**/*ErrorBoundary*.{ts,tsx}', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (errorBoundaryFiles > 0) {
    errorHandlingScore += 20;
    strengths.push('Error boundaries present');
  } else issues.push('No error boundaries');

  // Check for error logging
  const filesWithLogging = apiFiles
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content =>
      /console\.error|logger\.error|log\.error/.test(content)
    ).length;
  const loggingRatio = filesWithLogging / apiFiles.length;
  errorHandlingScore += loggingRatio * 25;
  if (loggingRatio > 0.6) strengths.push('Good error logging');
  else issues.push('Limited error logging');

  // Check for user-friendly error messages
  const filesWithUserErrors = apiFiles
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content =>
      /error.*message|error.*user|Unauthorized|Forbidden/.test(content)
    ).length;
  const userErrorRatio = filesWithUserErrors / apiFiles.length;
  errorHandlingScore += userErrorRatio * 25;
  if (userErrorRatio > 0.7) strengths.push('User-friendly error messages');
  else issues.push('Some errors not user-friendly');

  evaluation.errorHandling = {
    score: errorHandlingScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${errorHandlingScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 11. Performance Evaluation
console.log('1??1??  Evaluating Performance...');
try {
  let perfScore = 0;
  const issues = [];
  const strengths = [];

  // Check for code splitting
  const hasDynamicImports = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .slice(0, 30)
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /dynamic|import\(/.test(content)).length;
  const dynamicRatio = hasDynamicImports / 30;
  perfScore += dynamicRatio * 25;
  if (dynamicRatio > 0.2) strengths.push('Code splitting implemented');
  else issues.push('Limited code splitting');

  // Check for image optimization
  const hasNextImage = glob
    .sync('**/*.tsx', { cwd: join(projectRoot, 'src/app') })
    .slice(0, 20)
    .map(f => readFileSync(join(projectRoot, 'src/app', f), 'utf-8'))
    .filter(content => /next\/image|Image/.test(content)).length;
  const imageRatio = hasNextImage / 20;
  perfScore += imageRatio * 20;
  if (imageRatio > 0.5) strengths.push('Next.js Image optimization');
  else issues.push('Limited image optimization');

  // Check for caching
  const hasCaching = glob
    .sync('**/api/**/*.ts', { cwd: join(projectRoot, 'src') })
    .slice(0, 20)
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /Cache-Control|revalidate|cache/.test(content)).length;
  const cacheRatio = hasCaching / 20;
  perfScore += cacheRatio * 25;
  if (cacheRatio > 0.3) strengths.push('API response caching');
  else issues.push('Limited caching');

  // Check for database optimization
  const hasIndexing = glob
    .sync('**/*.{sql,mjs}', { cwd: join(projectRoot, 'scripts') })
    .slice(0, 10)
    .map(f => readFileSync(join(projectRoot, 'scripts', f), 'utf-8'))
    .filter(content => /CREATE INDEX|index/.test(content)).length;
  if (hasIndexing > 0) {
    perfScore += 15;
    strengths.push('Database indexing');
  } else issues.push('No database indexing');

  // Check for lazy loading
  const hasLazy = glob
    .sync('**/*.{ts,tsx}', { cwd: join(projectRoot, 'src') })
    .slice(0, 30)
    .map(f => readFileSync(join(projectRoot, 'src', f), 'utf-8'))
    .filter(content => /lazy|Suspense/.test(content)).length;
  const lazyRatio = hasLazy / 30;
  perfScore += lazyRatio * 15;
  if (lazyRatio > 0.1) strengths.push('Lazy loading components');
  else issues.push('Limited lazy loading');

  evaluation.performance = {
    score: perfScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${perfScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 12. Speed Evaluation
console.log('1??2??  Evaluating Speed...');
try {
  let speedScore = 0;
  const issues = [];
  const strengths = [];

  // Check build time (if available)
  try {
    const buildStart = Date.now();
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 300000,
    });
    const buildTime = (Date.now() - buildStart) / 1000; // seconds
    if (buildTime < 120) {
      speedScore += 30;
      strengths.push('Fast build time');
    } else if (buildTime < 300) {
      speedScore += 15;
      issues.push('Build time could be optimized');
    } else {
      issues.push('Slow build time');
    }
  } catch (error) {
    // Build failed, but we'll continue
    issues.push('Build failed - cannot evaluate speed');
  }

  // Check for optimized imports
  const hasBarrelExports = glob.sync('**/index.ts', {
    cwd: join(projectRoot, 'src'),
  }).length;
  if (hasBarrelExports > 5) {
    speedScore += 20;
    strengths.push('Barrel exports for faster imports');
  } else issues.push('Limited barrel exports');

  // Check for minimal dependencies
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf-8')
  );
  const depCount = Object.keys(packageJson.dependencies || {}).length;
  const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
  const totalDeps = depCount + devDepCount;
  if (totalDeps < 100) {
    speedScore += 25;
    strengths.push('Reasonable dependency count');
  } else if (totalDeps < 200) {
    speedScore += 15;
    issues.push('Many dependencies');
  } else {
    issues.push('Too many dependencies');
  }

  // Check for production optimizations
  const hasProdConfig = existsSync(join(projectRoot, 'next.config.js'));
  if (hasProdConfig) {
    const nextConfig = readFileSync(
      join(projectRoot, 'next.config.js'),
      'utf-8'
    );
    if (/compress|optimize|swcMinify/.test(nextConfig)) {
      speedScore += 25;
      strengths.push('Production optimizations enabled');
    } else issues.push('Production optimizations not configured');
  }

  evaluation.speed = { score: speedScore, maxScore: 100, issues, strengths };
  console.log(`   Score: ${speedScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// 13. Market Competition Evaluation
console.log('1??3??  Evaluating Market Competition...');
try {
  let marketScore = 0;
  const issues = [];
  const strengths = [];

  // Key Selling Points
  const features = [
    'workflow',
    'permissions',
    'insurance',
    'chatbot',
    'appointments',
    'payments',
    'reports',
    'analytics',
    'notifications',
    'multi-role',
  ];

  const featureFiles = features.map(
    f => glob.sync(`**/*${f}*`, { cwd: join(projectRoot, 'src') }).length
  );
  const hasFeatures = featureFiles.filter(count => count > 0).length;
  marketScore += (hasFeatures / features.length) * 40;
  if (hasFeatures === features.length)
    strengths.push('All key features present');
  else issues.push(`Missing ${features.length - hasFeatures} key features`);

  // Modern tech stack
  const modernStack = ['next', 'react', 'typescript', 'tailwind', 'supabase'];
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf-8')
  );
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  const hasModern = modernStack.filter(tech =>
    Object.keys(allDeps).some(dep => dep.toLowerCase().includes(tech))
  ).length;
  marketScore += (hasModern / modernStack.length) * 30;
  if (hasModern === modernStack.length) strengths.push('Modern tech stack');
  else issues.push('Some modern technologies missing');

  // Scalability indicators
  const hasModular =
    glob.sync('**/components/**', { cwd: join(projectRoot, 'src') }).length >
    50;
  const hasApi =
    glob.sync('**/api/**', { cwd: join(projectRoot, 'src/app') }).length > 50;
  if (hasModular && hasApi) {
    marketScore += 30;
    strengths.push('Scalable architecture');
  } else issues.push('Architecture scalability concerns');

  evaluation.marketCompetition = {
    score: marketScore,
    maxScore: 100,
    issues,
    strengths,
  };
  console.log(`   Score: ${marketScore}/100\n`);
} catch (error) {
  console.log(`   Error: ${error.message}\n`);
}

// Summary
console.log('='.repeat(70));
console.log('?? Comprehensive Evaluation Summary');
console.log('='.repeat(70));

const categories = [
  { key: 'structure', name: 'Structure' },
  { key: 'organization', name: 'Organization' },
  { key: 'cleanCode', name: 'Clean Code' },
  { key: 'centralization', name: 'Centralization' },
  { key: 'accessibility', name: 'Accessibility' },
  { key: 'ux', name: 'UX' },
  { key: 'design', name: 'Design & Consistency' },
  { key: 'security', name: 'Security' },
  { key: 'maintainability', name: 'Maintainability' },
  { key: 'errorHandling', name: 'Error Handling' },
  { key: 'performance', name: 'Performance' },
  { key: 'speed', name: 'Speed' },
  { key: 'marketCompetition', name: 'Market Competition' },
];

categories.forEach(cat => {
  const evalData = evaluation[cat.key];
  const percentage = ((evalData.score / evalData.maxScore) * 100).toFixed(1);
  const status = percentage >= 80 ? '?' : percentage >= 60 ? '??' : '?';
  console.log(
    `${status} ${cat.name}: ${percentage}% (${evalData.score}/${evalData.maxScore})`
  );
});

const totalScore = categories.reduce(
  (sum, cat) => sum + evaluation[cat.key].score,
  0
);
const maxTotalScore = categories.reduce(
  (sum, cat) => sum + evaluation[cat.key].maxScore,
  0
);
const overallPercentage = ((totalScore / maxTotalScore) * 100).toFixed(1);

console.log(
  `\n?? Overall Score: ${overallPercentage}% (${totalScore}/${maxTotalScore})`
);
console.log('='.repeat(70) + '\n');

// Save report
import { writeFileSync } from 'fs';
writeFileSync(
  join(projectRoot, 'COMPREHENSIVE_EVALUATION_REPORT.json'),
  JSON.stringify(
    { evaluation, overallPercentage, timestamp: new Date().toISOString() },
    null,
    2
  )
);

console.log('?? Report saved to: COMPREHENSIVE_EVALUATION_REPORT.json\n');
