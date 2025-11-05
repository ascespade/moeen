/**
 * Monitoring API Route
 * مسار API للمراقبة
 */

import { NextResponse } from 'next/server';
import { monitoringSystem } from '@/lib/monitoring/MonitoringSystem';
import { workerPool } from '@/lib/monitoring/worker-pool';

export async function GET() {
  try {
    const report = monitoringSystem.getReport();
    const status = workerPool.getStatus();

    return NextResponse.json({
      ...report,
      workerPool: status,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error.message || 'Failed to get monitoring data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, taskId, updates } = body;

    if (action === 'updateTask' && taskId && updates) {
      monitoringSystem.updateTask(taskId, updates);
      return NextResponse.json({ success: true });
    }

    if (action === 'reset') {
      monitoringSystem.reset();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error.message || 'Failed to update monitoring' },
      { status: 500 }
    );
  }
}

