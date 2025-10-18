import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export function log(reportDir, msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(path.join(reportDir, 'execution.log'), line + '\n'); } catch(e){}
}

export function readJSON(filepath) {
  try { return JSON.parse(fs.readFileSync(filepath,'utf8')); } catch(e){ return null; }
}

export function writeFile(p, content) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); }

export function gitName() {
  try { return execSync('git config user.name').toString().trim() || 'ai-bot'; } catch { return 'ai-bot'; }
}
