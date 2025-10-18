import { NextRequest } from "next/server";

export function getClientIP(request: NextRequest | undefined): string {
  try {
    return (
      request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request?.headers?.get("x-real-ip") ||
      "127.0.0.1"
    );
  } catch {
    return "127.0.0.1";
  }
}

export function getUserAgent(request: NextRequest | undefined): string {
  if (!request) return "Unknown";
  return request.headers?.get("user-agent") || "Unknown";
}

export function getClientInfo(request: NextRequest | undefined) {
  return {
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request),
  };
}
