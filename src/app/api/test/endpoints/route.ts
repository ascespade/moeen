/**
 * API Endpoints Test - اختبار نقاط النهاية
 * Test all API endpoints for functionality
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const testResults: any = {
      timestamp: new Date().toISOString(),
      totalTests: 0,
      passed: 0,
      failed: 0,
      results: [],
    };

    // Test endpoints
    const endpoints = [
      { name: 'Health Check', url: '/api/test/health', method: 'GET' },
      { name: 'Dashboard Metrics', url: '/api/dashboard/metrics', method: 'GET' },
      { name: 'Appointments List', url: '/api/appointments', method: 'GET' },
      { name: 'Patients List', url: '/api/patients', method: 'GET' },
      { name: 'Doctors List', url: '/api/doctors', method: 'GET' },
      { name: 'Reports Generate', url: '/api/reports/generate', method: 'POST' },
      { name: 'Notifications Schedule', url: '/api/notifications/schedule', method: 'GET' },
      { name: 'Medical Records Upload', url: '/api/medical-records/upload', method: 'GET' },
      { name: 'Insurance Claims', url: '/api/insurance/claims', method: 'GET' },
      { name: 'Admin Users', url: '/api/admin/users', method: 'GET' },
      { name: 'Chatbot Actions', url: '/api/chatbot/actions', method: 'GET' },
      { name: 'Patient Journey', url: '/api/patients/journey', method: 'POST' },
    ];

    for (const endpoint of endpoints) {
      testResults.totalTests++;
      
      try {
        const response = await fetch(`${baseUrl}${endpoint.url}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: any = {
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          responseTime: 0,
        };

        if (response.ok) {
          testResults.passed++;
          result.status = 'PASSED';
        } else {
          testResults.failed++;
          result.status = 'FAILED';
        }

        testResults.results.push(result);
      } catch (error) {
        testResults.failed++;
        testResults.results.push({
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: 'ERROR',
          success: false,
          error: (error as any).message,
        });
      }
    }

    // Calculate success rate
    const successRate = (testResults.passed / testResults.totalTests) * 100;

    return NextResponse.json({
      ...testResults,
      successRate: `${successRate.toFixed(2)}%`,
      summary: {
        healthy: testResults.failed === 0,
        needsAttention: testResults.failed > 0,
        criticalIssues: testResults.results.filter(r => r.status === 'ERROR').length,
      },
    });

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: (error as any).message,
    }, { status: 500 });
  }
}