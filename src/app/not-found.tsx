import Link from "next/link";
import Image from "next/image";

import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

("use client");

export default function NotFound() {
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

        {/* 404 Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-8xl font-bold text-[var(--brand-primary)] mb-4">
            404
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[var(--brand-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-surface dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة للخلف
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-surface dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              هل تحتاج مساعدة؟
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface dark:hover:bg-gray-600 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  تواصل معنا
                </span>
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface dark:hover:bg-gray-600 transition-colors"
              >
                <Search className="w-5 h-5 text-[var(--brand-primary)]" />
                <span className="text-gray-700 dark:text-gray-300">
                  الأسئلة الشائعة
                </span>
              </Link>
            </div>
          </div>

          {/* Popular Links */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              صفحات شائعة:
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/about"
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                من نحن
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/features"
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                المميزات
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/pricing"
                className="text-sm text-[var(--brand-primary)] hover:underline"
              >
                الأسعار
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/contact"
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
