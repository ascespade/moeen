import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";

("use client");

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  source: string;
  score: number;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo?: string;
  lastActivity: string;
  notes?: string;
  tags: string[];

const mockLeads: Lead[] = [
    id: "1",
    name: "أحمد العتيبي",
    email: "ahmed@company.com",
    phone: "0501234567",
    company: "شركة التقنية المتقدمة",
    position: "مدير تقنية المعلومات",
    status: "qualified",
    source: "موقع إلكتروني",
    score: 85,
    estimatedValue: 50000,
    probability: 70,
    expectedCloseDate: "2024-02-15",
    assignedTo: "سارة أحمد",
    lastActivity: "2024-01-15",
    notes: "مهتم بحلول إدارة المواعيد",
    tags: ["تقنية", "عالي القيمة"],
  },
    id: "2",
    name: "فاطمة السعيد",
    email: "fatima@hospital.com",
    phone: "0507654321",
    company: "مستشفى الملك فهد",
    position: "مديرة التمريض",
    status: "contacted",
    source: "إحالة",
    score: 72,
    estimatedValue: 30000,
    probability: 40,
    expectedCloseDate: "2024-03-01",
    assignedTo: "محمد حسن",
    lastActivity: "2024-01-12",
    notes: "تحتاج عرض توضيحي",
    tags: ["صحة", "مستشفى"],
  },
];

export default function CRMLeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "negotiation":
        return "bg-orange-100 text-orange-800";
      case "closed-won":
        return "bg-emerald-100 text-emerald-800";
      case "closed-lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusText = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "جديد";
      case "contacted":
        return "تم التواصل";
      case "qualified":
        return "مؤهل";
      case "proposal":
        return "عرض مقدم";
      case "negotiation":
        return "مفاوضات";
      case "closed-won":
        return "مكتمل - فوز";
      case "closed-lost":
        return "مكتمل - خسارة";
      default:
        return "غير محدد";
    }
  };

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="مُعين"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-brand text-2xl font-bold">
                  إدارة العملاء المحتملين
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  تتبع وتحويل العملاء المحتملين
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  جدول
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-2 text-sm ${viewMode === "kanban" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  كانبان
                </button>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إضافة عميل محتمل
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-primary">
              {mockLeads.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي العملاء المحتملين
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-success">
              {mockLeads.filter((l) => l.status === "qualified").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مؤهلين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockLeads
                .reduce((sum, l) => sum + l.estimatedValue, 0)
                .toLocaleString()}{" "}
              ريال
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي القيمة المتوقعة
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-primary">
              {Math.round(
                mockLeads.reduce((sum, l) => sum + l.probability, 0) /
                  mockLeads.length,
              )}
              %
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              متوسط احتمالية الإغلاق
            </div>
          </div>
        </div>

        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو البريد أو الشركة..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الحالات</option>
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="qualified">مؤهل</option>
                <option value="proposal">عرض مقدم</option>
                <option value="negotiation">مفاوضات</option>
                <option value="closed-won">مكتمل - فوز</option>
                <option value="closed-lost">مكتمل - خسارة</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      العميل المحتمل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الشركة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      النقاط
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      القيمة المتوقعة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الاحتمالية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-surface dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-semibold text-white">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {lead.company || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.position}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.score}/100
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {lead.estimatedValue.toLocaleString()} ريال
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {lead.probability}%
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${getStatusColor(lead.status)}`}
                        >
                          {getStatusText(lead.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]">
                            عرض
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            تعديل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["new", "contacted", "qualified", "proposal"].map((status) => (
              <div key={status} className="space-y-4">
                <div className="rounded-lg bg-surface p-4 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {getStatusText(status as Lead["status"])}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredLeads.filter((l) => l.status === status).length}{" "}
                    عميل محتمل
                  </p>
                </div>
                <div className="space-y-3">
                  {filteredLeads
                    .filter((lead) => lead.status === status)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        className="card hover:shadow-soft p-4 transition-shadow"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-semibold text-white">
                            {lead.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{lead.name}</h4>
                            <p className="text-xs text-gray-500">
                              {lead.company}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                          <div className="flex justify-between">
                            <span>النقاط:</span>
                            <span className="font-medium">
                              {lead.score}/100
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>القيمة:</span>
                            <span className="font-medium">
                              {lead.estimatedValue.toLocaleString()} ريال
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>الاحتمالية:</span>
                            <span className="font-medium">
                              {lead.probability}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-1">
                          <button className="flex-1 rounded bg-[var(--brand-primary)] px-2 py-1 text-xs text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                            عرض
                          </button>
                          <button className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-surface">
                            تحريك
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredLeads.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد عملاء محتملين
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد عملاء محتملين مطابقون للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إضافة عميل محتمل جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="example@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="0501234567"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الشركة
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="اسم الشركة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الحالة
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="new">جديد</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="qualified">مؤهل</option>
                    <option value="proposal">عرض مقدم</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    النقاط
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    القيمة المتوقعة
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  إضافة العميل المحتمل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
