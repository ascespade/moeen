import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth/authorize';

// Support both Windows and Linux paths
const LOG_DIR = process.env.LOG_DIR ||
  (process.platform === 'win32'
    ? path.join(process.cwd(), 'logs')
    : '/home/ubuntu/workspace/projects/moeen/logs')
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
;

export async function GET(request: NextRequest) {
  try {
    const taskFile = path.join(LOG_DIR, 'tasks.json');

    if (!fs.existsSync(taskFile)) {
      return NextResponse.json({
        total_tasks: 100,
        current_task: 1,
        completed_tasks: 0,
        failed_tasks: 0,
        progress_percentage: 0,
        status: 'not_started',
        last_update: new Date().toISOString(),
        estimated_completion: null,
      });
    }

    const taskData = JSON.parse(fs.readFileSync(taskFile, 'utf8'));
    return NextResponse.json(taskData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read task status' },
      { status: 500 }
    );
  }
}
