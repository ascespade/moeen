import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) return NextResponse.json({ success: false, error: error?.message || 'Unauthorized' }, { status: 401 });

    return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Internal error' }, { status: 500 });
  }
}
