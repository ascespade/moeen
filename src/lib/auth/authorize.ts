/**
 * Authorization utilities
 * Handles user authorization and permission checking
 */

import { _createClient } from "@/lib/supabase/server";

export interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function __authorizeUser(): Promise<AuthResult> {
  try {
    const __supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, error: "Unauthorized" };
    }

    // Get user profile with role and permissions
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, email, role, permissions")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { user: null, error: "User profile not found" };
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role || "user",
        permissions: profile.permissions || [],
      },
      error: null,
    };
  } catch (error) {
    // // console.error("Authorization error:", error);
    return { user: null, error: "Authorization failed" };
  }
}

export function __hasPermission(_user: User, permission: string): boolean {
  return (
    user.permissions.includes(permission) || user.permissions.includes("*")
  );
}

export function __hasRole(_user: User, role: string): boolean {
  return user.role === role || user.role === "admin";
}

export function __requireAuth(_handler: (_user: User) => any) {
  return async (_req: Request) => {
    const { user, error } = await authorizeUser();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return handler(user);
  };
}

export function __requirePermission(_permission: string) {
  return (_handler: (_user: User) => any) => {
    return async (_req: Request) => {
      const { user, error } = await authorizeUser();

      if (error || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!hasPermission(user, permission)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      return handler(user);
    };
  };
}

export function __requireRole(_role: string) {
  return (_handler: (_user: User) => any) => {
    return async (_req: Request) => {
      const { user, error } = await authorizeUser();

      if (error || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!hasRole(user, role)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      return handler(user);
    };
  };
}
