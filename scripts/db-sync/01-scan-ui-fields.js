#!/usr/bin/env node
/**
 * UI Fields Scanner
 * Scans codebase for form inputs, selectors, and API fields
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const UI_FIELDS = {
  pages: {},
  components: {},
  api_endpoints: {},
  all_fields: new Set(),
};

// Scan patterns
const PATTERNS = {
  tsx: 'src/**/*.{tsx,jsx,ts,js}',
  api: 'src/app/api/**/*.ts',
};

function extractFieldsFromFile(filePath, content) {
  const fields = new Set();
  
  // Extract input names
  const inputRegex = /name=["']([^"']+)["']/g;
  let match;
  while ((match = inputRegex.exec(content)) !== null) {
    fields.add(match[1]);
  }
  
  // Extract data-testid
  const testIdRegex = /data-testid=["']([^"']+)["']/g;
  while ((match = testIdRegex.exec(content)) !== null) {
    fields.add(match[1]);
  }
  
  // Extract form field references
  const fieldRefRegex = /(?:field|column|name):\s*["']([a-zA-Z_][a-zA-Z0-9_]*)["']/g;
  while ((match = fieldRefRegex.exec(content)) !== null) {
    fields.add(match[1]);
  }
  
  // Extract from('table').select('field1, field2')
  const selectRegex = /\.select\(['"](.*?)['"]\)/g;
  while ((match = selectRegex.exec(content)) !== null) {
    const selectFields = match[1].split(',').map(f => f.trim().split(' ')[0]);
    selectFields.forEach(f => fields.add(f));
  }
  
  // Extract .insert({ field: value })
  const insertRegex = /\.insert\(\{([^}]+)\}\)/g;
  while ((match = insertRegex.exec(content)) !== null) {
    const objContent = match[1];
    const fieldMatches = objContent.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g);
    for (const fieldMatch of fieldMatches) {
      fields.add(fieldMatch[1]);
    }
  }
  
  return Array.from(fields);
}

async function scanCodebase() {
  console.log('🔍 Scanning codebase for UI fields...\n');
  
  // Scan all TypeScript/JavaScript files using find
  const filesOutput = execSync('find src -type f \\( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \\)', { cwd: '/workspace' }).toString();
  const files = filesOutput.trim().split('\n').filter(f => f);
  
  let totalFields = 0;
  
  for (const file of files) {
    const fullPath = file.startsWith('/') ? file : path.join('/workspace', file);
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const fields = extractFieldsFromFile(fullPath, content);
      
      if (fields.length > 0) {
        const relativePath = file;
        
        if (file.includes('/api/')) {
          UI_FIELDS.api_endpoints[relativePath] = fields;
        } else if (file.includes('/components/')) {
          UI_FIELDS.components[relativePath] = fields;
        } else if (file.includes('/app/')) {
          UI_FIELDS.pages[relativePath] = fields;
        }
        
        fields.forEach(f => UI_FIELDS.all_fields.add(f));
        totalFields += fields.length;
      }
    } catch (err) {
      // Skip unreadable files
    }
  }
  
  // Convert Set to Array
  UI_FIELDS.all_fields = Array.from(UI_FIELDS.all_fields).sort();
  
  console.log(`✅ Scanned ${files.length} files`);
  console.log(`✅ Found ${UI_FIELDS.all_fields.length} unique UI fields`);
  console.log(`   - Pages: ${Object.keys(UI_FIELDS.pages).length}`);
  console.log(`   - Components: ${Object.keys(UI_FIELDS.components).length}`);
  console.log(`   - API Endpoints: ${Object.keys(UI_FIELDS.api_endpoints).length}\n`);
  
  // Save results
  fs.writeFileSync(
    '/workspace/tmp/ui-fields-scan.json',
    JSON.stringify(UI_FIELDS, null, 2)
  );
  
  console.log('📁 Saved: tmp/ui-fields-scan.json\n');
  
  // Sample output
  console.log('📋 Sample fields found:');
  UI_FIELDS.all_fields.slice(0, 20).forEach(f => console.log(`   - ${f}`));
  if (UI_FIELDS.all_fields.length > 20) {
    console.log(`   ... and ${UI_FIELDS.all_fields.length - 20} more\n`);
  }
  
  return UI_FIELDS;
}

// Run if called directly
if (require.main === module) {
  scanCodebase().catch(console.error);
}

module.exports = { scanCodebase };
