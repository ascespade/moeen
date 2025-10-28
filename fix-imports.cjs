const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix React hooks
    content = content.replace(/_useState/g, 'useState');
    content = content.replace(/_useEffect/g, 'useEffect');
    content = content.replace(/_useContext/g, 'useContext');

    // Fix UI component imports
    content = content.replace(/@\/components\/ui\/_/g, '@/components/ui/');
    content = content.replace(
      /@\/components\/ui\/([A-Z][a-zA-Z]*)/g,
      '@/components/ui/$1'.toLowerCase()
    );

    // Fix component names
    content = content.replace(/function __([A-Z][a-zA-Z]*)/g, 'function $1');
    content = content.replace(
      /export default function __([A-Z][a-zA-Z]*)/g,
      'export default function $1'
    );

    // Fix undefined components
    content = content.replace(/\b_([A-Z][a-zA-Z]*)\b/g, '$1');

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
console.log('🔧 Starting import fixes...');
fixAllFiles('./src');
console.log('✅ Import fixes completed!');
