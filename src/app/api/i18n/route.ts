import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabaseClient'

// GET /api/i18n?locale=ar&ns=common
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'ar'
  const ns = searchParams.get('ns') || 'common'
  const supabase = getServerSupabase()

  const { data, error } = await supabase
    .from('translations')
    .select('key,value')
    .eq('locale', locale)
    .eq('namespace', ns)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const messages: Record<string, string> = {}
  for (const row of data ?? []) messages[row.key] = row.value
  return NextResponse.json({ locale, ns, messages })
}

