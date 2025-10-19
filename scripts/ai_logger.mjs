import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

export async function logAIResult(result) {
  const db = await open({ filename: './ai_logs.db', driver: sqlite3.Database });
  await db.exec(
    `CREATE TABLE IF NOT EXISTS ai_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, status TEXT, type TEXT, duration INTEGER, linesChanged INTEGER, qualityScore INTEGER, notes TEXT);`
  );
  await db.run(
    `INSERT INTO ai_logs (date,status,type,duration,linesChanged,qualityScore,notes) VALUES (?,?,?,?,?,?,?)`,
    [
      new Date().toISOString(),
      result.status,
      result.type,
      result.duration || 0,
      result.linesChanged || 0,
      result.qualityScore || 0,
      result.notes || '',
    ]
  );
  const logs = await db.all('SELECT * FROM ai_logs ORDER BY id DESC');
  fs.mkdirSync('./dashboard', { recursive: true });
  fs.writeFileSync('./dashboard/logs.json', JSON.stringify(logs, null, 2));
  await db.close();
  console.log('Logged result and exported dashboard/logs.json');
}

// if run directly: export all logs
if (require.main === module) {
  (async () => {
    const db = await open({
      filename: './ai_logs.db',
      driver: sqlite3.Database,
    });
    const logs = await db.all('SELECT * FROM ai_logs ORDER BY id DESC');
    fs.writeFileSync('./dashboard/logs.json', JSON.stringify(logs, null, 2));
    await db.close();
    console.log('Exported logs.json');
  })();
}
