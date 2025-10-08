import { NextRequest, NextResponse } from 'next/server';
import { ministryHealthIntegration } from '@/lib/saudi-ministry-health-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, nationalId, system } = body;

    if (!patientId || !nationalId || !system) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patient ID, National ID, and system are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    let result;

    switch (system) {
      case 'seha':
        result = await ministryHealthIntegration.syncWithSeha(patientId, nationalId);
        break;
      case 'shoon':
        result = await ministryHealthIntegration.syncWithShoon(patientId, nationalId);
        break;
      case 'tatman':
        const { insuranceProvider } = body;
        if (!insuranceProvider) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Insurance provider is required for TATMAN sync',
              code: 'MISSING_INSURANCE_PROVIDER' 
            },
            { status: 400 }
          );
        }
        result = await ministryHealthIntegration.syncWithTatman(patientId, nationalId, insuranceProvider);
        break;
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid system. Must be seha, shoon, or tatman',
            code: 'INVALID_SYSTEM' 
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        system,
        patientId,
        nationalId,
        integration: result,
        syncedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Ministry health sync error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync with ministry health system',
        code: 'SYNC_FAILED' 
      },
      { status: 500 }
    );
  }
}