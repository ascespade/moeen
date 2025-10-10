"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  probability: number;
  expectedCloseDate: string;
  contactId: string;
  contactName: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  notes?: string;
  tags: string[];
}

const mockDeals: Deal[] = [
  {
    id: "1",
    title: "عقد إدارة المواعيد - مستشفى الملك فهد",
    value: 150000,
    stage: "negotiation",
    probability: 75,
    expectedCloseDate: "2024-02-15",
    contactId: "1",
    contactName: "أحمد العتيبي",
    assignedTo: "سارة أحمد",
    source: "موقع إلكتروني",
    createdAt: "2024-01-01",
    lastActivity: "2024-01-15",
    notes: "في مرحلة المفاوضات النهائية",
    tags: ["عالي القيمة", "مستشفى"]
  },
  {
    id: "2",
    title: "نظام إدارة المرضى - عيادة الأسنان",
    value: 75000,
    stage: "proposal",
    probability: 60,
    expectedCloseDate: "2024-01-30",
    contactId: "2",
    contactName: "فاطمة السعيد",
    assignedTo: "محمد حسن",
    source: "إحالة",
    createdAt: "2024-01-05",
    lastActivity: "2024-01-12",
    tags: ["عيادة", "متوسط القيمة"]
  }
];

export default function CRMDealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStageColor = (stage: Deal["stage"]) => {
    switch (stage) {
      case "prospecting": return "bg-gray-100 text-gray-800";
      case "qualification": return "bg-blue-100 text-blue-800";
      case "proposal": return "bg-yellow-100 text-yellow-800";
      case "negotiation": return "bg-orange-100 text-orange-800";
      case "closed-won": return "bg-green-100 text-green-800";
      case "closed-lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStageText = (stage: Deal["stage"]) => {
    switch (stage) {
      case "prospecting": return "استكشاف";
      case "qualification": return "تأهيل";
      case "proposal": return "عرض";
      case "negotiation": return "مفاوضات";
      case "closed-won": return "مكتمل - فوز";
      case "closed-lost": return "مكتمل - خسارة";
      default: return "غير محدد";
    }
  };

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === "all" || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const stages = ["prospecting", "qualification", "proposal", "negotiation", "closed-won", "closed-lost"];

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة الصفقات</h1>
                <p className="text-gray-600 dark:text-gray-300">تتبع وإدارة صفقات المبيعات</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 rounded-lg">
                <button onClick={() => setViewMode("table")} className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}>جدول</button>
                <button onClick={() => setViewMode("kanban")} className={`px-3 py-2 text-sm ${viewMode === "kanban" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}>كانبان</button>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة صفقة</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockDeals.length}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الصفقات</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockDeals.filter(d => d.stage === "closed-won").length}</div>
            <div className="text-gray-600 dark:text-gray-300">مكتملة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{mockDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()} ريال</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي القيمة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{Math.round(mockDeals.reduce((sum, d) => sum + d.probability, 0) / mockDeals.length)}%</div>
            <div className="text-gray-600 dark:text-gray-300">متوسط الاحتمالية</div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البحث</label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث في الصفقات..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المرحلة</label>
              <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع المراحل</option>
                <option value="prospecting">استكشاف</option>
                <option value="qualification">تأهيل</option>
                <option value="proposal">عرض</option>
                <option value="negotiation">مفاوضات</option>
                <option value="closed-won">مكتمل - فوز</option>
                <option value="closed-lost">مكتمل - خسارة</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">تطبيق الفلاتر</button>
            </div>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {stages.map((stage) => (
              <div key={stage} className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{getStageText(stage as Deal["stage"])}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{filteredDeals.filter(d => d.stage === stage).length} صفقة</p>
                </div>
                <div className="space-y-3">
                  {filteredDeals.filter(deal => deal.stage === stage).map((deal) => (
                    <div key={deal.id} className="card p-4 hover:shadow-soft transition-shadow cursor-move">
                      <div className="mb-3">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">{deal.title}</h4>
                        <p className="text-xs text-gray-500">{deal.contactName}</p>
                      </div>
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between"><span>القيمة:</span><span className="font-medium">{deal.value.toLocaleString()} ريال</span></div>
                        <div className="flex justify-between"><span>الاحتمالية:</span><span className="font-medium">{deal.probability}%</span></div>
                        <div className="flex justify-between"><span>التاريخ المتوقع:</span><span className="font-medium">{deal.expectedCloseDate}</span></div>
                      </div>
                      <div className="mt-3 flex gap-1">
                        <button className="flex-1 px-2 py-1 bg-[var(--brand-primary)] text-white text-xs rounded hover:bg-[var(--brand-primary-hover)] transition-colors">عرض</button>
                        <button className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">تحريك</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الصفقة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">جهة الاتصال</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">القيمة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الاحتمالية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المرحلة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المكلف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</div>
                          <div className="text-sm text-gray-500">تاريخ الإنشاء: {deal.createdAt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{deal.contactName}</div>
                        <div className="text-sm text-gray-500">{deal.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.value.toLocaleString()} ريال</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{deal.probability}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(deal.stage)}`}>{getStageText(deal.stage)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">{deal.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]">عرض</button>
                          <button className="text-gray-600 hover:text-gray-900">تعديل</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">💼</span></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد صفقات</h3>
            <p className="text-gray-600 dark:text-gray-300">لا توجد صفقات مطابقة للفلتر المحدد</p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إضافة صفقة جديدة</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان الصفقة</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="أدخل عنوان الصفقة" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">القيمة</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاحتمالية</label>
                  <input type="number" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="0-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المرحلة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="prospecting">استكشاف</option>
                    <option value="qualification">تأهيل</option>
                    <option value="proposal">عرض</option>
                    <option value="negotiation">مفاوضات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تاريخ الإغلاق المتوقع</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
                <button type="submit" className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة الصفقة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
