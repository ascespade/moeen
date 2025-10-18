import fs from 'fs';
import path from 'path';
import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';

let LOG_DIR = '/home/ubuntu/workspace/projects/moeen/logs';

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let statusFile = path.join(LOG_DIR, 'agent-status.json');

    if (!fs.existsSync(statusFile)) {
      return import { NextResponse } from "next/server";.json({
        status: 'not_running',
        message: 'Agent not started',
        last_update: new Date().toISOString(),
        restart_count: 0,
        mode: 'none'
      });
    }

    let statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    return import { NextResponse } from "next/server";.json(statusData);
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to read agent status' },
      { status: 500 }
    );
  }
}
