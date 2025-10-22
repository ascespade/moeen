"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { getDefaultRouteForUser } from "@/lib/router";
import { useT } from "@/components/providers/I18nProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { loginWithCredentials, isLoading, isAuthenticated } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithCredentials(formData.email, formData.password, formData.rememberMe);
      // after login, compute default route (role-aware)
      window.location.href = getDefaultRouteForUser({
        id: "temp",
        email: formData.email,
        role: "user",
      } as any);
    } catch (err: any) {
      setError(err?.message || t("auth.login.error", "فشل تسجيل الدخول"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuickTestLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // Use test credentials for quick login
      await loginWithCredentials("test@moeen.com", "test123", false);
      // Redirect to dashboard
      window.location.href = getDefaultRouteForUser({
        id: "test-user",
        email: "test@moeen.com",
        role: "user",
      } as any);
    } catch (err: any) {
      setError(err?.message || "Quick test login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] via-white to-[var(--bg-gray-50)] p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-lg">
            <span className="text-2xl font-bold text-white">م</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            مرحباً بعودتك
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Login Form */}
        <div className="card shadow-xl">
          <div className="p-8">
            {error && (
              <div className="status-error mb-6 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">{t("auth.email", "البريد الإلكتروني")}</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input pr-10"
                    placeholder="you@example.com"
                    data-testid="email-input"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">{t("auth.password", "كلمة المرور")}</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="form-input pr-10"
                    placeholder="••••••••"
                    data-testid="password-input"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-400">🔒</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="text-brand focus:ring-brand h-4 w-4 rounded border-gray-300 focus:ring-2"
                    data-testid="remember-me-checkbox"
                  />
                  {t("auth.rememberMe", "تذكرني")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-brand text-sm font-medium transition-colors hover:text-[var(--brand-primary-hover)]"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting || isLoading}
                className="btn btn-brand btn-lg w-full font-semibold"
                data-testid="login-button"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            {/* Quick Test Login Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleQuickTestLogin}
                disabled={submitting || isLoading}
                className="btn btn-outline btn-lg w-full font-semibold"
                data-testid="quick-test-login-button"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--brand-primary)] border-t-transparent"></div>
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    تسجيل دخول سريع (اختبار)
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                اختبار سريع باستخدام بيانات تجريبية
              </p>
            </div>

            <div className="border-brand mt-6 border-t pt-6">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                ليس لديك حساب؟{" "}
                <Link
                  href={ROUTES.REGISTER}
                  className="text-brand font-medium transition-colors hover:text-[var(--brand-primary-hover)]"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}