"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { Mail, CheckCircle, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [isResent, setIsResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);

    // محاكاة إعادة إرسال رابط التحقق
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsResending(false);
    setIsResent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="Hemam Logo"
            width={64}
            height={64}
            className="mx-auto mb-4 rounded"
          />
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            تحقق من بريدك الإلكتروني
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تم إرسال رابط التحقق إلى بريدك الإلكتروني
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Mail className="h-8 w-8 text-brand-primary dark:text-blue-400" />
            </div>

            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              تحقق من بريدك الإلكتروني
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى فتح الرسالة والنقر
              على الرابط لتفعيل حسابك.
            </p>

            <div className="mb-6 rounded-lg bg-surface p-4 dark:bg-gray-700">
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                لم تجد الرسالة؟
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• تحقق من مجلد الرسائل المهملة</li>
                <li>• تأكد من صحة عنوان البريد الإلكتروني</li>
                <li>• انتظر بضع دقائق ثم حاول مرة أخرى</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={isResending || isResent}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    جاري الإرسال...
                  </>
                ) : isResent ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    تم الإرسال مرة أخرى
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    إعادة إرسال الرابط
                  </>
                )}
              </button>

              <Link
                href="/login"
                className="block w-full py-2 text-center text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            إذا واجهت مشاكل، يرجى{" "}
            <Link
              href="/contact"
              className="text-[var(--brand-primary)] hover:underline"
            >
              التواصل معنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
