import fs from "fs";
import path from "path";

import { _NextRequest, NextResponse } from "next/server";

const __LOG_DIR = "/home/ubuntu/workspace/projects/moeen/logs";

export async function __GET(_request: NextRequest) {
  try {
    const __completionFile = path.join(LOG_DIR, "completion-status.json");

    if (!fs.existsSync(completionFile)) {
      return NextResponse.json({
        status: "in_progress",
        message: "Tasks still running",
      });
    }

    const __completionData = JSON.parse(fs.readFileSync(completionFile, "utf8"));
    return NextResponse.json(completionData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read completion status" },
      { status: 500 },
    );
  }
}
