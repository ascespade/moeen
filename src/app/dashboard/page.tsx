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
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">📊</span>
                </div>
                <h3 className="card-title">التنقل</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li><a className="nav-link" href="#stats">
                <span className="w-2 h-2 bg-brand rounded-full"></span>
                الإحصائيات
              </a></li>
              <li><a className="nav-link" href="#charts">
                <span className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></span>
                الرسوم البيانية
              </a></li>
              <li><a className="nav-link" href="#activity">
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></span>
                آخر الأنشطة
              </a></li>
              <li><Link className="nav-link" href={ROUTES.SETTINGS}>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                الإعدادات
              </Link></li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[var(--brand-secondary)] rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">🤖</span>
                </div>
                <h3 className="card-title">الروبوت (Chatbot)</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li><Link className="nav-link" href={ROUTES.CHATBOT.FLOWS}>
                <span className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></span>
                تدفقات المحادثة
              </Link></li>
              <li><Link className="nav-link" href={ROUTES.CHATBOT.TEMPLATES}>
                <span className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></span>
                قوالب الرسائل
              </Link></li>
              <li><Link className="nav-link" href={ROUTES.CHATBOT.INTEGRATIONS}>
                <span className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></span>
                التكاملات
              </Link></li>
              <li><Link className="nav-link" href={ROUTES.CHATBOT.ANALYTICS}>
                <span className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></span>
                التحليلات
              </Link></li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[var(--brand-accent)] rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">👥</span>
                </div>
                <h3 className="card-title">إدارة علاقات العملاء (CRM)</h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li><Link className="nav-link" href={ROUTES.CRM.CONTACTS}>
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></span>
                جهات الاتصال
              </Link></li>
              <li><Link className="nav-link" href={ROUTES.CRM.LEADS}>
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></span>
                العملاء المحتملون
              </Link></li>
              <li><Link className="nav-link" href={ROUTES.CRM.DEALS}>
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></span>
                الصفقات
              </Link></li>
              <li><Link className="nav-link" href={ROUTES.CRM.ACTIVITIES}>
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></span>
                الأنشطة
              </Link></li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">✅</span>
                </div>
                <h3 className="card-title">حالة النظام</h3>
              </div>
            </div>
            <div className="status-success">كل الخدمات تعمل بشكل طبيعي</div>
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
                <span className="w-2 h-2 bg-brand rounded-full"></span>
                تم إنشاء قناة جديدة: الدعم الفني
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--brand-secondary)] rounded-full"></span>
                تم إضافة مستخدم: Ahmed@example.com
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--brand-accent)] rounded-full"></span>
                تم استقبال 230 رسالة خلال الساعة الماضية
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}


