import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth/authorize';

const LOG_DIR = '/home/ubuntu/workspace/projects/moeen/logs';

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

    const logFile = path.join(LOG_DIR, 'continuous-agent.log');

    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ logs: [] });
    }

    const logContent = fs.readFileSync(logFile, 'utf8');
    const logs = logContent
      .split('\n')
      .filter(line => line.trim())
      .slice(-50); // Last 50 lines

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}
