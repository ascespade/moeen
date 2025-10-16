import { _NextResponse } from "next/server";
export async function __POST() {
  const __response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", "", { path: "/", maxAge: 0 });
  return response;
}
