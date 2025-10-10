"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  source: string;
  score: number;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo?: string;
  lastActivity: string;
  notes?: string;
  tags: string[];
}

const mockLeads: Lead[] = [
  {
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
    tags: ["تقنية", "عالي القيمة"]
  },
  {
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
    tags: ["صحة", "مستشفى"]
  }
];

export default function CRMLeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "qualified": return "bg-green-100 text-green-800";
      case "proposal": return "bg-purple-100 text-purple-800";
      case "negotiation": return "bg-orange-100 text-orange-800";
      case "closed-won": return "bg-emerald-100 text-emerald-800";
      case "closed-lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Lead["status"]) => {
    switch (status) {
      case "new": return "جديد";
      case "contacted": return "تم التواصل";
      case "qualified": return "مؤهل";
      case "proposal": return "عرض مقدم";
      case "negotiation": return "مفاوضات";
      case "closed-won": return "مكتمل - فوز";
      case "closed-lost": return "مكتمل - خسارة";
      default: return "غير محدد";
    }
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة العملاء المحتملين</h1>
                <p className="text-gray-600 dark:text-gray-300">تتبع وتحويل العملاء المحتملين</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 rounded-lg">
                <button onClick={() => setViewMode("table")} className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}>جدول</button>
                <button onClick={() => setViewMode("kanban")} className={`px-3 py-2 text-sm ${viewMode === "kanban" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}>كانبان</button>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة عميل محتمل</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockLeads.length}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي العملاء المحتملين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockLeads.filter(l => l.status === "qualified").length}</div>
            <div className="text-gray-600 dark:text-gray-300">مؤهلين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{mockLeads.reduce((sum, l) => sum + l.estimatedValue, 0).toLocaleString()} ريال</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي القيمة المتوقعة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{Math.round(mockLeads.reduce((sum, l) => sum + l.probability, 0) / mockLeads.length)}%</div>
            <div className="text-gray-600 dark:text-gray-300">متوسط احتمالية الإغلاق</div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البحث</label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث بالاسم أو البريد أو الشركة..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
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
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">تطبيق الفلاتر</button>
            </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">العميل المحتمل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الشركة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">النقاط</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">القيمة المتوقعة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الاحتمالية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-sm ml-3">{lead.name.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{lead.company || "غير محدد"}</div>
                        <div className="text-sm text-gray-500">{lead.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.score}/100</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{lead.estimatedValue.toLocaleString()} ريال</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{lead.probability}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>{getStatusText(lead.status)}</span>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["new", "contacted", "qualified", "proposal"].map((status) => (
              <div key={status} className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{getStatusText(status as Lead["status"])}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{filteredLeads.filter(l => l.status === status).length} عميل محتمل</p>
                </div>
                <div className="space-y-3">
                  {filteredLeads.filter(lead => lead.status === status).map((lead) => (
                    <div key={lead.id} className="card p-4 hover:shadow-soft transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-sm">{lead.name.charAt(0)}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{lead.name}</h4>
                          <p className="text-xs text-gray-500">{lead.company}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between"><span>النقاط:</span><span className="font-medium">{lead.score}/100</span></div>
                        <div className="flex justify-between"><span>القيمة:</span><span className="font-medium">{lead.estimatedValue.toLocaleString()} ريال</span></div>
                        <div className="flex justify-between"><span>الاحتمالية:</span><span className="font-medium">{lead.probability}%</span></div>
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
        )}

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🎯</span></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد عملاء محتملين</h3>
            <p className="text-gray-600 dark:text-gray-300">لا توجد عملاء محتملين مطابقون للفلتر المحدد</p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إضافة عميل محتمل جديد</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم الكامل</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="أدخل الاسم الكامل" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="example@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الهاتف</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="0501234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الشركة</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="اسم الشركة" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="new">جديد</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="qualified">مؤهل</option>
                    <option value="proposal">عرض مقدم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">النقاط</label>
                  <input type="number" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="0-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">القيمة المتوقعة</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
                <button type="submit" className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة العميل المحتمل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
