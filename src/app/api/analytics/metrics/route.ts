import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { PermissionManager } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  try {
    // Security: Require authentication for analytics metrics
    const authResult = await requireAuth(['admin', 'supervisor', 'staff'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions using unified permission system
    const userPermissions = PermissionManager.getUserPermissions(
      authResult.user.role,
      authResult.user.meta?.permissions || []
    );

    if (!PermissionManager.canAccess(userPermissions, 'analytics', 'view')) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { name, value, timestamp } = await request.json();

    // Validate request
    if (!name || typeof value !== 'number' || !timestamp) {
      return NextResponse.json(
        { error: 'Invalid metrics data' },
        { status: 400 }
      );
    }

    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      const supabase = getServiceSupabase();

      // Insert into performance_metrics table
      const { error } = await supabase.from('performance_metrics').insert({
        metric_name: name,
        metric_value: value,
        timestamp: new Date(timestamp).toISOString(),
      });

      if (error) {
        // Error logged by supabase client
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process performance metrics' },
      { status: 500 }
    );
  }
}
