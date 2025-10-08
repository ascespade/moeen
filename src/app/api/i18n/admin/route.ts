import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabaseClient'

export async function GET() {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.from('translations').select('id,locale,namespace,key,value').order('locale')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || !body.locale || !body.key || !body.value) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.from('translations').upsert({
    locale: body.locale,
    namespace: body.namespace || 'common',
    key: body.key,
    value: body.value,
  }, { onConflict: 'locale,namespace,key' }).select('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const supabase = getServiceSupabase()
  const { error } = await supabase.from('translations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}