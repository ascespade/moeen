import { NextRequest, NextResponse } from 'next/server';
import { privateCenterIntegration } from '@/lib/private-center-integration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';

    // Get center analytics
    const analytics = await privateCenterIntegration.getCenterAnalytics(period as 'monthly' | 'quarterly' | 'annual');

    return NextResponse.json({
      success: true,
      data: {
        period,
        analytics,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Private center analytics error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get center analytics',
        code: 'ANALYTICS_FAILED' 
      },
      { status: 500 }
    );
  }
}