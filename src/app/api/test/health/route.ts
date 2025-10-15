/**
 * API Health Check - فحص صحة النظام
 * Comprehensive API testing and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const healthChecks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {},
      errors: [],
    };

    // Test database connection
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      healthChecks.services.database = {
        status: error ? 'error' : 'healthy',
        responseTime: Date.now(),
        error: error?.message,
      };
    } catch (error) {
      healthChecks.services.database = {
        status: 'error',
        error: error.message,
      };
      healthChecks.errors.push('Database connection failed');
    }

    // Test authentication
    try {
      const { data, error } = await supabase.auth.getSession();
      healthChecks.services.auth = {
        status: error ? 'error' : 'healthy',
        hasSession: !!data.session,
      };
    } catch (error) {
      healthChecks.services.auth = {
        status: 'error',
        error: error.message,
      };
      healthChecks.errors.push('Authentication service failed');
    }

    // Test storage
    try {
      const { data, error } = await supabase.storage
        .from('medical-files')
        .list('', { limit: 1 });
      
      healthChecks.services.storage = {
        status: error ? 'error' : 'healthy',
        error: error?.message,
      };
    } catch (error) {
      healthChecks.services.storage = {
        status: 'error',
        error: error.message,
      };
      healthChecks.errors.push('Storage service failed');
    }

    // Overall status
    const hasErrors = healthChecks.errors.length > 0;
    healthChecks.status = hasErrors ? 'unhealthy' : 'healthy';

    return NextResponse.json(healthChecks, {
      status: hasErrors ? 500 : 200,
    });

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error.message,
    }, { status: 500 });
  }
}