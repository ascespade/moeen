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
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ family: data });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize any authenticated user (patients can manage their family)
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('family_members')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
