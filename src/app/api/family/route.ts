import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest) {
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

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ family: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch family' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
    return NextResponse.json(
      { error: 'Failed to add family member' },
      { status: 500 }
    );
  }
}
