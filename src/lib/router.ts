/**
 * Router utilities for navigation and route management
 */

import { _ROUTES } from "@/constants/routes";

export interface User {
  id: string;
  email: string;
  role: "admin" | "doctor" | "therapist" | "patient" | "family_member";
}

/**
 * Get the default route for a user based on their role
 */
export function __getDefaultRouteForUser(_user: User): string {
  switch (user.role) {
    case "admin":
      return ROUTES.ADMIN_DASHBOARD;
    case "doctor":
      return ROUTES.DOCTOR_DASHBOARD;
    case "therapist":
      return ROUTES.THERAPIST_DASHBOARD;
    case "patient":
      return ROUTES.PATIENT_DASHBOARD;
    case "family_member":
      return ROUTES.FAMILY_DASHBOARD;
    default:
      return ROUTES.DASHBOARD;
  }
}

/**
 * Check if a user has access to a specific route
 */
export function __canAccessRoute(_user: User, route: string): boolean {
  // Admin can access everything
  if (user.role === "admin") {
    return true;
  }

  // Role-based access control
  const roleRoutes: Record<string, string[]> = {
    doctor: [
      ROUTES.DOCTOR_DASHBOARD,
      ROUTES.PATIENTS,
      ROUTES.APPOINTMENTS,
      ROUTES.SESSIONS,
      ROUTES.REPORTS,
      ROUTES.PROFILE,
    ],
    therapist: [
      ROUTES.THERAPIST_DASHBOARD,
      ROUTES.PATIENTS,
      ROUTES.SESSIONS,
      ROUTES.REPORTS,
      ROUTES.PROFILE,
    ],
    patient: [
      ROUTES.PATIENT_DASHBOARD,
      ROUTES.APPOINTMENTS,
      ROUTES.MEDICAL_RECORDS,
      ROUTES.PROFILE,
    ],
    family_member: [
      ROUTES.FAMILY_DASHBOARD,
      ROUTES.PATIENTS,
      ROUTES.APPOINTMENTS,
      ROUTES.PROFILE,
    ],
  };

  const __allowedRoutes = roleRoutes[user.role] || [];
  return allowedRoutes.includes(route) || route === ROUTES.DASHBOARD;
}

/**
 * Get navigation menu items for a user
 */
export function __getNavigationItems(_user: User) {
  const __baseItems = [{ label: "الرئيسية", href: ROUTES.DASHBOARD, icon: "🏠" }];

  const roleItems: Record<
    string,
    Array<{ label: string; href: string; icon: string }>
  > = {
    admin: [
      { label: "لوحة التحكم", href: ROUTES.ADMIN_DASHBOARD, icon: "📊" },
      { label: "المستخدمين", href: ROUTES.ADMIN_USERS, icon: "👥" },
      { label: "التقارير", href: ROUTES.REPORTS, icon: "📈" },
      { label: "الإعدادات", href: ROUTES.SETTINGS, icon: "⚙️" },
    ],
    doctor: [
      { label: "لوحة التحكم", href: ROUTES.DOCTOR_DASHBOARD, icon: "📊" },
      { label: "المرضى", href: ROUTES.PATIENTS, icon: "👥" },
      { label: "المواعيد", href: ROUTES.APPOINTMENTS, icon: "📅" },
      { label: "الجلسات", href: ROUTES.SESSIONS, icon: "💬" },
      { label: "التقارير", href: ROUTES.REPORTS, icon: "📈" },
    ],
    therapist: [
      { label: "لوحة التحكم", href: ROUTES.THERAPIST_DASHBOARD, icon: "📊" },
      { label: "المرضى", href: ROUTES.PATIENTS, icon: "👥" },
      { label: "الجلسات", href: ROUTES.SESSIONS, icon: "💬" },
      { label: "التقارير", href: ROUTES.REPORTS, icon: "📈" },
    ],
    patient: [
      { label: "لوحة التحكم", href: ROUTES.PATIENT_DASHBOARD, icon: "📊" },
      { label: "المواعيد", href: ROUTES.APPOINTMENTS, icon: "📅" },
      { label: "السجلات الطبية", href: ROUTES.MEDICAL_RECORDS, icon: "📋" },
      { label: "الملف الشخصي", href: ROUTES.PROFILE, icon: "👤" },
    ],
    family_member: [
      { label: "لوحة التحكم", href: ROUTES.FAMILY_DASHBOARD, icon: "📊" },
      { label: "المرضى", href: ROUTES.PATIENTS, icon: "👥" },
      { label: "المواعيد", href: ROUTES.APPOINTMENTS, icon: "📅" },
      { label: "الملف الشخصي", href: ROUTES.PROFILE, icon: "👤" },
    ],
  };

  const __roleSpecificItems = roleItems[user.role] || [];
  return [...baseItems, ...roleSpecificItems];
}

/**
 * Redirect to login if user is not authenticated
 */
export function __redirectToLogin(): string {
  return ROUTES.LOGIN;
}

/**
 * Redirect to unauthorized page if user doesn't have access
 */
export function __redirectToUnauthorized(): string {
  return ROUTES.UNAUTHORIZED;
}

/**
 * Check if a route requires authentication
 */
export function __requiresAuth(_route: string): boolean {
  const __publicRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.HOME,
  ];

  return !publicRoutes.includes(route);
}

/**
 * Get breadcrumb items for a route
 */
export function __getBreadcrumbs(
  route: string,
): Array<{ label: string; href: string }> {
  const breadcrumbMap: Record<
    string,
    Array<{ label: string; href: string }>
  > = {
    [ROUTES.ADMIN_DASHBOARD]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "لوحة التحكم", href: ROUTES.ADMIN_DASHBOARD },
    ],
    [ROUTES.DOCTOR_DASHBOARD]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "لوحة التحكم", href: ROUTES.DOCTOR_DASHBOARD },
    ],
    [ROUTES.THERAPIST_DASHBOARD]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "لوحة التحكم", href: ROUTES.THERAPIST_DASHBOARD },
    ],
    [ROUTES.PATIENT_DASHBOARD]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "لوحة التحكم", href: ROUTES.PATIENT_DASHBOARD },
    ],
    [ROUTES.PATIENTS]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "المرضى", href: ROUTES.PATIENTS },
    ],
    [ROUTES.APPOINTMENTS]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "المواعيد", href: ROUTES.APPOINTMENTS },
    ],
    [ROUTES.SESSIONS]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "الجلسات", href: ROUTES.SESSIONS },
    ],
    [ROUTES.REPORTS]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "التقارير", href: ROUTES.REPORTS },
    ],
    [ROUTES.PROFILE]: [
      { label: "الرئيسية", href: ROUTES.DASHBOARD },
      { label: "الملف الشخصي", href: ROUTES.PROFILE },
    ],
  };

  return (
    breadcrumbMap[route] || [{ label: "الرئيسية", href: ROUTES.DASHBOARD }]
  );
}
