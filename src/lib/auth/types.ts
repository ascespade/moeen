/**
 * Auth Types - Client & Server Safe
 * أنواع المصادقة - آمنة للعميل والخادم
 *
 * Shared types that can be used in both client and server components
 */

export interface CustomAuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatar_url?: string;
}

export interface UserPermissions {
  role: string;
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
  permissionCodes: string[];
}

export interface AuthResult {
  user: CustomAuthUser | null;
  token: string | null;
  error: string | null;
}
