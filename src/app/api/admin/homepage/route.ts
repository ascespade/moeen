import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Expect body like { services: [...], heroSlides: [...], testimonials: [...], gallery: [...] }
    const entries: { key: string; value: any }[] = [];

    if (body.services)
      entries.push({ key: 'homepage_services', value: body.services });
    if (body.heroSlides)
      entries.push({ key: 'homepage_hero_slides', value: body.heroSlides });
    if (body.testimonials)
      entries.push({ key: 'homepage_testimonials', value: body.testimonials });
    if (body.gallery)
      entries.push({ key: 'homepage_gallery', value: body.gallery });

    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // Upsert each entry into settings table
    const updates = entries.map(e => ({
      key: e.key,
      value: JSON.stringify(e.value),
      category: 'homepage',
      is_public: true,
    }));

    const { data, error } = await supabase
      .from('settings')
      .upsert(updates)
      .select();

    if (error) {
      console.error('Failed to upsert settings:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Error in admin/homepage PUT:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
