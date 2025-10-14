"use client";
import { useRequireAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { ChartsA, ChartsB, ChartsC } from "@/components/dashboard/Charts";
import Link from "next/link";

import KpiCard from "@/components/dashboard/KpiCard";

export default function DashboardPage() {
  useRequireAuth("/login");

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      {/* Top Bar */}
      <div className="border-brand border-b bg-white dark:bg-gray-900">
        <div className="container-app flex items-center justify-between py-4">
          <h1 className="text-brand text-2xl font-bold">لوحة التحكم</h1>
          <div className="text-sm text-gray-500">
            اليوم: {new Date().toLocaleDateString("ar-SA")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app grid grid-cols-1 gap-6 py-6 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="space-y-4 lg:col-span-3">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="bg-brand flex h-6 w-6 items-center justify-center rounded-md">
                  <span className="text-xs text-white">📊</span>
                </div>
                <h3 className="card-title">التنقل</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li>
                <a className="nav-link" href="#stats">
                  <span className="bg-brand h-2 w-2 rounded-full"></span>
                  الإحصائيات
                </a>
              </li>
              <li>
                <a className="nav-link" href="#charts">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]"></span>
                  الرسوم البيانية
                </a>
              </li>
              <li>
                <a className="nav-link" href="#activity">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"></span>
                  آخر الأنشطة
                </a>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.SETTINGS}>
                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                  الإعدادات
                </Link>
              </li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-secondary)]">
                  <span className="text-xs text-white">🤖</span>
                </div>
                <h3 className="card-title">الروبوت (Chatbot)</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li>
                <Link className="nav-link" href={ROUTES.CHATBOT.FLOWS}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]"></span>
                  تدفقات المحادثة
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.CHATBOT.TEMPLATES}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]"></span>
                  قوالب الرسائل
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.CHATBOT.INTEGRATIONS}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]"></span>
                  التكاملات
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.CHATBOT.ANALYTICS}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]"></span>
                  التحليلات
                </Link>
              </li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-accent)]">
                  <span className="text-xs text-white">👥</span>
                </div>
                <h3 className="card-title">إدارة علاقات العملاء (CRM)</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li>
                <Link className="nav-link" href={ROUTES.CRM.CONTACTS}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"></span>
                  جهات الاتصال
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.CRM.LEADS}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"></span>
                  العملاء المحتملون
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.CRM.DEALS}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"></span>
                  الصفقات
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.CRM.ACTIVITIES}>
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"></span>
                  الأنشطة
                </Link>
              </li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500">
                  <span className="text-xs text-white">✅</span>
                </div>
                <h3 className="card-title">حالة النظام</h3>
              </div>
            </div>
            <div className="status-success">كل الخدمات تعمل بشكل طبيعي</div>
          </div>
        </aside>

        {/* Main */}
        <section className="space-y-6 lg:col-span-9">
          {/* KPIs */}
          <div id="stats" className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard title="المستخدمون" value="1,248" hint="+4% هذا الأسبوع" />
            <KpiCard title="القنوات" value="12" hint="-1% هذا الأسبوع" />
            <KpiCard title="المحادثات" value="3,420" hint="+12%" />
            <KpiCard title="الرسائل" value="18,305" hint="+7%" />
          </div>

          {/* Charts */}
          <div id="charts" className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">النشاط اليومي</h3>
              </div>
              <ChartsA />
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">مقارنة أسبوعية</h3>
              </div>
              <ChartsB />
            </div>
            <div className="card xl:col-span-2">
              <div className="card-header">
                <h3 className="card-title">توزيع القنوات</h3>
              </div>
              <ChartsC />
            </div>
          </div>

          {/* Activity */}
          <div id="activity" className="card">
            <div className="card-header">
              <h3 className="card-title">آخر الأنشطة</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-brand h-2 w-2 rounded-full"></span>
                تم إنشاء قناة جديدة: الدعم الفني
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]"></span>
                تم إضافة مستخدم: Ahmed@example.com
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"></span>
                تم استقبال 230 رسالة خلال الساعة الماضية
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
