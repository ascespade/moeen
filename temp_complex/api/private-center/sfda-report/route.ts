import { NextRequest, NextResponse } from 'next/server';
import { privateCenterIntegration } from '@/lib/private-center-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      reportPeriod, 
      qualityMetrics, 
      incidents 
    } = body;

    if (!reportPeriod || !qualityMetrics) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Report period and quality metrics are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Submit SFDA quality report
    const result = await privateCenterIntegration.submitSFDAQualityReport({
      centerId: process.env.CENTER_ID || 'HEMAM001',
      reportPeriod,
      qualityMetrics,
      incidents: incidents || []
    });

    return NextResponse.json({
      success: result.success,
      data: {
        reportPeriod,
        result,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('SFDA quality report submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit SFDA quality report',
        code: 'SFDA_REPORT_FAILED' 
      },
      { status: 500 }
    );
  }
}