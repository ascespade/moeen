const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix UI component imports - convert to lowercase
    content = content.replace(
      /@\/components\/ui\/([A-Z][a-zA-Z]*)/g,
      (match, component) => {
        return `@/components/ui/${component.toLowerCase()}`;
      }
    );

    // Fix other common imports
    content = content.replace(
      /@\/components\/([A-Z][a-zA-Z]*)/g,
      (match, component) => {
        return `@/components/${component.toLowerCase()}`;
      }
    );

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
      fixImports(filePath);
    }
  });
}

// Start fixing from src directory
console.log('🔧 Starting comprehensive import fixes...');
fixAllFiles('./src');
console.log('✅ All import fixes completed!');
