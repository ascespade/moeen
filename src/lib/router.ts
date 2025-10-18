import { ROUTES } from "@/constants/routes";

export interface User {
  id: string;
  email: string;
  role:
    | "admin"
    | "user"
    | "doctor"
    | "nurse"
    | "staff"
    | "supervisor"
    | "patient"
    | "agent"
    | "manager"
    | "demo"
    | "moderator";
  permissions?: string[];

/**
 * Get the default route for a user based on their role
 */
export function getDefaultRouteForUser(user: User | null): string {
  if (!user) {
    return ROUTES.LOGIN;

  switch (user.role) {
    case "admin":
      return ROUTES.ADMIN.DASHBOARD;
    case "doctor":
      return "/dashboard/doctor";
    case "nurse":
    case "staff":
      return "/dashboard/staff";
    case "supervisor":
      return "/dashboard/supervisor";
    case "patient":
      return "/dashboard/patient";
    case "agent":
    case "manager":
    case "demo":
      return "/dashboard";
    case "user":
    default:
      return "/dashboard";
  }

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return !((ROUTES as any).PUBLIC_ROUTES as readonly string[]).includes(
    pathname,
  );

/**
 * Check if a route requires admin privileges
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");

/**
 * Check if user has permission to access a route
 */
export function canAccessRoute(user: User | null, pathname: string): boolean {
  if (!user) {
    return !isProtectedRoute(pathname);

  if (isAdminRoute(pathname)) {
    return user.role === "admin";

  return true;

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

  const baseItems = [
    { label: "لوحة التحكم", href: ROUTES.USER.DASHBOARD },
    { label: "المواعيد", href: "/appointments" },
    { label: "المرضى", href: "/patients" },
    { label: "الجلسات", href: "/sessions" },
  ];

  if (user.role === "admin") {
    return [
      ...baseItems,
      { label: "الإدارة", href: ROUTES.ADMIN.DASHBOARD },
      { label: "المستخدمون", href: ROUTES.ADMIN.USERS },
      { label: "الإعدادات", href: ROUTES.ADMIN.SETTINGS },
    ];

  return baseItems;
}}}}}}}}}}}
