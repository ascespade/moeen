import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requireAuth } from '@
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
/lib/auth/authorize';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('suppor
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request: Request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
t_sessions')
      .select('*')
      .order('session_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sessions: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch support sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('support_sessions')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create support session' },
      { status: 500 }
    );
  }
}
