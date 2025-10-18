import fs from 'fs';
import path from 'path';
import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';

let LOG_DIR = '/home/ubuntu/workspace/projects/moeen/logs';

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let taskFile = path.join(LOG_DIR, 'tasks.json');

    if (!fs.existsSync(taskFile)) {
      return import { NextResponse } from "next/server";.json({
        total_tasks: 100,
        current_task: 1,
        completed_tasks: 0,
        failed_tasks: 0,
        progress_percentage: 0,
        status: 'not_started',
        last_update: new Date().toISOString(),
        estimated_completion: null
      });
    }

    let taskData = JSON.parse(fs.readFileSync(taskFile, 'utf8'));
    return import { NextResponse } from "next/server";.json(taskData);
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to read task status' },
      { status: 500 }
    );
  }
}
