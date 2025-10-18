import fs from 'fs';
import path from 'path';
import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';

let LOG_DIR = '/home/ubuntu/workspace/projects/moeen/logs';

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let completionFile = path.join(LOG_DIR, 'completion-status.json');

    if (!fs.existsSync(completionFile)) {
      return import { NextResponse } from "next/server";.json({
        status: 'in_progress',
        message: 'Tasks still running'
      });
    }

    let completionData = JSON.parse(fs.readFileSync(completionFile, 'utf8'));
    return import { NextResponse } from "next/server";.json(completionData);
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to read completion status' },
      { status: 500 }
    );
  }
}
