import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth/authorize';

// Support both Windows and Linux paths
const LOG_DIR =
  process.env.LOG_DIR ||
  (process.platform === 'win32'
    ? path.join(process.cwd(), 'logs')
    : '/home/ubuntu/workspace/projects/moeen/logs');

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const completionFile = path.join(LOG_DIR, 'completion-status.json');

    if (!fs.existsSync(completionFile)) {
      return NextResponse.json({
        status: 'in_progress',
        message: 'Tasks still running',
      });
    }

    const completionData = JSON.parse(fs.readFileSync(completionFile, 'utf8'));
    return NextResponse.json(completionData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read completion status' },
      { status: 500 }
    );
  }
}
