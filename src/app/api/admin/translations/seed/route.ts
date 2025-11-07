import { NextRequest, NextResponse } from 'next/server';
import { TranslationSeeder } from '@/lib/translations/translation-seeder';
// import { requireAuth } from '@/lib/auth/authorize';

const INTERNAL_SECRET = process.env.ADMIN_INTERNAL_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
    const internalSecret = req.headers.get('x-admin-secret');

    const isDev = process.env.NODE_ENV !== 'production';
    const isAuthorized =
      (isDev && internalSecret === INTERNAL_SECRET) ||
      authHeader === `Bearer ${INTERNAL_SECRET}`;

    if (!isAuthorized && !isDev) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const seeder = new TranslationSeeder();
    await seeder.seedTranslations();

    return NextResponse.json({
      success: true,
      message: 'Translations seeded successfully',
    });
  } catch (error: unknown) {
    const { logger } = await import('@/lib/utils/logger');
    logger.error('[admin/translations/seed] Error', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed translations',
      },
      { status: 500 }
    );
  }
}
