"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

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
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setError("حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            تم إرسال الرابط!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. 
            تحقق من صندوق الوارد أو مجلد الرسائل المزعجة.
          </p>
          <div className="space-y-3">
            <Link
              href={ROUTES.LOGIN}
              className="btn-brand px-6 py-3 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors inline-block w-full"
            >
              العودة لتسجيل الدخول
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إرسال رابط آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.jpg"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-brand">مُعين</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            نسيان كلمة المرور
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 status-error">
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
              className="w-full btn btn-brand btn-lg"
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
                className="text-brand hover:underline font-semibold"
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
}