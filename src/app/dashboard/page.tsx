"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import KpiCard from "@/components/dashboard/KpiCard";
import { ChartsA, ChartsB, ChartsC } from "@/components/dashboard/Charts";

export default function DashboardPage() {
  useRequireAuth("/login");

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-brand">
        <div className="container-app py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand">لوحة التحكم</h1>
          <div className="text-sm text-gray-500">اليوم: {new Date().toLocaleDateString("ar-SA")}</div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 mb-2">التنقل</div>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:underline" href="#stats">الإحصائيات</a></li>
              <li><a className="hover:underline" href="#charts">الرسوم البيانية</a></li>
              <li><a className="hover:underline" href="#activity">آخر الأنشطة</a></li>
              <li><Link className="hover:underline" href={ROUTES.SETTINGS}>الإعدادات</Link></li>
            </ul>
          </div>
          <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 mb-2">الروبوت (Chatbot)</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:underline" href={ROUTES.CHATBOT.FLOWS}>تدفقات المحادثة</Link></li>
              <li><Link className="hover:underline" href={ROUTES.CHATBOT.TEMPLATES}>قوالب الرسائل</Link></li>
              <li><Link className="hover:underline" href={ROUTES.CHATBOT.INTEGRATIONS}>التكاملات</Link></li>
              <li><Link className="hover:underline" href={ROUTES.CHATBOT.ANALYTICS}>التحليلات</Link></li>
            </ul>
          </div>
          <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 mb-2">إدارة علاقات العملاء (CRM)</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:underline" href={ROUTES.CRM.CONTACTS}>جهات الاتصال</Link></li>
              <li><Link className="hover:underline" href={ROUTES.CRM.LEADS}>العملاء المحتملون</Link></li>
              <li><Link className="hover:underline" href={ROUTES.CRM.DEALS}>الصفقات</Link></li>
              <li><Link className="hover:underline" href={ROUTES.CRM.ACTIVITIES}>الأنشطة</Link></li>
            </ul>
          </div>
          <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 mb-2">حالة النظام</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">كل الخدمات تعمل بشكل طبيعي</div>
          </div>
        </aside>

        {/* Main */}
        <section className="lg:col-span-9 space-y-6">
          {/* KPIs */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard title="المستخدمون" value="1,248" hint="+4% هذا الأسبوع" />
            <KpiCard title="القنوات" value="12" hint="-1% هذا الأسبوع" />
            <KpiCard title="المحادثات" value="3,420" hint="+12%" />
            <KpiCard title="الرسائل" value="18,305" hint="+7%" />
          </div>

          {/* Charts */}
          <div id="charts" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
              <div className="text-sm text-gray-500 mb-2">النشاط اليومي</div>
              <ChartsA />
            </div>
            <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
              <div className="text-sm text-gray-500 mb-2">مقارنة أسبوعية</div>
              <ChartsB />
            </div>
            <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4 xl:col-span-2">
              <div className="text-sm text-gray-500 mb-2">توزيع القنوات</div>
              <ChartsC />
            </div>
          </div>

          {/* Activity */}
          <div id="activity" className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 mb-3">آخر الأنشطة</div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>تم إنشاء قناة جديدة: الدعم الفني</li>
              <li>تم إضافة مستخدم: Ahmed@example.com</li>
              <li>تم استقبال 230 رسالة خلال الساعة الماضية</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}


