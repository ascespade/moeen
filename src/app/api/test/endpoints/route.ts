/**
 * API Endpoints Test - اختبار نقاط النهاية
 * Test all API endpoints for functionality
 */

import { _NextRequest, NextResponse } from "next/server";

export async function __GET(_request: NextRequest) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://socwpqzcalgvpzjwavgh.supabase.co";
    const testResults: {
      timestamp: string;
      totalTests: number;
      passed: number;
      failed: number;
      results: Array<{
        name: string;
        url: string;
        method: string;
        status: number;
        success: boolean;
        responseTime: number;
      }>;
    } = {
      timestamp: new Date().toISOString(),
      totalTests: 0,
      passed: 0,
      failed: 0,
      results: [],
    };

    // Test endpoints
    const __endpoints = [
      { name: "Health Check", url: "/api/test/health", method: "GET" },
      {
        name: "Dashboard Metrics",
        url: "/api/dashboard/metrics",
        method: "GET",
      },
      { name: "Appointments List", url: "/api/appointments", method: "GET" },
      { name: "Patients List", url: "/api/patients", method: "GET" },
      { name: "Doctors List", url: "/api/doctors", method: "GET" },
      {
        name: "Reports Generate",
        url: "/api/reports/generate",
        method: "POST",
      },
      {
        name: "Notifications Schedule",
        url: "/api/notifications/schedule",
        method: "GET",
      },
      {
        name: "Medical Records Upload",
        url: "/api/medical-records/upload",
        method: "GET",
      },
      { name: "Insurance Claims", url: "/api/insurance/claims", method: "GET" },
      { name: "Admin Users", url: "/api/admin/users", method: "GET" },
      { name: "Chatbot Actions", url: "/api/chatbot/actions", method: "GET" },
      { name: "Patient Journey", url: "/api/patients/journey", method: "POST" },
    ];

    for (const endpoint of endpoints) {
      testResults.totalTests++;

      try {
        const __response = await fetch(`${baseUrl}${endpoint.url}`, {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const __result = {
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          responseTime: Date.now(),
        };

        if (response.ok) {
          testResults.passed++;
          result.status = "PASSED" as any;
        } else {
          testResults.failed++;
          result.status = "FAILED" as any;
        }

        testResults.results.push(result);
      } catch (error) {
        testResults.failed++;
        testResults.results.push({
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: 500,
          success: false,
          responseTime: 0,
        });
      }
    }

    // Calculate success rate
    const __successRate = (testResults.passed / testResults.totalTests) * 100;

    return NextResponse.json({
      ...testResults,
      successRate: `${successRate.toFixed(2)}%`,
      summary: {
        healthy: testResults.failed === 0,
        needsAttention: testResults.failed > 0,
        criticalIssues: testResults.results.filter((r) => r.status >= 500)
          .length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: "error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
