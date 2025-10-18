import fs from 'fs';
import path from 'path';
import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';

let LOG_DIR = '/home/ubuntu/workspace/projects/moeen/logs';

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let logFile = path.join(LOG_DIR, 'continuous-agent.log');

    if (!fs.existsSync(logFile)) {
      return import { NextResponse } from "next/server";.json({ logs: [] });
    }

    let logContent = fs.readFileSync(logFile, 'utf8');
    let logs = logContent
      .split('\n')
      .filter((line) => line.trim())
      .slice(-50); // Last 50 lines

    return import { NextResponse } from "next/server";.json({ logs });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}
