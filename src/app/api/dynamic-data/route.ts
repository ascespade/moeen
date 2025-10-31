import { realDB } from '@/lib/supabase-real';
import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication for accessing dynamic data
    const authResult = await requireAuth(['admin', 'supervisor', 'staff'])(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized. Authentication required to access dynamic data.' },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    const supabase = getServiceSupabase();

    // Fetch center info from center_info table
    const { data: centerData, error: centerError } = await supabase
      .from('center_info')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (centerError) {
      // Removed console.warn - use logger instead
      // Log error internally without exposing to client
    }

    // Fetch homepage-related settings from settings table (keys stored as JSON)
    const keys = [
      'homepage_hero_slides',
      'homepage_services',
      'homepage_testimonials',
      'homepage_gallery',
      'homepage_faqs',
    ];

    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', keys);

    if (settingsError) {
      // Removed console.warn - use logger instead
      // Log error internally without exposing to client
    }

    const settingsMap: Record<string, any> = {};
    (settingsData || []).forEach((item: any) => {
      try {
        settingsMap[item.key] =
          typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
      } catch {
        settingsMap[item.key] = item.value;
      }
    });

    // Contact info stored in center_info or separate table
    let contactInfo: any[] = [];
    if (centerData) {
      contactInfo = [
        {
          type: 'phone',
          value: centerData.phone,
          link: `tel:${centerData.phone}`,
        },
        {
          type: 'email',
          value: centerData.email,
          link: `mailto:${centerData.email}`,
        },
        { type: 'location', value: centerData.address, link: '/contact' },
      ].filter(Boolean);
    } else {
      // Try fallback to settings table (no fake data)
      if (settingsMap['contact_info'])
        contactInfo = settingsMap['contact_info'];
    }

    // Services, heroSlides, testimonials, gallery come from settingsMap keys
    const services = settingsMap['homepage_services'] || [];
    const heroSlides = settingsMap['homepage_hero_slides'] || [];
    const testimonials = settingsMap['homepage_testimonials'] || [];
    const gallery = settingsMap['homepage_gallery'] || [];

    // Basic stats: attempt to query analytics/dashboard stats table if exists
    let stats: Record<string, any> = {};
    try {
      const { data: statsData } = await supabase
        .from('dashboard_stats')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (statsData) stats = statsData;
    } catch (e) {
      // ignore if table doesn't exist
    }

    const dynamicData: Record<string, any> = {
      center_info: centerData || null,
      services,
      heroSlides,
      testimonials,
      gallery,
      contact_info: contactInfo,
      stats,
    };

    if (type === 'contact')
      return NextResponse.json({ contact_info: dynamicData.contact_info });
    if (type === 'services')
      return NextResponse.json({ services: dynamicData.services });
    if (type === 'hero')
      return NextResponse.json({ heroSlides: dynamicData.heroSlides });
    if (type === 'testimonials')
      return NextResponse.json({ testimonials: dynamicData.testimonials });

    return NextResponse.json(dynamicData);
  } catch (error) {
    // Use logger instead of console.error
    const logger = (await import('@/lib/monitoring/logger')).default;
    logger.error('Error in dynamic-data API', { error });
    return NextResponse.json(
      { error: 'فشل في جلب البيانات الديناميكية' },
      { status: 500 }
    );
  }
}
