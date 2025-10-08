import { NextRequest, NextResponse } from 'next/server';
import { ministryHealthIntegration } from '@/lib/saudi-ministry-health-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nationalId, serviceCode } = body;

    if (!nationalId || !serviceCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'National ID and service code are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Verify TATMAN coverage
    const coverage = await ministryHealthIntegration.verifyTatmanCoverage(nationalId, serviceCode);

    return NextResponse.json({
      success: true,
      data: {
        nationalId,
        serviceCode,
        coverage,
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Ministry health verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to verify ministry health coverage',
        code: 'VERIFICATION_FAILED' 
      },
      { status: 500 }
    );
  }
}