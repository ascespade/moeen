import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate database connection check
    const dbConnected = true; // Replace with actual DB check
    const timestamp = new Date().toISOString();

    if (!dbConnected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          timestamp,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        database: 'connected',
        timestamp,
        version: '1.0.0',
      },
      message: 'System is healthy',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
