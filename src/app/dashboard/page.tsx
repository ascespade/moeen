"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useT } from "@/components/providers/I18nProvider";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useT();

  // Redirect based on user role - moved to single useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case "doctor":
          router.push("/dashboard/doctor");
          break;
        case "patient":
          router.push("/dashboard/patient");
          break;
        case "staff":
          router.push("/dashboard/staff");
          break;
        case "supervisor":
          router.push("/dashboard/supervisor");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/dashboard/patient");
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

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
        <p className="text-gray-600">جارٍ التوجيه إلى لوحة التحكم المناسبة...</p>
      </div>
    </div>
  );
}
