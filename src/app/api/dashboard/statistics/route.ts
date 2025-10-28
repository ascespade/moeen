// src/app/api/dashboard/statistics/route.ts
// Dynamic Dashboard Statistics API
// Provides real-time statistics and analytics from the database

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

const supabase = getServiceSupabase();

export async function GET(request: NextRequest) {
  try {
    // Get comprehensive dashboard data using the SQL function
    const { data, error } = await supabase.rpc(
      'get_comprehensive_dashboard_data'
    );

    if (error) {
      console.error('Dashboard statistics error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard statistics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to refresh/update statistics
export async function POST(request: NextRequest) {
  try {
    // Force refresh by calling the function again
    const { data, error } = await supabase.rpc(
      'get_comprehensive_dashboard_data'
    );

    if (error) {
      console.error('Dashboard statistics refresh error:', error);
      return NextResponse.json(
        { error: 'Failed to refresh dashboard statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Dashboard statistics refreshed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard statistics refresh API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
