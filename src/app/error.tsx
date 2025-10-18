"use client";

import Image from "next/image";
import Link from "next/link";

import { RefreshCw, Home, Bug, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Hemam Logo"
            width={80}
            height={80}
            className="mx-auto rounded mb-4"
          />
          <h1 className="text-4xl font-bold text-brand">مُعين</h1>
        </div>

        {/* Error Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-brand-error dark:text-red-400" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            حدث خطأ غير متوقع
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            عذراً، حدث خطأ غير متوقع. نحن نعمل على إصلاحه.
          </p>

          {error.message && (
            <div className="bg-surface dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-[var(--brand-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              إعادة المحاولة
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-surface dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-surface dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إذا استمر الخطأ
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface dark:hover:bg-gray-600 transition-colors"
              >
                <Bug className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  الإبلاغ عن المشكلة
                </span>
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface dark:hover:bg-gray-600 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  الحصول على المساعدة
                </span>
              </Link>
            </div>
          </div>

          {/* Error Details */}
          {error.digest && (
            <div className="mt-6 p-4 bg-surface dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                معرف الخطأ:
              </h4>
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
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
