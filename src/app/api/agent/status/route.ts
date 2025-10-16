import fs from "fs";
import path from "path";

import { _NextRequest, NextResponse } from "next/server";

const __LOG_DIR = "/home/ubuntu/workspace/projects/moeen/logs";

export async function __GET(_request: NextRequest) {
  try {
    const __statusFile = path.join(LOG_DIR, "agent-status.json");

    if (!fs.existsSync(statusFile)) {
      return NextResponse.json({
        status: "not_running",
        message: "Agent not started",
        last_update: new Date().toISOString(),
        restart_count: 0,
        mode: "none",
      });
    }

    const __statusData = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    return NextResponse.json(statusData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read agent status" },
      { status: 500 },
    );
  }
}
