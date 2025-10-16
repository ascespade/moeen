"use client";

import { _useRouter } from "next/navigation";
import { _useEffect, useMemo } from "react";

import { _useT } from "@/components/providers/I18nProvider";
import { _useAuth } from "@/hooks/useAuth";

export default function __DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const __router = useRouter();
  const { t } = useT();

  // Memoize the redirect logic to prevent unnecessary re-renders
  const __redirectPath = useMemo(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case "doctor":
          return "/doctor-dashboard";
        case "patient":
          return "/patient-dashboard";
        case "staff":
          return "/dashboard/staff";
        case "supervisor":
          return "/dashboard/supervisor";
        case "admin":
          return "/admin/dashboard";
        default:
          return "/patient-dashboard";
      }
    }
    return null;
  }, [isAuthenticated, isLoading, user]);

  // Single useEffect for all redirects
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [isLoading, isAuthenticated, redirectPath, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">
          جارٍ التوجيه إلى لوحة التحكم المناسبة...
        </p>
      </div>
    </div>
  );
}
