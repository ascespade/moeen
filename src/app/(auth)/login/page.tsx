"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useT } from "@/components/providers/I18nProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { t } = useT();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.jpg"
              alt="Hemam Logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
              unoptimized
            />
            <span className="text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>مُعين</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{t('auth.welcomeBack','مرحباً بك مرة أخرى')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('auth.login.subtitle','سجل دخولك للوصول إلى لوحة التحكم')}</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.email','البريد الإلكتروني')}</label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('auth.email.placeholder','أدخل بريدك الإلكتروني')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('auth.password','كلمة المرور')}</label>
              <div className="relative">
                <Input
                  id="password-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.password.placeholder','أدخل كلمة المرور')}
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
                <input type="checkbox" className="shrink-0 rounded border-gray-300" style={{ accentColor: "var(--brand-primary)" }} />
                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">{t('auth.remember','تذكرني')}</span>
              </label>
              <Link href="/forgot-password" className="text-sm underline" style={{ color: "var(--brand-primary)" }}>{t('auth.forgot','نسيت كلمة المرور؟')}</Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full inline-flex justify-center items-center gap-2 px-4 py-3">
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                t('auth.login','تسجيل الدخول')
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="secondary"
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-3"
              onClick={() => {
                document.cookie = "mu3een_demo_auth=true; path=/; max-age=86400";
                window.location.href = "/dashboard";
              }}
            >
              ➡️ دخول تجريبي
            </Button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-medium transition-colors" style={{ color: "var(--brand-primary)" }}>إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
