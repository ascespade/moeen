const fs = require('fs');
const path = require('path');

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

function extractArabicText(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const arabicTexts = [];
  
  lines.forEach((line, index) => {
    // Skip comments and imports
    if (line.trim().startsWith('//') || line.trim().startsWith('import')) return;
    
    // Find strings with Arabic text
    const stringMatches = line.match(/["'`]([^"'`]*[\u0600-\u06FF][^"'`]*)["'`]/g);
    if (stringMatches) {
      stringMatches.forEach(match => {
        const text = match.slice(1, -1).trim();
        if (text && arabicRegex.test(text) && !arabicTexts.includes(text)) {
          arabicTexts.push(text);
        }
      });
    }
  });
  
  return arabicTexts;
}

function scanDirectory(dir) {
  const results = {};
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scan(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const texts = extractArabicText(filePath);
        if (texts.length > 0) {
          const relativePath = path.relative('src/app', filePath);
          results[relativePath] = texts;
        }
      }
    });
  }
  
  scan(dir);
  return results;
}

const results = scanDirectory('src/app');
console.log(JSON.stringify(results, null, 2));
console.log(`\n\nTotal files with Arabic: ${Object.keys(results).length}`);
console.log(`Total unique texts: ${new Set(Object.values(results).flat()).size}`);
