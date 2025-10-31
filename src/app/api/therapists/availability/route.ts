import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get('therapist_id');
    const date = searchParams.get('date');

    const supabase = await createClient();

    let query = supabase.from('therapist_schedules').select('*');

    if (therapistId) {
      query = query.eq('therapist_id', therapistId);
    }

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query.eq('is_available', true);

    if (error) throw error;

    return NextResponse.json({ schedules: data });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
