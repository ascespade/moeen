import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

let supabase = getServiceSupabase();

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    const language, key, requestedAt = await request.json();

    if (!language || !key) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Language and key are required' },
        { status: 400 }
      );
    }

    // Create missing_translations table if it doesn't exist
    await supabase.rpc('exec_sql', {
      sqlQuery: `
        CREATE TABLE IF NOT EXISTS missing_translations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          language TEXT NOT NULL,
          key TEXT NOT NULL,
          requested_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    // Insert missing translation key
    const data, error = await supabase
      .from('missing_translations')
      .insert({
        language,
        key,
        requested_at: requestedAt || new Date().toISOString()
      });

    if (error) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Failed to log missing translation' },
        { status: 500 }
      );
    }

    return import { NextResponse } from "next/server";.json({ success: true, data });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let language = searchParams.get('language');

    let query = supabase
      .from('missing_translations')
      .select('*')
      .order('created_at', { ascending: false });

    if (language) {
      query = query.eq('language', language);
    }

    const data, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Failed to fetch missing translations' },
        { status: 500 }
      );
    }

    return import { NextResponse } from "next/server";.json({ data });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
