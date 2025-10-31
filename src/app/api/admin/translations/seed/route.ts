import { NextRequest, NextResponse } from 'next/server';
import { TranslationSeeder } from '@/lib/translations/translation-seeder';
import { env } from '@/config/env';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

const INTERNAL_SECRET = env.ADMIN_INTERNAL_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
    const internalSecret = req.headers.get('x-admin-secret');

    const isDev = env.NODE_ENV !== 'production';
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
  } catch (error: any) {
    logger.error('Error seeding translations', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

