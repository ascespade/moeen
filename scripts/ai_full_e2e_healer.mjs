// scripts/ai_full_e2e_healer.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');
const BACKUPS = path.join(REPORTS, 'backups');
fs.mkdirSync(REPORTS, { recursive: true });
fs.mkdirSync(BACKUPS, { recursive: true });

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES_PER_TEST || '10', 10);
const MAX_WORKERS = Math.min(Math.max(1, os.cpus().length - 1), parseInt(process.env.MAX_WORKERS || '4', 10));

function nowTs() { return new Date().toISOString().replace(/[:.]/g,'-'); }
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(REPORTS,'execution.log'), line + '\n');
}

async function initSqlite() {
  const dbPath = path.join(ROOT, 'ci_memory.sqlite');
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS error_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow TEXT,
      error_message TEXT,
      error_hash TEXT UNIQUE,
      fix_action TEXT,
      fixed_by TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS improvements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component TEXT,
      change_description TEXT,
      commit_hash TEXT,
      result TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.close();
  return dbPath;
}

function backupPaths() {
  const dest = path.join(BACKUPS, `backup-${nowTs()}`);
  fs.mkdirSync(dest, { recursive: true });
  try {
    execSync(`cp -r src ${dest}/src || true`);
    execSync(`cp -r migrations ${dest}/migrations || true`);
    log(`Backed up src/ and migrations/ to ${dest}`);
  } catch(e) {
    log('Backup warning: ' + e.message);
  }
  return dest;
}

function run(cmd, opts={}) {
  log(`CMD: ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'inherit', ...opts });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}

function emitLLMPrompt(payload) {
  console.log('\n---CURSOR_LLM_PROMPT_START---');
  console.log(JSON.stringify(payload, null, 2));
  console.log('---CURSOR_LLM_PROMPT_END---\n');
}

async function attemptFixLoop(moduleName, testCmd) {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    attempt++;
    log(`Attempt ${attempt} for module ${moduleName}`);
    const runRes = run(testCmd);
    if (runRes.ok) {
      log(`Tests for ${moduleName} passed on attempt ${attempt}`);
      return { ok: true, attempts: attempt };
    }
    // record error
    const errMsg = runRes.error || 'test failed';
    const errorHash = require('crypto').createHash('sha256').update(errMsg).digest('hex').substr(0,12);
    const dbPath = path.join(ROOT, 'ci_memory.sqlite');
    try {
      const db = await open({ filename: dbPath, driver: sqlite3.Database });
      await db.run('INSERT OR IGNORE INTO error_logs (workflow,error_message,error_hash,fix_action,fixed_by) VALUES (?,?,?,?,?)', [
        moduleName, errMsg, errorHash, '', 'auto'
      ]);
      await db.close();
    } catch(e) { log('sqlite record error: ' + e.message); }

    // local auto-fixes
    log('Running local auto-fixes: eslint --fix, prettier');
    run('npx eslint --fix src || true');
    run('npx prettier --write src || true');

    // escalate to Cursor LLM
    log('Escalating to Cursor LLM for synthesized patch');
    emitLLMPrompt({
      action: 'synthesize_patch',
      module: moduleName,
      failing_output: errMsg,
      goal: 'Provide unified-diff patch and reversible SQL migrations for failing tests. Include new test cases if needed.'
    });

    // wait briefly for Cursor to act
    await new Promise(r => setTimeout(r, 3000));
  }
  return { ok: false, attempts: MAX_RETRIES };
}

async function runModuleFlow(moduleName) {
  log(`Running flow for module: ${moduleName}`);
  const genTestPath = path.join(ROOT, 'tests', 'generated', moduleName);
  if (!fs.existsSync(genTestPath)) fs.mkdirSync(genTestPath, { recursive: true });
  const testCmd = `npx playwright test tests/generated/${moduleName} --reporter=list --workers=${MAX_WORKERS}`;
  const result = await attemptFixLoop(moduleName, testCmd);
  return result;
}

async function detectModules() {
  const src = path.join(ROOT, 'src');
  if (!fs.existsSync(src)) return [];
  return fs.readdirSync(src).filter(n => fs.statSync(path.join(src,n)).isDirectory());
}

async function main() {
  log('Starting AI Full E2E Healer');
  await initSqlite();
  backupPaths();
  run('npm ci || npm install');
  run('npx playwright install --with-deps || npx playwright install');

  const modules = await detectModules();
  log('Detected modules: ' + JSON.stringify(modules));

  // generate ≥100 tests per module
  emitLLMPrompt({
    action: 'generate_tests',
    modules,
    instructions: 'Generate ≥100 Playwright + Supawright tests per module covering UI, DB, edge cases, concurrency, auth, navigation. Idempotent and isolated.'
  });

  await new Promise(r => setTimeout(r, 5000));

  const moduleResults = [];
  for (const m of modules) {
    const r = await runModuleFlow(m);
    moduleResults.push({ module: m, ...r });
  }

  // global integration
  log('Running global integration checks');
  const globalRes = run('npx supawright test --full --ci');
  const playwrightFull = run('npx playwright test --reporter=list --workers=' + MAX_WORKERS);

  const report = {
    runId: `run-${nowTs()}`,
    timestamp: new Date().toISOString(),
    modules: moduleResults,
    global: { supawright_ok: globalRes.ok, playwright_ok: playwrightFull.ok },
    summary: { overallStatus: moduleResults.every(r=>r.ok) && globalRes.ok && playwrightFull.ok ? 'OK' : 'FAIL' }
  };
  fs.writeFileSync(path.join(REPORTS,'ai_validation_report.json'), JSON.stringify(report,null,2));
  log('AI Full E2E Healer finished.');
}

main().catch(e=>log('Fatal error: '+e.message));