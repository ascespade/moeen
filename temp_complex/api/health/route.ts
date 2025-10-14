// Comprehensive Health Check System for Hemam Center
import { NextRequest, NextResponse } from "next/server";
import { realDB } from "@/lib/supabase-real";
import { performanceMonitor } from "@/lib/performance-monitor";
import { cache } from "@/lib/cache-system";

// Health check interfaces
interface HealthCheck {
  name: string;
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
  message?: string;
  details?: any;
}

interface SystemHealth {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: HealthCheck[];
  performance: {
    memory: NodeJS.MemoryUsage;
    cpu: NodeJS.CpuUsage;
    uptime: number;
  };
}

// Health check functions
async function checkDatabase(): Promise<HealthCheck> {
  const startTime = Date.now();

  try {
    const health = await realDB.healthCheck();
    const responseTime = Date.now() - startTime;

    return {
      name: "database",
      status: health.status === "healthy" ? "healthy" : "unhealthy",
      responseTime,
      message:
        health.status === "healthy"
          ? "Database connection successful"
          : "Database connection failed",
      details: health,
    };
  } catch (error) {
    return {
      name: "database",
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      message: "Database health check failed",
      details: { error: error.message },
    };
  }
}

async function checkCache(): Promise<HealthCheck> {
  const startTime = Date.now();

  try {
    const stats = cache.getStats();
    const responseTime = Date.now() - startTime;

    return {
      name: "cache",
      status: "healthy",
      responseTime,
      message: "Cache system operational",
      details: stats,
    };
  } catch (error) {
    return {
      name: "cache",
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      message: "Cache system failed",
      details: { error: error.message },
    };
  }
}

async function checkPerformance(): Promise<HealthCheck> {
  const startTime = Date.now();

  try {
    const metrics = performanceMonitor.getRealTimeMetrics();
    const responseTime = Date.now() - startTime;

    // Check if performance is within acceptable limits
    const isHealthy =
      metrics.averageResponseTime < 1000 && // Less than 1 second
      metrics.errorRate < 5 && // Less than 5% error rate
      metrics.memoryUsage.heapUsed < 512 * 1024 * 1024; // Less than 512MB

    return {
      name: "performance",
      status: isHealthy ? "healthy" : "degraded",
      responseTime,
      message: isHealthy
        ? "Performance metrics are normal"
        : "Performance metrics indicate issues",
      details: metrics,
    };
  } catch (error) {
    return {
      name: "performance",
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      message: "Performance monitoring failed",
      details: { error: error.message },
    };
  }
}

async function checkExternalServices(): Promise<HealthCheck> {
  const startTime = Date.now();

  try {
    // Check WhatsApp API (if configured)
    const whatsappConfigured = !!process.env.WHATSAPP_BUSINESS_API_TOKEN;

    // Check Supabase connection
    const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    const responseTime = Date.now() - startTime;
    const allConfigured = whatsappConfigured && supabaseConfigured;

    return {
      name: "external_services",
      status: allConfigured ? "healthy" : "degraded",
      responseTime,
      message: allConfigured
        ? "External services configured"
        : "Some external services not configured",
      details: {
        whatsapp: whatsappConfigured,
        supabase: supabaseConfigured,
      },
    };
  } catch (error) {
    return {
      name: "external_services",
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      message: "External services check failed",
      details: { error: error.message },
    };
  }
}

async function checkFileSystem(): Promise<HealthCheck> {
  const startTime = Date.now();

  try {
    const fs = require("fs");
    const path = require("path");

    // Check if upload directory exists and is writable
    const uploadDir = process.env.UPLOAD_DIR || "./uploads";
    const tempDir = process.env.TEMP_DIR || "./temp";

    const uploadDirExists = fs.existsSync(uploadDir);
    const tempDirExists = fs.existsSync(tempDir);

    const responseTime = Date.now() - startTime;
    const isHealthy = uploadDirExists && tempDirExists;

    return {
      name: "filesystem",
      status: isHealthy ? "healthy" : "unhealthy",
      responseTime,
      message: isHealthy
        ? "File system accessible"
        : "File system issues detected",
      details: {
        uploadDir: uploadDirExists,
        tempDir: tempDirExists,
      },
    };
  } catch (error) {
    return {
      name: "filesystem",
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      message: "File system check failed",
      details: { error: error.message },
    };
  }
}

// Main health check endpoint
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Run all health checks in parallel
    const checks = await Promise.all([
      checkDatabase(),
      checkCache(),
      checkPerformance(),
      checkExternalServices(),
      checkFileSystem(),
    ]);

    // Determine overall system health
    const unhealthyChecks = checks.filter(
      (check) => check.status === "unhealthy",
    );
    const degradedChecks = checks.filter(
      (check) => check.status === "degraded",
    );

    let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";
    if (unhealthyChecks.length > 0) {
      overallStatus = "unhealthy";
    } else if (degradedChecks.length > 0) {
      overallStatus = "degraded";
    }

    // Get system information
    const systemHealth: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks,
      performance: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
      },
    };

    // Set appropriate HTTP status code
    const statusCode =
      overallStatus === "healthy"
        ? 200
        : overallStatus === "degraded"
          ? 200
          : 503;

    return NextResponse.json(systemHealth, { status: statusCode });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        error: "Health check failed",
        details: { error: (error as Error).message },
      },
      { status: 503 },
    );
  }
}

// Detailed health check endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkType } = body;

    let check: HealthCheck;

    switch (checkType) {
      case "database":
        check = await checkDatabase();
        break;
      case "cache":
        check = await checkCache();
        break;
      case "performance":
        check = await checkPerformance();
        break;
      case "external_services":
        check = await checkExternalServices();
        break;
      case "filesystem":
        check = await checkFileSystem();
        break;
      default:
        return NextResponse.json(
          { error: "Invalid check type" },
          { status: 400 },
        );
    }

    return NextResponse.json(check);
  } catch (error) {
    console.error("Detailed health check error:", error);

    return NextResponse.json(
      { error: "Health check failed", details: { error: (error as Error).message } },
      { status: 500 },
    );
  }
}
