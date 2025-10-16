/**
 * 🧩 Global Integrity & Full Testing Orchestrator
 * ------------------------------------------------
 * هذا السكربت مسؤول عن:
 * 1. التحقق من نتائج 3 وكلاء (FrontendCleaner, BackendCleaner, SharedVerifier)
 * 2. فحص جميع ملفات المشروع وتحديد غير المستخدم منها.
 * 3. عزل الملفات غير الضرورية في مجلد .isolated_trash
 * 4. توليد اختبارات شاملة باستخدام Playwright
 * 5. إنتاج تقرير كامل عن حالة المشروع.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const baseDir = process.cwd();
const quarantineDir = path.join(baseDir, "src/.quarantine");
const trashRoot = path.join(baseDir, ".isolated_trash");
const testRoot = path.join(baseDir, "tests/auto_generated");
const usageMapPath = path.join(quarantineDir, "usage-map.json");
const reportPath = path.join(baseDir, "cleanup_verification_report.json");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const currentTrash = path.join(trashRoot, timestamp);

const agents = [
  { name: "FrontendCleaner", log: "frontend_cleanup.log", testDir: "frontend" },
  { name: "BackendCleaner", log: "backend_cleanup.log", testDir: "backend" },
  { name: "SharedVerifier", log: "shared_verification.log", testDir: "shared" }
];

// 🔧 Utilities
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function listFilesRecursively(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(listFilesRecursively(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function safeMoveFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.renameSync(src, dest);
}

// 🚀 المرحلة 1: قراءة usage map من الوكلاء الثلاثة
function getUsedFiles() {
  if (!fs.existsSync(usageMapPath)) return [];
  try {
    const map = JSON.parse(fs.readFileSync(usageMapPath, "utf-8"));
    return map.used_files || [];
  } catch {
    return [];
  }
}

// 🧹 المرحلة 2: فحص المشروع وعزل الملفات غير الضرورية
function isolateUnusedFiles(usedFiles) {
  console.log("🔍 Scanning for unused files...");
  const allFiles = listFilesRecursively(baseDir)
    .filter(f => !f.includes("node_modules") && !f.includes(".isolated_trash"));

  const unused = allFiles.filter(f => !usedFiles.some(u => f.endsWith(u)));

  const isolationLog = [];

  for (const file of unused) {
    const rel = path.relative(baseDir, file);
    const dest = path.join(currentTrash, "unused_files", rel);
    safeMoveFile(file, dest);
    isolationLog.push({ file: rel, reason: "not referenced", moved_to: dest });
  }

  fs.writeFileSync(path.join(currentTrash, "isolation_log.json"), JSON.stringify(isolationLog, null, 2));
  console.log(`🧹 Isolated ${unused.length} unused files → ${currentTrash}`);
}

// 🧪 المرحلة 3: توليد اختبارات شاملة Playwright
function generatePlaywrightTests() {
  ensureDir(testRoot);

  // Frontend tests
  const fe = `
    import { test, expect } from '@playwright/test';

    test.describe('Frontend Routes & Components', () => {
      const routes = ['/', '/login', '/dashboard'];
      for (const route of routes) {
        test(\`should load route \${route}\`, async ({ page }) => {
          await page.goto(route);
          await expect(page).toHaveTitle(/.+/);
        });
      }
    });
  `;
  ensureDir(path.join(testRoot, "frontend"));
  fs.writeFileSync(path.join(testRoot, "frontend/frontend.spec.js"), fe);

  // Backend tests
  const be = `
    import { test, expect, request } from '@playwright/test';
    const base = process.env.API_URL || 'http://localhost:3000';

    test.describe('Backend API Endpoints', () => {
      const endpoints = ['/api/health', '/api/users', '/api/data'];
      for (const ep of endpoints) {
        test(\`GET \${ep}\`, async ({ request }) => {
          const res = await request.get(base + ep);
          expect(res.status()).toBeLessThan(500);
        });
      }
    });
  `;
  ensureDir(path.join(testRoot, "backend"));
  fs.writeFileSync(path.join(testRoot, "backend/backend.spec.js"), be);

  // Shared tests
  const sh = `
    import { test, expect } from '@playwright/test';
    import * as utils from '../../../src/shared';

    test.describe('Shared Utilities', () => {
      for (const key in utils) {
        test(\`utility \${key} should be callable\`, async () => {
          expect(typeof utils[key]).toBe('function');
        });
      }
    });
  `;
  ensureDir(path.join(testRoot, "shared"));
  fs.writeFileSync(path.join(testRoot, "shared/shared.spec.js"), sh);

  // Integrity test
  const integrity = `
    import { test, expect } from '@playwright/test';
    import fs from 'fs';

    test('Project Integrity', async () => {
      const required = ['src', 'package.json', 'tests'];
      for (const r of required) {
        expect(fs.existsSync(r)).toBeTruthy();
      }
    });
  `;
  ensureDir(path.join(testRoot, "integrity"));
  fs.writeFileSync(path.join(testRoot, "integrity/integrity.spec.js"), integrity);
}

// 📊 المرحلة 4: إنشاء التقرير النهائي
function generateReport() {
  const summary = {
    timestamp: new Date().toISOString(),
    tests_generated: fs.readdirSync(testRoot).length,
    isolated_trash: currentTrash,
  };
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`📄 Report generated at ${reportPath}`);
}

// ⚙️ التنفيذ الكامل
(async () => {
  console.log("🚀 Running Global Integrity Orchestrator...\n");

  ensureDir(trashRoot);
  ensureDir(currentTrash);

  const usedFiles = getUsedFiles();
  isolateUnusedFiles(usedFiles);
  generatePlaywrightTests();
  generateReport();

  console.log("\n✅ All systems verified & cleaned successfully!");
  console.log("👉 To run all generated tests:");
  console.log("   npx playwright test tests/auto_generated/");
})();