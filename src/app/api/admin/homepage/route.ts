import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

export async function PUT(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
      logger.error('Failed to upsert settings', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    logger.error('Error in admin/homepage PUT', err);
    return ErrorHandler.getInstance().handle(err as Error);
  }
}

export const dynamic = 'force-dynamic';
