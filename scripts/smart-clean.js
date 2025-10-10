// scripts/smart-clean.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const safeRootFolders = new Set(["src", "public", "scripts", "node_modules", ".git", "docs"]);
const allowedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".scss",
  ".env",
  ".md",
]);

function walkAndClean(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    // Skip safe folders at root
    if (dir === root && safeRootFolders.has(file)) continue;

    if (stat.isDirectory()) {
      walkAndClean(full);
      // Remove empty folders (ignore protected)
      if (fs.existsSync(full) && fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
        console.log(`🗑️ Removed empty folder: ${full}`);
      }
    } else {
      const ext = path.extname(file);
      if (!allowedExtensions.has(ext)) {
        // never delete inside protected folders
        if (full.includes("node_modules") || full.includes(".git")) continue;
        fs.unlinkSync(full);
        console.log(`🧹 Deleted garbage file: ${full}`);
      }
    }
  }
}

walkAndClean(root);
console.log("✅ Smart clean completed safely.");
