import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { logger } from '@/lib/utils/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Security: Require authentication
    const authResult = await requireAuth([])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const supabase = await createClient();

    // Mark notification as read
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', id)
      // Ensure user can only mark their own notifications as read
      .or(
        `user_id.eq.${authResult.user.id},recipientId.eq.${authResult.user.id},recipient_id.eq.${authResult.user.id}`
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to mark notification as read',
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Notification not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Error in /api/notifications/[id]/read:', error, {});
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Support PATCH method as well
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}
