import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

import fs from 'fs';
import path from 'path';

type ProgressLine = {
  time: string;
  module: string;
  attempt: number;
  percent: number;
  status: 'ok' | 'failed' | 'retrying';
};

export async function GET() {
  try {
    const root = process.cwd();
    const logPath = path.join(root, 'tmp', 'progress.log');

    let lines: ProgressLine[] = [];
    if (fs.existsSync(logPath)) {
      const raw = fs.readFileSync(logPath, 'utf8');
      lines = raw
        .split(/\r?\n/)
        .filter(Boolean)
        .map((l) => {
          try {
            return JSON.parse(l) as ProgressLine;
          } catch {
            return null as any;
          }
        })
        .filter((x): x is ProgressLine => !!x);
    }

    const modules: Record<string, { percent: number; attempts: number; status: string; lastTime: string }> = {};
    for (const entry of lines) {
      modules[entry.module] = {
        percent: entry.percent,
        attempts: entry.attempt,
        status: entry.status,
        lastTime: entry.time,
      };
    }

    const lastUpdate = lines.length ? lines[lines.length - 1].time : null;

    return NextResponse.json({
      time: new Date().toISOString(),
      lastUpdate,
      count: lines.length,
      modules,
      lines: lines.slice(-200),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
