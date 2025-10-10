import { ROUTES } from "@/constants/routes";

export interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "doctor" | "nurse";
  permissions?: string[];
}

/**
 * Get the default route for a user based on their role
 */
export function getDefaultRouteForUser(user: User | null): string {
  if (!user) {
    return ROUTES.LOGIN;
  }

  switch (user.role) {
    case "admin":
      return ROUTES.ADMIN.DASHBOARD;
    case "doctor":
    case "nurse":
    case "user":
    default:
      return ROUTES.USER.DASHBOARD;
  }
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const publicRoutes = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.HOME
  ];
  return !publicRoutes.includes(pathname as any);
}

/**
 * Check if a route requires admin privileges
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * Check if user has permission to access a route
 */
export function canAccessRoute(user: User | null, pathname: string): boolean {
  if (!user) {
    return !isProtectedRoute(pathname);
  }

  if (isAdminRoute(pathname)) {
    return user.role === "admin";
  }

  return true;
}

/**
 * Get navigation items based on user role
 */
export function getNavigationItems(user: User | null) {
  if (!user) {
    return [
      { label: "الرئيسية", href: ROUTES.HOME },
      { label: "تسجيل الدخول", href: ROUTES.LOGIN },
      { label: "إنشاء حساب", href: ROUTES.REGISTER },
    ];
  }

  const baseItems = [
    { label: "لوحة التحكم", href: ROUTES.USER.DASHBOARD },
    { label: "المواعيد", href: ROUTES.HEALTH.APPOINTMENTS },
    { label: "المرضى", href: ROUTES.HEALTH.PATIENTS },
    { label: "الجلسات", href: ROUTES.HEALTH.SESSIONS },
  ];

  if (user.role === "admin") {
    return [
      ...baseItems,
      { label: "الإدارة", href: ROUTES.ADMIN.DASHBOARD },
      { label: "المستخدمون", href: ROUTES.ADMIN.USERS },
      { label: "الإعدادات", href: ROUTES.ADMIN.SETTINGS },
    ];
  }

  return baseItems;
}