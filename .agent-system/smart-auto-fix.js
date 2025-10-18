#!/usr/bin/env node
/**
 * 🚀 Smart Auto-Fix - نظام ذكي يستخدم Prettier & ESLint APIs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 Smart Auto-Fix Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP = 'tmp/backup-smart-' + Date.now();
execSync(`mkdir -p ${BACKUP} && cp -r src ${BACKUP}/`, { stdio: 'pipe' });
console.log('✅ Backup created\n');

let prettier, eslint;

// Load Prettier
try {
  prettier = require('prettier');
  console.log('✅ Prettier loaded\n');
} catch (err) {
  console.log('⚠️  Installing Prettier...\n');
  execSync('npm install --save-dev prettier', { stdio: 'pipe' });
  prettier = require('prettier');
}

// Load ESLint
try {
  const { ESLint } = require('eslint');
  eslint = new ESLint({ fix: true });
  console.log('✅ ESLint loaded\n');
} catch (err) {
  console.log('⚠️  ESLint not available\n');
}

let fixed = 0;
let errors = [];

// Get all TS/TSX files
function getAllFiles(dir, ext = ['.ts', '.tsx']) {
  const files = [];
  
  function walk(d) {
    const items = fs.readdirSync(d, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(d, item.name);
      if (item.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'tmp'].includes(item.name)) {
          walk(fullPath);
        }
      } else if (ext.some(e => item.name.endsWith(e))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Fix with Prettier
async function fixWithPrettier(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Get Prettier config
    const options = await prettier.resolveConfig(filepath) || {
      parser: filepath.endsWith('.tsx') ? 'typescript' : 'typescript',
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      tabWidth: 2,
    };
    
    // Format
    const formatted = await prettier.format(content, {
      ...options,
      filepath,
    });
    
    if (formatted !== content) {
      fs.writeFileSync(filepath, formatted);
      return true;
    }
    
    return false;
  } catch (err) {
    errors.push({ file: filepath, error: 'Prettier failed: ' + err.message });
    return false;
  }
}

// Fix specific syntax issues
function fixSyntaxIssues(filepath) {
  try {
    let content = fs.readFileSync(filepath, 'utf8');
    const original = content;
    
    // Fix 1: Duplicate import statements
    content = content.replace(/\nimport\s*{\s*\nimport\s*{/g, '\nimport {');
    
    // Fix 2: "use client" must be first
    if (content.includes('"use client"') || content.includes("'use client'")) {
      // Remove all occurrences
      content = content.replace(/"use client";?\s*/g, '');
      content = content.replace(/'use client';?\s*/g, '');
      // Add at the very beginning
      content = '"use client";\n\n' + content;
    }
    
    // Fix 3: Array of objects missing opening {
    // Pattern: const x: Type[] = [
    //     id: "1",  <- missing {
    const arrayPattern = /const\s+(\w+):\s*(\w+)\[\]\s*=\s*\[\s*\n\s*id:/g;
    content = content.replace(arrayPattern, 'const $1: $2[] = [\n  {\n    id:');
    
    // Fix 4: Object in array missing closing }
    // Look for patterns like:
    //   id: "1",
    //   name: "...",
    // },  <- this is correct
    //   id: "2",  <- missing opening {
    
    const lines = content.split('\n');
    const fixed = [];
    let inArray = false;
    let inObject = false;
    let depth = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Track array start
      if (trimmed.includes('[] = [')) {
        inArray = true;
        depth = 0;
      }
      
      // Track object in array
      if (inArray && trimmed === '{') {
        inObject = true;
        depth++;
      }
      
      if (inArray && trimmed === '}' && depth > 0) {
        depth--;
        if (depth === 0) inObject = false;
      }
      
      // If we're in array but not in object, and line starts with a property
      if (inArray && !inObject && /^\s+\w+:/.test(line)) {
        // Add opening brace
        const indent = line.match(/^\s*/)[0];
        fixed.push(indent + '{');
        inObject = true;
        depth = 1;
      }
      
      // If we're in object and next line is another object or array end
      if (inArray && inObject && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if ((nextLine.startsWith('{') || nextLine === '];' || /^\w+:/.test(nextLine)) && 
            !trimmed.endsWith(',') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
          // Add closing brace
          fixed.push(line);
          const indent = line.match(/^\s*/)[0];
          fixed.push(indent.slice(0, -2) + '},');
          inObject = false;
          depth = 0;
          continue;
        }
      }
      
      fixed.push(line);
      
      // Track array end
      if (trimmed === '];') {
        inArray = false;
        inObject = false;
        depth = 0;
      }
    }
    
    content = fixed.join('\n');
    
    // Fix 5: Missing closing braces/brackets
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      content = content.trimEnd() + '\n' + '}'.repeat(openBraces - closeBraces) + '\n';
    }
    
    if (content !== original) {
      fs.writeFileSync(filepath, content);
      return true;
    }
    
    return false;
  } catch (err) {
    errors.push({ file: filepath, error: 'Syntax fix failed: ' + err.message });
    return false;
  }
}

// Fix with ESLint
async function fixWithESLint(filepath) {
  if (!eslint) return false;
  
  try {
    const results = await eslint.lintFiles([filepath]);
    await ESLint.outputFixes(results);
    
    return results.some(r => r.output);
  } catch (err) {
    errors.push({ file: filepath, error: 'ESLint failed: ' + err.message });
    return false;
  }
}

// Main
async function main() {
  console.log('🔍 Finding files...\n');
  const files = getAllFiles('src');
  console.log(`Found ${files.length} files\n`);
  
  console.log('🔧 Phase 1: Syntax Fixes\n');
  for (const file of files) {
    if (fixSyntaxIssues(file)) {
      console.log(`   ✅ ${file}`);
      fixed++;
    }
  }
  
  console.log(`\n✅ Phase 1 complete: ${fixed} files\n`);
  
  console.log('🎨 Phase 2: Prettier Format\n');
  let prettierFixed = 0;
  for (const file of files) {
    if (await fixWithPrettier(file)) {
      prettierFixed++;
    }
  }
  console.log(`\n✅ Phase 2 complete: ${prettierFixed} files formatted\n`);
  
  console.log('🔧 Phase 3: ESLint Fix\n');
  if (eslint) {
    let eslintFixed = 0;
    for (const file of files) {
      if (await fixWithESLint(file)) {
        eslintFixed++;
      }
    }
    console.log(`\n✅ Phase 3 complete: ${eslintFixed} files\n`);
  } else {
    console.log('⚠️  Phase 3 skipped (ESLint not available)\n');
  }
  
  // Report
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 Total fixed: ${fixed} files\n`);
  
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} errors:\n`);
    errors.slice(0, 5).forEach(e => {
      console.log(`   ${path.basename(e.file)}: ${e.error}`);
    });
  }
  
  // Verify
  console.log('\n🧪 Verifying build...\n');
  try {
    execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
    console.log('✅ BUILD SUCCESS!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 المشروع شغال!\n');
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      filesFixed: fixed,
      prettierFixed,
      errors: errors.length,
      buildSuccess: true,
    };
    fs.writeFileSync('tmp/smart-fix-report.json', JSON.stringify(report, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.log('⚠️  Build has issues\n');
    const buildErrors = (err.stdout || '').toString().match(/Error:/g) || [];
    console.log(`   ${buildErrors.length} build errors\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      filesFixed: fixed,
      prettierFixed,
      errors: errors.length,
      buildSuccess: false,
      buildErrors: buildErrors.length,
    };
    fs.writeFileSync('tmp/smart-fix-report.json', JSON.stringify(report, null, 2));
    
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
