"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/I18nProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { t } = useT();
  const { loginWithCredentials, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await loginWithCredentials(
        formData.email,
        formData.password,
        formData.rememberMe,
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Hemam Logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
              unoptimized
            />
            <span
              className="text-3xl font-bold"
              style={{ color: "var(--brand-primary)" }}
            >
              مُعين
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {t("auth.welcomeBack", "مرحباً بك مرة أخرى")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth.login.subtitle", "سجل دخولك للوصول إلى لوحة التحكم")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.email", "البريد الإلكتروني")}
              </label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t(
                    "auth.email.placeholder",
                    "أدخل بريدك الإلكتروني",
                  )}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.password", "كلمة المرور")}
              </label>
              <div className="relative">
                <Input
                  id="password-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t(
                    "auth.password.placeholder",
                    "أدخل كلمة المرور",
                  )}
                  required
                />
                <button
                  type="button"
                  className="absolute start-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-x-2 text-sm text-gray-500 hover:text-gray-700"
                  aria-label="إظهار/إخفاء كلمة المرور"
                  data-hs-toggle-password='{"target":"#password-input"}'
                >
                  <span data-hs-toggle-password-class="hidden">إظهار</span>
                  <span
                    className="hidden"
                    data-hs-toggle-password-class="block"
                  >
                    إخفاء
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="shrink-0 rounded border-gray-300"
                  style={{ accentColor: "var(--brand-primary)" }}
                />
                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                  {t("auth.remember", "تذكرني")}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm underline"
                style={{ color: "var(--brand-primary)" }}
              >
                {t("auth.forgot", "نسيت كلمة المرور؟")}
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 px-4 py-3"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                t("auth.login", "تسجيل الدخول")
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
            <Button
              variant="secondary"
              className="inline-flex w-full items-center justify-center gap-2 px-4 py-3"
              onClick={() => {
                setFormData({
                  email: "admin@mu3een.com",
                  password: "password",
                  rememberMe: false,
                });
              }}
            >
              ➡️ استخدام بيانات تجريبية
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="font-medium transition-colors"
              style={{ color: "var(--brand-primary)" }}
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
