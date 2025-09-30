"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      document.cookie = "mu3een_demo_auth=true; path=/; max-age=86400";
      window.location.href = "/dashboard";
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/hemam-logo.jpg"
              alt="Hemam Logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
              unoptimized
            />
            <span className="text-3xl font-bold text-brand-primary">مُعين</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">مرحباً بك مرة أخرى</h1>
          <p className="text-gray-600 dark:text-gray-400">سجل دخولك للوصول إلى لوحة التحكم</p>
        </div>

        <div className="rounded-xl border border-[var(--brand-border)] bg-[color:var(--background)]/70 backdrop-blur p-4 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="py-3 px-4 block w-full border border-[var(--brand-border)] rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] sm:text-sm transition"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  id="password-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="py-3 px-4 pe-12 block w-full border border-[var(--brand-border)] rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] sm:text-sm transition"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 start-3 inline-flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-700"
                  aria-label="إظهار/إخفاء كلمة المرور"
                  data-hs-toggle-password='{"target":"#password-input"}'
                >
                  <span data-hs-toggle-password-class="hidden">إظهار</span>
                  <span className="hidden" data-hs-toggle-password-class="block">إخفاء</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="shrink-0 rounded border-[var(--brand-border)] text-[var(--brand-primary)] focus:ring-[var(--focus-ring)]"
                />
                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">تذكرني</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-brand-primary underline hover:text-brand-primary-hover">نسيت كلمة المرور؟</Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-3 font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--brand-border)]">
            <button
              onClick={() => {
                document.cookie = "mu3een_demo_auth=true; path=/; max-age=86400";
                window.location.href = "/dashboard";
              }}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-3 font-medium bg-[var(--brand-surface)] text-[color:var(--foreground)] hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)] border border-[var(--brand-border)]"
            >
              ➡️ دخول تجريبي
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="text-brand-primary hover:text-brand-primary-hover font-medium transition-colors">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
