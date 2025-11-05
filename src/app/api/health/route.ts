import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'moeen-health-center',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}
