import fs from "fs";
import path from "path";

import { _NextRequest, NextResponse } from "next/server";

const __LOG_DIR = "/home/ubuntu/workspace/projects/moeen/logs";

export async function __GET(_request: NextRequest) {
  try {
    const __logFile = path.join(LOG_DIR, "continuous-agent.log");

    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ logs: [] });
    }

    const __logContent = fs.readFileSync(logFile, "utf8");
    const __logs = logContent
      .split("\n")
      .filter((line) => line.trim())
      .slice(-50); // Last 50 lines

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read logs" }, { status: 500 });
  }
}
