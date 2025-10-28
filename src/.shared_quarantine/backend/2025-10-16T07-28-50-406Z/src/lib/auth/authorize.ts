import { _NextRequest } from "next/server";
import { _createClient } from "@/lib/supabase/server";
import { _logger } from "@/lib/logger";

export interface User {
  id: string;
  email: string;
  role: "patient" | "doctor" | "staff" | "supervisor" | "admin";
  meta?: Record<string, any>;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function __authorize(_request: NextRequest): Promise<AuthResult> {
  try {
    const __supabase = createClient();

    // Get session from cookies
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { user: null, error: "Unauthorized" };
    }

    // Get user data with role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role, meta")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData) {
      return { user: null, error: "User not found" };
    }

    return {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role as User["role"],
        meta: userData.meta || {},
      },
      error: null,
    };
  } catch (error) {
    logger.error("Authorization error:", error);
    return { user: null, error: "Authorization failed" };
  }
}

export function __requireRole(
  allowedRoles: User["role"][],
): (_user: User) => boolean {
  return (_user: User) => allowedRoles.includes(user.role);
}

export function __requireAuth(allowedRoles?: User["role"][]) {
  return async (_request: NextRequest) => {
    const { user, error } = await authorize(request);

    if (error || !user) {
      return { authorized: false, user: null, error };
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { authorized: false, user, error: "Insufficient permissions" };
    }

    return { authorized: true, user, error: null };
  };
}
