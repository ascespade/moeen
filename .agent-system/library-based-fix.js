#!/usr/bin/env node
/**
 * 🎯 Library-Based Fix - يعتمد بالكامل على Prettier & ESLint
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🎯 Library-Based Auto-Fix Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP = 'tmp/backup-lib-' + Date.now();
execSync(`mkdir -p ${BACKUP} && cp -r src ${BACKUP}/`, { stdio: 'pipe' });
console.log('✅ Backup created\n');

// Load libraries
let prettier, eslint;

try {
  prettier = require('prettier');
  console.log('✅ Prettier loaded');
} catch (err) {
  console.log('Installing Prettier...');
  execSync('npm install --save-dev prettier', { stdio: 'inherit' });
  prettier = require('prettier');
}

try {
  const { ESLint } = require('eslint');
  eslint = new ESLint({ 
    fix: true,
    overrideConfigFile: '.eslintrc.json',
  });
  console.log('✅ ESLint loaded\n');
} catch (err) {
  console.log('⚠️  ESLint not available\n');
}

// Get files
function getFiles(dir) {
  const files = [];
  function walk(d) {
    const items = fs.readdirSync(d, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(d, item.name);
      if (item.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'tmp'].includes(item.name)) {
          walk(fullPath);
        }
      } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  walk(dir);
  return files;
}

// Main fix function - ONLY using libraries
async function fixWithLibraries() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Phase 1: ESLint Auto-Fix\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (eslint) {
    try {
      // Run ESLint on all files
      const files = getFiles('src');
      console.log(`Processing ${files.length} files with ESLint...\n`);
      
      const results = await eslint.lintFiles(files);
      await ESLint.outputFixes(results);
      
      const fixedCount = results.filter(r => r.output).length;
      console.log(`✅ ESLint fixed ${fixedCount} files\n`);
      
    } catch (err) {
      console.log('⚠️  ESLint error:', err.message, '\n');
    }
  } else {
    console.log('⚠️  ESLint not available, skipping...\n');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Phase 2: Prettier Format\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const files = getFiles('src');
  let formatted = 0;
  let errors = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const options = await prettier.resolveConfig(file) || {
        parser: file.endsWith('.tsx') ? 'typescript' : 'typescript',
        semi: true,
        singleQuote: false,
        trailingComma: 'es5',
        tabWidth: 2,
      };
      
      const formatted_content = await prettier.format(content, {
        ...options,
        filepath: file,
      });
      
      if (formatted_content !== content) {
        fs.writeFileSync(file, formatted_content);
        formatted++;
      }
      
    } catch (err) {
      errors++;
      if (errors <= 5) {
        console.log(`   ⚠️  ${path.basename(file)}: ${err.message.split('\n')[0]}`);
      }
    }
  }
  
  console.log(`\n✅ Prettier formatted ${formatted} files`);
  if (errors > 0) {
    console.log(`⚠️  ${errors} files had formatting errors (skipped)\n`);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Phase 3: Minimal Manual Fixes (only critical syntax)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Only fix what Prettier/ESLint can't fix
  let manualFixed = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // ONLY these critical fixes:
    
    // 1. "use client" must be first (Prettier can't fix this)
    if (content.includes('"use client"') || content.includes("'use client'")) {
      if (!content.trimStart().startsWith('"use client"') && 
          !content.trimStart().startsWith("'use client'")) {
        // Remove all occurrences
        content = content.replace(/"use client";?\s*/g, '');
        content = content.replace(/'use client';?\s*/g, '');
        // Add at beginning
        content = '"use client";\n\n' + content;
      }
    }
    
    // 2. Empty parentheses () alone (syntax error Prettier can't fix)
    content = content.replace(/^\s*\(\)\s*;?\s*$/gm, '');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      manualFixed++;
      console.log(`   ✅ ${path.relative('src', file)}`);
    }
  }
  
  console.log(`\n✅ Manual fixes: ${manualFixed} files\n`);
  
  // Re-run Prettier after manual fixes
  if (manualFixed > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Phase 4: Re-format after manual fixes\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    let reformatted = 0;
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const options = await prettier.resolveConfig(file) || {
          parser: file.endsWith('.tsx') ? 'typescript' : 'typescript',
          semi: true,
          singleQuote: false,
        };
        
        const formatted_content = await prettier.format(content, {
          ...options,
          filepath: file,
        });
        
        if (formatted_content !== content) {
          fs.writeFileSync(file, formatted_content);
          reformatted++;
        }
      } catch (err) {
        // Skip errors
      }
    }
    console.log(`✅ Re-formatted ${reformatted} files\n`);
  }
  
  // Report
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Summary:\n');
  console.log(`   ESLint fixes: ${eslint ? 'Applied' : 'Skipped'}`);
  console.log(`   Prettier formatted: ${formatted} files`);
  console.log(`   Manual fixes: ${manualFixed} files (critical only)`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    eslintApplied: !!eslint,
    prettierFormatted: formatted,
    manualFixes: manualFixed,
    errors: errors,
  };
  fs.writeFileSync('tmp/library-fix-report.json', JSON.stringify(report, null, 2));
  console.log('📁 Report: tmp/library-fix-report.json\n');
  
  // Build test
  console.log('🧪 Testing build...\n');
  try {
    execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
    console.log('✅ BUILD SUCCESS!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 المشروع شغال!\n');
    process.exit(0);
  } catch (err) {
    const buildErrors = (err.stdout || '').toString().match(/Error:/g) || [];
    console.log(`⚠️  Build has ${buildErrors.length} errors\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
}

// Run
fixWithLibraries().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
