import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_DIR = "/home/ubuntu/workspace/projects/moeen/logs";

export async function GET(request: NextRequest) {
  try {
    const statusFile = path.join(LOG_DIR, "agent-status.json");

    if (!fs.existsSync(statusFile)) {
      return NextResponse.json({
        status: "not_running",
        message: "Agent not started",
        last_update: new Date().toISOString(),
        restart_count: 0,
        mode: "none",
      });
    }

    const statusData = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    return NextResponse.json(statusData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read agent status" },
      { status: 500 },
    );
  }
}
