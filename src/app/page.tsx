/**
 * Enhanced Homepage
 * الصفحة الرئيسية المحسّنة
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background-secondary)]/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--brand-primary)]">
              Mu3een
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              إنشاء حساب
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-6">
          مرحباً بك في نظام Mu3een
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          نظام متكامل لإدارة الرعاية الصحية والمعلومات
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border-2 border-[var(--border)] text-[var(--text-primary)] rounded-lg font-semibold hover:bg-[var(--background-hover)] transition-colors"
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-12">
          المميزات الرئيسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              أمان عالي
            </h3>
            <p className="text-[var(--text-secondary)]">
              نظام مصادقة وتشفير متقدم لحماية بياناتك
            </p>
          </div>
          <div className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              إدارة المستخدمين
            </h3>
            <p className="text-[var(--text-secondary)]">
              إدارة شاملة للمستخدمين والصلاحيات
            </p>
          </div>
          <div className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              تقارير شاملة
            </h3>
            <p className="text-[var(--text-secondary)]">
              تقارير وإحصائيات مفصلة
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-[var(--text-secondary)]">
          <p>&copy; 2024 Mu3een. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
