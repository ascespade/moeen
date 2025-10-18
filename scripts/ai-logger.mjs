import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DB_PATH = path.join(projectRoot, 'ai_logs.db');
const DASHBOARD_DIR = path.join(projectRoot, 'dashboard');
const LOGS_JSON = path.join(DASHBOARD_DIR, 'logs.json');

// إنشاء قاعدة البيانات وجدول السجلات
async function initDatabase() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ai_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      duration INTEGER,
      linesChanged INTEGER,
      qualityScore INTEGER,
      notes TEXT,
      branch TEXT,
      commit TEXT,
      author TEXT,
      timestamp INTEGER
    );
  `);

  return db;
}

// تسجيل نتيجة عملية AI
export async function logAIResult(result) {
  try {
    const db = await initDatabase();

    await db.run(
      `INSERT INTO ai_logs (
        date, status, type, duration, linesChanged, 
        qualityScore, notes, branch, commit, author, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        new Date().toISOString(),
        result.status || 'unknown',
        result.type || 'general',
        result.duration || 0,
        result.linesChanged || 0,
        result.qualityScore || 0,
        result.notes || '',
        result.branch || 'main',
        result.commit || '',
        result.author || 'AI Agent',
        Date.now()
      ]
    );

    // تحويل القاعدة إلى JSON لعرضها في Dashboard
    await exportLogsToJSON(db);

    await db.close();
    console.log('✅ Logged AI result & exported dashboard/logs.json');
    
    return true;
  } catch (error) {
    console.error(`❌ Error logging AI result: ${error.message}`);
    return false;
  }
}

// تصدير السجلات إلى JSON
async function exportLogsToJSON(db) {
  try {
    // إنشاء مجلد Dashboard إذا لم يكن موجوداً
    await fs.mkdir(DASHBOARD_DIR, { recursive: true });

    // جلب جميع السجلات
    const logs = await db.all('SELECT * FROM ai_logs ORDER BY id DESC LIMIT 100');
    
    // حساب الإحصائيات
    const stats = {
      total: logs.length,
      successful: logs.filter(l => l.status === 'success').length,
      failed: logs.filter(l => l.status === 'failed').length,
      avgDuration: logs.reduce((sum, l) => sum + (l.duration || 0), 0) / logs.length || 0,
      avgQuality: logs.reduce((sum, l) => sum + (l.qualityScore || 0), 0) / logs.length || 0,
      totalLinesChanged: logs.reduce((sum, l) => sum + (l.linesChanged || 0), 0)
    };

    const exportData = {
      lastUpdated: new Date().toISOString(),
      stats,
      logs
    };

    await fs.writeFile(LOGS_JSON, JSON.stringify(exportData, null, 2), 'utf8');
    console.log(`📊 Exported ${logs.length} logs to ${LOGS_JSON}`);
  } catch (error) {
    console.error(`❌ Error exporting logs: ${error.message}`);
  }
}

// جلب السجلات
export async function getLogs(limit = 100) {
  try {
    const db = await initDatabase();
    const logs = await db.all('SELECT * FROM ai_logs ORDER BY id DESC LIMIT ?', limit);
    await db.close();
    return logs;
  } catch (error) {
    console.error(`❌ Error getting logs: ${error.message}`);
    return [];
  }
}

// حذف السجلات القديمة
export async function cleanOldLogs(daysToKeep = 30) {
  try {
    const db = await initDatabase();
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await db.run(
      'DELETE FROM ai_logs WHERE timestamp < ?',
      cutoffTime
    );
    
    await exportLogsToJSON(db);
    await db.close();
    
    console.log(`🧹 Cleaned ${result.changes} old logs`);
    return result.changes;
  } catch (error) {
    console.error(`❌ Error cleaning logs: ${error.message}`);
    return 0;
  }
}

// تصدير السجلات يدوياً
export async function exportLogs() {
  try {
    const db = await initDatabase();
    await exportLogsToJSON(db);
    await db.close();
    console.log('✅ Logs exported successfully');
  } catch (error) {
    console.error(`❌ Error exporting logs: ${error.message}`);
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'export':
      await exportLogs();
      break;
      
    case 'clean':
      const days = parseInt(process.argv[3]) || 30;
      await cleanOldLogs(days);
      break;
      
    case 'list':
      const limit = parseInt(process.argv[3]) || 10;
      const logs = await getLogs(limit);
      console.log(JSON.stringify(logs, null, 2));
      break;
      
    default:
      console.log('Usage: node ai-logger.mjs [export|clean|list]');
      console.log('  export - Export logs to JSON');
      console.log('  clean [days] - Clean logs older than N days (default: 30)');
      console.log('  list [limit] - List last N logs (default: 10)');
      break;
  }
}
