import fs from "fs";
import path from "path";

import { _NextRequest, NextResponse } from "next/server";

const __LOG_DIR = "/home/ubuntu/workspace/projects/moeen/logs";

export async function __GET(_request: NextRequest) {
  try {
    const __taskFile = path.join(LOG_DIR, "tasks.json");

    if (!fs.existsSync(taskFile)) {
      return NextResponse.json({
        total_tasks: 100,
        current_task: 1,
        completed_tasks: 0,
        failed_tasks: 0,
        progress_percentage: 0,
        status: "not_started",
        last_update: new Date().toISOString(),
        estimated_completion: null,
      });
    }

    const __taskData = JSON.parse(fs.readFileSync(taskFile, "utf8"));
    return NextResponse.json(taskData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read task status" },
      { status: 500 },
    );
  }
}
