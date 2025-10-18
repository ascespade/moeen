#!/usr/bin/env node
/**
 * 🔧 Syntax Fixer - يصلح syntax errors التي لا تستطيع المكتبات إصلاحها
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('\n🔧 Syntax Fixer Starting...\n');

const BACKUP = 'tmp/backup-syntax-' + Date.now();
execSync(`mkdir -p ${BACKUP} && cp -r src ${BACKUP}/`, { stdio: 'pipe' });
console.log('✅ Backup created\n');

// Get lint errors
function getLintErrors() {
  try {
    execSync('npm run lint', { stdio: 'pipe' });
    return [];
  } catch (err) {
    const output = (err.stdout || '').toString();
    const errors = [];
    const lines = output.split('\n');
    let currentFile = null;
    
    for (const line of lines) {
      if (line.startsWith('./src/')) {
        currentFile = line.trim();
      } else if (line.includes('Error: Parsing error:') && currentFile) {
        const match = line.match(/(\d+):(\d+)\s+Error: Parsing error: (.+)/);
        if (match) {
          errors.push({
            file: currentFile,
            line: parseInt(match[1]),
            column: parseInt(match[2]),
            message: match[3]
          });
        } else if (line.includes('Error: Parsing error:')) {
          errors.push({
            file: currentFile,
            message: line.split('Error: Parsing error:')[1].trim()
          });
        }
      }
    }
    
    return errors;
  }
}

// Fix array syntax issues
function fixArraySyntax(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;
  
  // Pattern: array with objects missing { }
  const lines = content.split('\n');
  const fixed = [];
  let inArray = false;
  let arrayIndent = '';
  let needsOpen = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trim = line.trim();
    
    // Detect array start
    if (trim.match(/const\s+\w+.*=\s*\[/)) {
      inArray = true;
      arrayIndent = line.match(/^(\s*)/)[1];
      fixed.push(line);
      
      // Check if next line is property without {
      if (i + 1 < lines.length && lines[i + 1].trim().match(/^\w+:/)) {
        fixed.push(arrayIndent + '  {');
        needsOpen = false;
        continue;
      }
      continue;
    }
    
    // In array
    if (inArray) {
      // End of array
      if (trim === '];') {
        if (needsOpen) {
          fixed.push(arrayIndent + '  },');
          needsOpen = false;
        }
        fixed.push(line);
        inArray = false;
        continue;
      }
      
      // New object (id: property at start)
      if (trim.match(/^id:\s*"/)) {
        if (needsOpen) {
          // Close previous object
          fixed.push(arrayIndent + '  },');
        }
        // Open new object
        fixed.push(arrayIndent + '  {');
        fixed.push(line);
        needsOpen = true;
        continue;
      }
      
      // Object closing brace
      if (trim === '},') {
        fixed.push(line);
        needsOpen = false;
        continue;
      }
      
      // Just a closing brace (error)
      if (trim === '}' && needsOpen) {
        fixed.push(arrayIndent + '  },');
        needsOpen = false;
        continue;
      }
      
      // Duplicate closing (},},)
      if (trim === '},},') {
        fixed.push(arrayIndent + '  },');
        needsOpen = false;
        continue;
      }
    }
    
    fixed.push(line);
  }
  
  content = fixed.join('\n');
  
  if (content !== original) {
    fs.writeFileSync(filepath, content);
    return true;
  }
  
  return false;
}

// Fix JSX parent element issues
function fixJSXParent(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;
  
  // Find return statements with multiple top-level JSX
  const returnPattern = /return\s*\(([\s\S]*?)\);/g;
  
  content = content.replace(returnPattern, (match, jsx) => {
    // Count top-level elements
    const lines = jsx.trim().split('\n');
    let topLevel = 0;
    let depth = 0;
    
    for (const line of lines) {
      const opens = (line.match(/</g) || []).length;
      const closes = (line.match(/>/g) || []).length;
      
      if (depth === 0 && line.trim().startsWith('<')) {
        topLevel++;
      }
      
      depth += opens - closes;
    }
    
    // If multiple top-level, wrap in fragment
    if (topLevel > 1) {
      return `return (\n    <>\n${jsx}\n    </>\n  );`;
    }
    
    return match;
  });
  
  if (content !== original) {
    fs.writeFileSync(filepath, content);
    return true;
  }
  
  return false;
}

// Main
console.log('🔍 Analyzing lint errors...\n');
const errors = getLintErrors();
console.log(`Found ${errors.length} parsing errors\n`);

const uniqueFiles = [...new Set(errors.map(e => e.file))];
console.log(`Affected files: ${uniqueFiles.length}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Fixing syntax issues...\n');

let fixed = 0;

for (const file of uniqueFiles) {
  try {
    const filepath = file.replace('./', '');
    
    if (fixArraySyntax(filepath)) {
      console.log(`✅ ${filepath} - array syntax`);
      fixed++;
    }
    
    if (fixJSXParent(filepath)) {
      console.log(`✅ ${filepath} - JSX parent`);
      fixed++;
    }
    
  } catch (err) {
    console.log(`⚠️  ${file}: ${err.message}`);
  }
}

console.log(`\n✅ Fixed ${fixed} files\n`);

// Run Prettier after fixes
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Running Prettier...\n');

try {
  execSync('npx prettier --write "src/**/*.{ts,tsx}" 2>/dev/null', { stdio: 'pipe', timeout: 60000 });
  console.log('✅ Prettier complete\n');
} catch (err) {}

// Test
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Testing build...\n');

try {
  execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
  console.log('✅ BUILD SUCCESS!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎉 المشروع شغال بدون أخطاء!\n');
  process.exit(0);
} catch (err) {
  const newErrors = getLintErrors();
  console.log(`⚠️  ${newErrors.length} errors remaining\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}
