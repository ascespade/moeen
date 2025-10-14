#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function getAllFiles(dir, exts) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip heavy or irrelevant folders
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git"
      )
        continue;
      out.push(...getAllFiles(full, exts));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.includes(ext)) out.push(full);
    }
  }
  return out;
}

function normalizeUseClient(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const startsWithDirective =
    src.startsWith('"use client";') || src.startsWith("'use client';");
  const hasDirective = /(^|\n)\s*(?:"use client";|'use client';)/.test(src);
  if (!hasDirective) return false;
  if (startsWithDirective) return false;

  const without = src.replace(
    /(^|\n)\s*(?:"use client";|'use client';)\s*/g,
    "\n",
  );
  const fixed = `"use client";\n${without.trimStart()}`;
  fs.writeFileSync(filePath, fixed);
  return true;
}

(function main() {
  const root = process.cwd();
  const srcDir = path.join(root, "src");
  if (!fs.existsSync(srcDir)) {
    console.error("src directory not found");
    process.exit(1);
  }
  const files = getAllFiles(srcDir, [".tsx", ".ts"]);
  let changed = 0;
  for (const f of files) {
    try {
      if (normalizeUseClient(f)) changed++;
    } catch (e) {
      // ignore per-file errors
    }
  }
  console.log(`rewrite-client-directive: updated ${changed} files`);
})();
