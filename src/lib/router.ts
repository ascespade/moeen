import { ROUTES } from "@/constants/routes";
import type { User } from "@/types";

export function getDefaultRouteForUser(user?: User | null): string {
  const role = user?.role;
  if (role === "admin") return ROUTES.ADMIN.DASHBOARD;
  return ROUTES.USER.DASHBOARD;
}

export function to(path: string) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}


