"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { getDefaultRouteForUser } from "@/lib/router";

import Link from "next/link";

export default function LoginPage() {
  const { loginWithCredentials, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithCredentials(email, password, rememberMe);
      // after login, compute default route (role-aware)
      window.location.href = getDefaultRouteForUser({
        id: "temp",
        email,
        role: "user",
      } as any);
      });
    } catch (err: any) {
      setError(err?.message || "Login failed");
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
                <label className="form-label">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input pr-10"
                    placeholder="you@example.com"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">كلمة المرور</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input pr-10"
                    placeholder="••••••••"
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="text-brand focus:ring-brand h-4 w-4 rounded border-gray-300 focus:ring-2"
                  />
                  تذكرني
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
