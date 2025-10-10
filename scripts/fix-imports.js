// scripts/fix-imports.js
import fs from "fs";
import path from "path";
import glob from "glob";

const files = glob.sync("src/**/*.{ts,tsx,js,jsx}");

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");

  // Merge duplicate named imports
  const importRegex = /^import\s+{([^}]+)}\s+from\s+["']([^"']+)["'];?/gm;
  const imports = {};
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const [, items, module] = match;
    const parts = items
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    if (!imports[module]) imports[module] = new Set();
    parts.forEach((p) => imports[module].add(p));
  }

  let newContent = content.replace(importRegex, "");
  const merged = Object.entries(imports)
    .map(([module, set]) => `import { ${Array.from(set).join(", ")} } from '${module}';`)
    .join("\n");

  if (merged) {
    newContent = merged + "\n" + newContent.trimStart();
    fs.writeFileSync(file, newContent);
    console.log(`✅ Imports merged in: ${file}`);
  }
}

console.log("✅ Imports cleaned and merged.");
