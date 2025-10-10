"use client";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-4">
      <div className="container-app text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Hemam Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded"
          />
          <h1 className="text-4xl font-bold text-brand">
            مُعين
          </h1>
        </div>

        {/* 404 Content */}
        <div className="card shadow-soft p-8">
          <div className="text-brand mb-4 text-8xl font-bold">404</div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            الصفحة غير موجودة
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>

          {/* Action Buttons */}
          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              العودة للخلف
            </button>
          </div>

          {/* Help Section */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              هل تحتاج مساعدة؟
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href={"/contact"}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <HelpCircle className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  تواصل معنا
                </span>
              </Link>
              <Link
                href={"/faq"}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Search className="h-5 w-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  الأسئلة الشائعة
                </span>
              </Link>
            </div>
          </div>

          {/* Popular Links */}
          <div className="mt-8">
            <h4 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              صفحات شائعة:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href={"/about"}
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                من نحن
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href={"/features"}
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                المميزات
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href={"/pricing"}
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                الأسعار
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href={"/contact"}
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                تواصل
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">&copy; 2024 مُعين. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}
