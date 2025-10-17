import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Initialize health check results
    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        database: { status: 'unknown', responseTime: 0 },
        auth: { status: 'unknown', responseTime: 0 },
        storage: { status: 'unknown', responseTime: 0 }
      },
      errors: []
    };

    // Test database connection
    try {
      const dbStart = Date.now();
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      const responseTime = Date.now() - dbStart;
      
      if (error) {
        healthCheck.services.database = { 
          status: 'unhealthy', 
          responseTime: responseTime,
          error: error.message 
        };
        healthCheck.errors.push(`Database error: ${error.message}`);
      } else {
        healthCheck.services.database = { 
          status: 'healthy', 
          responseTime: responseTime 
        };
      }
    } catch (error: any) {
      healthCheck.services.database = { 
        status: 'unhealthy', responseTime: responseTime, error: error.message 
      };
      healthCheck.errors.push(`Database connection failed: ${error.message}`);
    }

    // Test auth service
    try {
      const authStart = Date.now();
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getSession();
      
      const authTime = Date.now() - authStart;
      
      if (error) {
        healthCheck.services.auth = { 
          status: 'unhealthy', 
          responseTime: authTime,
          error: error.message 
        };
        healthCheck.errors.push(`Auth error: ${error.message}`);
      } else {
        healthCheck.services.auth = { 
          status: 'healthy', 
          responseTime: authTime 
        };
      }
    } catch (error: any) {
      healthCheck.services.auth = { 
        status: 'unhealthy', responseTime: responseTime, error: error.message 
      };
      healthCheck.errors.push(`Auth service failed: ${error.message}`);
    }

    // Test storage service
    try {
      const storageStart = Date.now();
      const supabase = await createClient();
      const { data, error } = await supabase.storage.listBuckets();
      
      const storageTime = Date.now() - storageStart;
      
      if (error) {
        healthCheck.services.storage = { 
          status: 'unhealthy', 
          responseTime: storageTime,
          error: error.message 
        };
        healthCheck.errors.push(`Storage error: ${error.message}`);
      } else {
        healthCheck.services.storage = { 
          status: 'healthy', 
          responseTime: storageTime 
        };
      }
    } catch (error: any) {
      healthCheck.services.storage = { 
        status: 'unhealthy', responseTime: responseTime, error: error.message 
      };
      healthCheck.errors.push(`Storage service failed: ${error.message}`);
    }

    // Determine overall status
    const allHealthy = Object.values(healthCheck.services).every(
      service => service.status === 'healthy'
    );
    
    healthCheck.status = allHealthy ? 'healthy' : 'unhealthy';

    const totalTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...healthCheck,
      responseTime: totalTime,
      uptime: process.uptime()
    }, { 
      status: allHealthy ? 200 : 503 
    });

  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error.message,
      responseTime: 0
    }, { status: 500 });
  }
}