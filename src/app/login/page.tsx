"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { getDefaultRouteForUser } from "@/lib/router";

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
        name: "",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--brand-primary)" }}>
          تسجيل الدخول
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
              تذكرني
            </label>
            <Link href="/forgot-password" className="text-sm text-[var(--brand-primary)] hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--brand-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-60"
          >
            {submitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          ليس لديك حساب؟ {" "}
          <Link href={ROUTES.REGISTER} className="text-[var(--brand-primary)] hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}


