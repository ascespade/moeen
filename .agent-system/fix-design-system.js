#!/usr/bin/env node

let fs = require('fs');

let filePath = 'src/components/providers/DesignSystemProvider.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Fix the file by ensuring proper structure
content = content.replace(
  /export function useDesignSystem\(\): DesignSystemContextValue \{[\s\S]*?\}/g,
  `
  let context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error("useDesignSystem must be used within a DesignSystemProvider");
  }
  return context;
}`
);

fs.writeFileSync(filePath, content);
// console.log('✅ Fixed DesignSystemProvider.tsx');
