import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Check database connection
    const dbHealth = await checkDatabaseHealth();

    // Check external services
    const servicesHealth = await checkExternalServices();

    // Check system resources
    const systemHealth = await checkSystemResources();

    const isHealthy = dbHealth && servicesHealth && systemHealth;

    return NextResponse.json(
      {
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: dbHealth,
          services: servicesHealth,
          system: systemHealth,
        },
      },
      {
        status: isHealthy ? 200 : 503,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}

async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}

async function checkExternalServices(): Promise<boolean> {
  try {
    // Check Supabase
    const supabaseHealth = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      },
    ).then((res) => res.ok);

    return supabaseHealth;
  } catch {
    return false;
  }
}

async function checkSystemResources(): Promise<boolean> {
  try {
    const memUsage = process.memoryUsage();
    const maxMemory = 1024 * 1024 * 1024; // 1GB

    return memUsage.heapUsed < maxMemory;
  } catch {
    return false;
  }
}
