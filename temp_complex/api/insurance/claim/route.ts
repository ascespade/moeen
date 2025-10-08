import { NextRequest, NextResponse } from 'next/server';
import { saudiHealthSystem } from '@/lib/saudi-health-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      patientId, 
      nationalId, 
      providerCode, 
      serviceCode, 
      diagnosisCode, 
      amount, 
      serviceDate, 
      notes 
    } = body;

    if (!patientId || !nationalId || !providerCode || !serviceCode || !diagnosisCode || !amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All required fields must be provided',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Submit insurance claim
    const claim = await saudiHealthSystem.submitInsuranceClaim({
      patientId,
      nationalId,
      providerCode,
      serviceCode,
      diagnosisCode,
      amount: parseFloat(amount),
      serviceDate: serviceDate || new Date().toISOString(),
      notes
    });

    return NextResponse.json({
      success: true,
      data: {
        claim,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Insurance claim submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit insurance claim',
        code: 'CLAIM_SUBMISSION_FAILED' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const claimNumber = searchParams.get('claimNumber');
    const providerCode = searchParams.get('providerCode');

    if (!claimNumber || !providerCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Claim number and provider code are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Check claim status
    const status = await saudiHealthSystem.checkClaimStatus(claimNumber, providerCode);

    return NextResponse.json({
      success: true,
      data: {
        claimNumber,
        providerCode,
        status,
        checkedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Insurance claim status check error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check claim status',
        code: 'STATUS_CHECK_FAILED' 
      },
      { status: 500 }
    );
  }
}