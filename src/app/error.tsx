"use client";
import { RefreshCw, Home, Bug, AlertTriangle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.jpg"
            alt="Hemam Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded"
          />
          <h1
            className="text-4xl font-bold"
            style={{ color: "var(--brand-primary)" }}
          >
            مُعين
          </h1>
        </div>

        {/* Error Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            حدث خطأ غير متوقع
          </h2>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            عذراً، حدث خطأ غير متوقع. نحن نعمل على إصلاحه.
          </p>

          {error.message && (
            <div className="mb-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
              <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              <RefreshCw className="h-5 w-5" />
              إعادة المحاولة
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </Link>
          </div>

          {/* Help Section */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              إذا استمر الخطأ
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Bug className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  الإبلاغ عن المشكلة
                </span>
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <AlertTriangle className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  الحصول على المساعدة
                </span>
              </Link>
            </div>
          </div>

          {/* Error Details */}
          {error.digest && (
            <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
              <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                معرف الخطأ:
              </h4>
              <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                {error.digest}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">&copy; 2024 مُعين. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}
