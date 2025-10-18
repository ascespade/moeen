import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { ROUTES } from "@/constants/routes";

("use client");

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("البريد الإلكتروني مطلوب");
      return;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;

    setIsLoading(true);
    setError("");

    try {
      // Real API call
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(
          data.error || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور.",
        );
      }
    } catch (error) {
      setError(
        "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور. حاول مرة أخرى.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-4">
        <div className="card w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✅
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            تم إرسال الرابط!
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من
            صندوق الوارد أو مجلد الرسائل المزعجة.
          </p>
          <div className="space-y-3">
            <Link
              href={ROUTES.LOGIN}
              className="btn-brand inline-block w-full rounded-lg px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              العودة لتسجيل الدخول
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="w-full rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-surface"
            >
              إرسال رابط آخر
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Image
              src="/logo.png"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-brand text-3xl font-bold">مُعين</h1>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            نسيان كلمة المرور
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          {error && (
            <div className="status-error mb-6 p-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="form-input"
                placeholder="أدخل بريدك الإلكتروني"
                disabled={isLoading}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-brand btn-lg w-full"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  جاري الإرسال...
                </>
              ) : (
                "إرسال رابط إعادة التعيين"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              تذكرت كلمة المرور؟{" "}
              <Link
                href={ROUTES.LOGIN}
                className="text-brand font-semibold hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            إذا لم تستلم البريد الإلكتروني، تحقق من مجلد الرسائل المزعجة أو{" "}
            <button
              onClick={() => {
                setEmail("");
                setError("");
              }}
              className="text-[var(--brand-primary)] hover:underline"
            >
              حاول مرة أخرى
            </button>
          </p>
        </div>
      </div>
    </div>
  );
