import { NextResponse } from 'next/server'
import { seedTranslations } from '@/scripts/seed-translations'

/**
 * POST /api/translations/seed
 * Seed all translations to the database using CUID system
 */
export async function POST() {
  try {
    console.log('🌱 Starting translation seeding...')
    
    await seedTranslations()
    
    return NextResponse.json({
      success: true,
      message: 'All translations seeded successfully with CUID system',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Translation seeding failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * GET /api/translations/seed
 * Check seeding status
 */
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to seed translations',
    endpoint: '/api/translations/seed',
    method: 'POST'
  })
}
