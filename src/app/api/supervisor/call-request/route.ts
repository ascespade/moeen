import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/monitoring/logger';
import { requireAuth } from '@/lib/auth/authorize';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const { reason, priority = 'high' } = await request.json();

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details
    const { data: userData } = await supabase
      .from('users')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    // Get on-duty supervisor
    const { data: supervisorId, error: supervisorError } = await supabase.rpc(
      'get_on_duty_supervisor'
    );

    if (supervisorError || !supervisorId) {
      logger.error('No supervisor available', supervisorError);
      return NextResponse.json(
        { error: 'No supervisor available' },
        { status: 503 }
      );
    }

    // Get supervisor details
    const { data: supervisor } = await supabase
      .from('users')
      .select('full_name, phone')
      .eq('id', supervisorId)
      .single();

    // Create call request
    const { data: callRequest, error: callError } = await supabase
      .from('call_requests')
      .insert({
        requester_id: user.id,
        reason: reason || 'طلب مكالمة من الشاتبوت',
        priority,
        status: 'pending',
        assigned_to: supervisorId,
      })
      .select()
      .single();

    if (callError) {
      logger.error('Error creating call request', callError);
      return NextResponse.json(
        { error: 'Failed to create call request' },
        { status: 500 }
      );
    }

    // Send WhatsApp to supervisor (مجاني!)
    try {
      const whatsappMessage = `
🔴 طلب مكالمة عاجلة - مركز الهمم

👤 المستخدم: ${userData?.full_name || user.email}
📱 الجوال: ${userData?.phone || 'غير متوفر'}
⏰ الوقت: ${new Date().toLocaleTimeString('ar-SA')}

السبب: ${reason || 'غير محدد'}

الرجاء الاتصال فوراً!

---
نظام معين
      `.trim();

      // Call WhatsApp API (if supervisor has phone)
      if (supervisor?.phone) {
        await fetch('/api/notifications/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: supervisor.phone,
            message: whatsappMessage,
          }),
        });
      }

      // Create in-app notification
      await supabase.from('notifications').insert({
        user_id: supervisorId,
        title: '🔴 طلب مكالمة عاجلة',
        body: `من: ${userData?.full_name || user.email}`,
        type: 'call_requested',
        is_read: false,
      });

      // Log notification
      await supabase.from('notification_logs').insert({
        recipient_id: supervisorId,
        channel: 'whatsapp',
        status: 'sent',
      });
    } catch (notificationError) {
      logger.error('Error sending notifications', notificationError);
      // Continue anyway - request is created
    }

    logger.info('Call request created and supervisor notified', {
      requestId: callRequest.id,
      supervisorId,
      requesterName: userData?.full_name,
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك للمشرف',
      requestId: callRequest.id,
    });
  } catch (error) {
    logger.error('Error in call-request API', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: للمشرف لرؤية الطلب
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

    const supabase = await createClient();

    // Check if user is supervisor/admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['supervisor', 'admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get call requests
    const { data: requests, error } = await supabase
      .from('call_requests')
      .select(
        `
        *,
        requester:users!call_requests_requester_id_fkey(full_name, phone),
        assigned:users!call_requests_assigned_to_fkey(full_name)
      `
      )
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('Error fetching call requests', error);
      return NextResponse.json(
        { error: 'Failed to fetch requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requests: requests || [],
    });
  } catch (error) {
    logger.error('Error in GET call-request', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
