import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_DIR = "/home/ubuntu/workspace/projects/moeen/logs";

export async function GET(request: NextRequest) {
  try {
    const completionFile = path.join(LOG_DIR, "completion-status.json");

    if (!fs.existsSync(completionFile)) {
      return NextResponse.json({
        status: "in_progress",
        message: "Tasks still running",
      });
    }

    const completionData = JSON.parse(fs.readFileSync(completionFile, "utf8"));
    return NextResponse.json(completionData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read completion status" },
      { status: 500 },
    );
  }
}
