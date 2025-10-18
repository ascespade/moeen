import { useState, useEffect, Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { getDefaultRouteForUser } from "@/lib/router";
import { useT } from "@/components/providers/I18nProvider";

"use client";

function LoginForm() {
  const { loginWithCredentials, isLoading, isAuthenticated } = useAuth();
  const { t } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.email) {
      setError(t("auth.email.required", "البريد الإلكتروني مطلوب"));
      return;

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t("auth.email.invalid", "البريد الإلكتروني غير صحيح"));
      return;

    if (!formData.password) {
      setError(t("auth.password.required", "كلمة المرور مطلوبة"));
      return;

    setSubmitting(true);
    try {
      const result = await loginWithCredentials(
        formData.email,
        formData.password,
        formData.rememberMe,
      );
      if (result.success) {
        // Get redirect URL from query params or default to dashboard
        const redirectUrl = searchParams.get("redirect") || "/dashboard";
        router.push(redirectUrl);
      }
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
    setError(null);

    // Real-time email validation
    if (name === "email") {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        setEmailError("البريد الإلكتروني غير صحيح");
      } else {
        setEmailError(null);
      }
    }
  };

  const handleQuickTestLogin = async (
    role: string,
    email: string,
    password: string,
  ) => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithCredentials(email, password, false);
      // Redirect based on role
      const routes: Record<string, string> = {
        admin: "/dashboard",
        supervisor: "/supervisor-dashboard",
        patient: "/patient-dashboard",
        staff: "/staff-dashboard",
        doctor: "/doctor-dashboard",
      };
      window.location.href = routes[role] || "/dashboard";
    } catch (err: any) {
      setError(err?.message || `فشل تسجيل دخول ${role}`);
    } finally {
      setSubmitting(false);
    }
  };

  const testAccounts = [
      role: "manager",
      email: "admin@moeen.com",
      password: "admin123",
      label: "👨‍💼 مدير",
      color:
        "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/50",
      route: "/dashboard",
    },
      role: "supervisor",
      email: "supervisor@moeen.com",
      password: "super123",
      label: "👔 مشرف",
      color:
        "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/50",
      route: "/supervisor-dashboard",
    },
      role: "agent",
      email: "test@moeen.com",
      password: "test123",
      label: "🏥 مريض",
      color:
        "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/50",
      route: "/dashboard/user",
    },
      role: "agent",
      email: "user@moeen.com",
      password: "user123",
      label: "👨‍⚕️ موظف",
      color:
        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/50",
      route: "/staff-dashboard",
    },
      role: "agent",
      email: "doctor@moeen.com",
      password: "doctor123",
      label: "⚕️ طبيب",
      color:
        "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg shadow-orange-500/50",
      route: "/doctor-dashboard",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] via-white to-[var(--bg-surface)] p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-lg">
            <span className="text-2xl font-bold text-white">م</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {t("auth.welcomeBack", "مرحباً بعودتك")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth.loginMessage", "سجل دخولك للوصول إلى لوحة التحكم")}
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
                <label htmlFor="email" className="form-label">
                  {t("auth.email", "البريد الإلكتروني")}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="you@example.com"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-400">📧</span>
                  </div>
                </div>
                {emailError && (
                  <p className="mt-1 text-sm text-brand-error">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  {t("auth.password", "كلمة المرور")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="••••••••"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-400">🔒</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="rememberMe"
                  className="inline-flex items-center gap-3 text-sm font-medium"
                >
                  <input
                    id="rememberMe"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="text-brand focus:ring-brand h-4 w-4 rounded border-gray-300 focus:ring-2"
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

            {/* Quick Test Login Buttons */}
            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-800 px-4 text-gray-500">
                    {t("auth.quickTest", "تسجيل دخول سريع للاختبار")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {testAccounts.map((account, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      handleQuickTestLogin(
                        account.role,
                        account.email,
                        account.password,
                      )
                    disabled={submitting || isLoading}
                    className={`${account.color} text-white px-4 py-4 rounded-xl font-bold text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 relative overflow-hidden group`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                    <span className="text-2xl relative z-10">
                      {account.label.split(" ")[0]}
                    </span>
                    <span className="text-xs font-medium relative z-10">
                      {account.label.split(" ")[1]}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-3 text-center text-xs text-gray-500">
                ⚡ {t("auth.testMessage", "اختبر النظام بحسابات تجريبية جاهزة")}
              </p>
            </div>

            <div className="border-brand mt-6 border-t pt-6">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t("auth.noAccount", "ليس لديك حساب؟")}{" "}
                <Link
                  href={ROUTES.REGISTER}
                  className="text-brand font-medium transition-colors hover:text-[var(--brand-primary-hover)]"
                >
                  {t("auth.createAccount", "إنشاء حساب جديد")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-primary"></div>
        </div>
    >
      <LoginForm />
    </Suspense>
  );
}}
