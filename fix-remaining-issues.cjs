const fs = require('fs');
const path = require('path');

// Function to fix remaining issues in a file
function fixRemainingIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix function names starting with __
    content = content.replace(/function __([A-Z][a-zA-Z]*)/g, 'function $1');
    content = content.replace(
      /export default function __([A-Z][a-zA-Z]*)/g,
      'export default function $1'
    );
    content = content.replace(
      /export function __([A-Z][a-zA-Z]*)/g,
      'export function $1'
    );

    // Fix variable names starting with __
    content = content.replace(/const __([a-zA-Z_][a-zA-Z0-9_]*)/g, 'const $1');
    content = content.replace(/let __([a-zA-Z_][a-zA-Z0-9_]*)/g, 'let $1');
    content = content.replace(/var __([a-zA-Z_][a-zA-Z0-9_]*)/g, 'var $1');

    // Fix undefined components
    content = content.replace(/\b_([A-Z][a-zA-Z]*)\b/g, '$1');

    // Fix Icon component references
    content = content.replace(/\bIcon\b/g, 'Sun');

    // Fix ThemeContext references
    content = content.replace(/\bThemeContext\b/g, 'ThemeContext');

    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all TypeScript/TSX files
function fixAllFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith('.') &&
      file !== 'node_modules'
    ) {
      fixAllFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixRemainingIssues(filePath);
    }
  });
}

// Start fixing from src directory
console.log('🔧 Starting remaining issues fixes...');
fixAllFiles('./src');
console.log('✅ All remaining issues fixed!');
