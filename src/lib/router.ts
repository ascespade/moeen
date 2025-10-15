import { ROUTES, ROUTE_TRANSLATIONS } from "@/constants/routes";
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
  // Normalize pathname for comparison
  const normalizedPath = pathname.replace(/^\/ar\/|\/en\//, '/');
  return !((ROUTES as any).PUBLIC_ROUTES as readonly string[]).includes(
    normalizedPath,
  );
}

/**
 * Check if a route requires admin privileges
 */
export function isAdminRoute(pathname: string): boolean {
  // Handle both regular and localized admin routes
  return pathname.startsWith("/admin") || pathname.startsWith("/ar/admin") || pathname.startsWith("/en/admin");
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
 * Get RTL-aware route path
 * Handles RTL-specific routing logic
 */
export function getRTLRoute(pathname: string, language: 'ar' | 'en' = 'ar'): string {
  // For now, routes are the same regardless of language
  // This function can be extended for language-specific routing
  return pathname;
}

/**
 * Check if a route is RTL-specific
 */
export function isRTLRoute(pathname: string): boolean {
  // Check if the pathname contains Arabic characters or RTL indicators
  return /[\u0600-\u06FF]/.test(pathname) || pathname.includes('/ar/');
}

/**
 * Get route direction based on language
 */
export function getRouteDirection(language: 'ar' | 'en' = 'ar'): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Get localized route label
 */
export function getRouteLabel(routeKey: string, language: 'ar' | 'en' = 'ar'): string {
  const t = ROUTE_TRANSLATIONS[language];
  return (t as any)[routeKey] || routeKey;
}

/**
 * Get all available routes for a specific language
 */
export function getLocalizedRoutes(language: 'ar' | 'en' = 'ar') {
  const t = ROUTE_TRANSLATIONS[language];
  return {
    // Public routes
    HOME: { label: t.HOME, href: ROUTES.HOME },
    LOGIN: { label: t.LOGIN, href: ROUTES.LOGIN },
    REGISTER: { label: t.REGISTER, href: ROUTES.REGISTER },
    FORGOT_PASSWORD: { label: t.FORGOT_PASSWORD, href: ROUTES.FORGOT_PASSWORD },
    RESET_PASSWORD: { label: t.RESET_PASSWORD, href: ROUTES.RESET_PASSWORD },
    
    // User routes
    DASHBOARD: { label: t.DASHBOARD, href: ROUTES.USER.DASHBOARD },
    PROFILE: { label: t.PROFILE, href: ROUTES.USER.PROFILE },
    SETTINGS: { label: t.SETTINGS, href: ROUTES.USER.SETTINGS },
    CHANNELS: { label: t.CHANNELS, href: ROUTES.USER.CHANNELS },
    CONVERSATIONS: { label: t.CONVERSATIONS, href: ROUTES.USER.CONVERSATIONS },
    
    // Admin routes
    ADMIN_DASHBOARD: { label: `${t.ADMIN} - ${t.DASHBOARD}`, href: ROUTES.ADMIN.DASHBOARD },
    ADMIN_USERS: { label: `${t.ADMIN} - ${t.USERS}`, href: ROUTES.ADMIN.USERS },
    ADMIN_SETTINGS: { label: `${t.ADMIN} - ${t.SETTINGS}`, href: ROUTES.ADMIN.SETTINGS },
    
    // Health routes
    APPOINTMENTS: { label: t.APPOINTMENTS, href: ROUTES.HEALTH.APPOINTMENTS },
    SESSIONS: { label: t.SESSIONS, href: ROUTES.HEALTH.SESSIONS },
    PATIENTS: { label: t.PATIENTS, href: ROUTES.HEALTH.PATIENTS },
    
    // Marketing routes
    FEATURES: { label: t.FEATURES, href: ROUTES.MARKETING.FEATURES },
    PRICING: { label: t.PRICING, href: ROUTES.MARKETING.PRICING },
    FAQ: { label: t.FAQ, href: ROUTES.MARKETING.FAQ },
    
    // Info routes
    ABOUT: { label: t.ABOUT, href: ROUTES.INFO.ABOUT },
    CONTACT: { label: t.CONTACT, href: ROUTES.INFO.CONTACT },
  };
}

/**
 * Get navigation items based on user role and language
 */
export function getNavigationItems(user: User | null, language: 'ar' | 'en' = 'ar') {
  const t = ROUTE_TRANSLATIONS[language];
  
  if (!user) {
    return [
      { label: t.HOME, href: ROUTES.HOME },
      { label: t.LOGIN, href: ROUTES.LOGIN },
      { label: t.REGISTER, href: ROUTES.REGISTER },
    ];
  }

  const baseItems = [
    { label: t.DASHBOARD, href: ROUTES.USER.DASHBOARD },
    { label: t.APPOINTMENTS, href: ROUTES.HEALTH.APPOINTMENTS },
    { label: t.PATIENTS, href: ROUTES.HEALTH.PATIENTS },
    { label: t.SESSIONS, href: ROUTES.HEALTH.SESSIONS },
  ];

  if (user.role === "admin") {
    return [
      ...baseItems,
      { label: t.ADMIN, href: ROUTES.ADMIN.DASHBOARD },
      { label: t.USERS, href: ROUTES.ADMIN.USERS },
      { label: t.SETTINGS, href: ROUTES.ADMIN.SETTINGS },
    ];
  }

  return baseItems;
}
