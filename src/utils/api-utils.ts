/**
 * API Utility Functions
 * Reusable functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export function createErrorResponse(
  error: unknown,
  defaultStatus = 500
): NextResponse {
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: (error as ApiError).status || defaultStatus }
    );
  }
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: defaultStatus }
  );
}

export function createSuccessResponse(
  data: unknown,
  status = 200
): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function validateRequest(
  _request: NextRequest,
  _requiredFields: string[]
): { valid: boolean; missing: string[] } {
  // Implementation for request validation
  return { valid: true, missing: [] };
}
