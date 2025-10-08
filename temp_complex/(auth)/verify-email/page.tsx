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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/logo.jpg"
            alt="Hemam Logo"
            width={64}
            height={64}
            className="mx-auto rounded mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            تحقق من بريدك الإلكتروني
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تم إرسال رابط التحقق إلى بريدك الإلكتروني
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              تحقق من بريدك الإلكتروني
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى فتح الرسالة والنقر
              على الرابط لتفعيل حسابك.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                لم تجد الرسالة؟
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• تحقق من مجلد الرسائل المهملة</li>
                <li>• تأكد من صحة عنوان البريد الإلكتروني</li>
                <li>• انتظر بضع دقائق ثم حاول مرة أخرى</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={isResending || isResent}
                className="w-full bg-[var(--brand-primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </>
                ) : isResent ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    تم الإرسال مرة أخرى
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    إعادة إرسال الرابط
                  </>
                )}
              </button>

              <Link
                href="/login"
                className="block w-full text-center text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] text-sm py-2"
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
}
