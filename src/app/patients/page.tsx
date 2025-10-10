"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: "male" | "female";
  status: "active" | "inactive" | "blocked";
  lastVisit: string;
  totalSessions: number;
  insuranceProvider?: string;
  notes?: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "أحمد العتيبي",
    phone: "0501234567",
    email: "ahmed@example.com",
    age: 35,
    gender: "male",
    status: "active",
    lastVisit: "2024-01-10",
    totalSessions: 12,
    insuranceProvider: "التأمين التعاوني",
    notes: "مريض يعاني من آلام الظهر"
  },
  {
    id: "2",
    name: "فاطمة السعيد",
    phone: "0507654321",
    email: "fatima@example.com",
    age: 28,
    gender: "female",
    status: "active",
    lastVisit: "2024-01-12",
    totalSessions: 8,
    insuranceProvider: "الراجحي للتأمين"
  },
  {
    id: "3",
    name: "خالد القحطاني",
    phone: "0509876543",
    age: 42,
    gender: "male",
    status: "inactive",
    lastVisit: "2023-12-15",
    totalSessions: 5,
    notes: "توقف عن الحضور"
  },
  {
    id: "4",
    name: "نورا السعد",
    phone: "0504567890",
    email: "nora@example.com",
    age: 31,
    gender: "female",
    status: "blocked",
    lastVisit: "2024-01-05",
    totalSessions: 3,
    insuranceProvider: "التحالف الوطني",
    notes: "حظر بسبب عدم السداد"
  }
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "غير نشط";
      case "blocked":
        return "محظور";
      default:
        return "غير محدد";
    }
  };

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpg"
                alt="مُعين"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة المرضى</h1>
                <p className="text-gray-600 dark:text-gray-300">ملفات المرضى الشاملة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                إضافة مريض
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockPatients.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي المرضى</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockPatients.filter(p => p.status === "active").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مرضى نشطين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mockPatients.filter(p => p.status === "inactive").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">غير نشطين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {mockPatients.filter(p => p.status === "blocked").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">محظورين</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو الهاتف أو البريد..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="blocked">محظور</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                طريقة العرض
              </label>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-2 text-sm ${viewMode === "cards" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  بطاقات
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  جدول
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Patients Content */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="card p-6 hover:shadow-soft transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {patient.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{patient.phone}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(patient.status)}`}>
                    {getStatusText(patient.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">العمر:</span>
                    <span className="font-medium">{patient.age} سنة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">الجنس:</span>
                    <span className="font-medium">{patient.gender === "male" ? "ذكر" : "أنثى"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">آخر زيارة:</span>
                    <span className="font-medium">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">إجمالي الجلسات:</span>
                    <span className="font-medium">{patient.totalSessions}</span>
                  </div>
                  {patient.insuranceProvider && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">التأمين:</span>
                      <span className="font-medium text-sm">{patient.insuranceProvider}</span>
                    </div>
                  )}
                </div>

                {patient.notes && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ملاحظات:</strong> {patient.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={ROUTES.HEALTH.PATIENT(patient.id)}
                    className="flex-1 btn-brand py-2 rounded-lg text-white text-sm hover:bg-[var(--brand-primary-hover)] transition-colors text-center"
                  >
                    عرض الملف
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    تعديل
                  </button>
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المريض
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      العمر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      آخر زيارة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الجلسات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-sm ml-3">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.name}
                            </div>
                            {patient.email && (
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.age} سنة
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.lastVisit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.totalSessions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}>
                          {getStatusText(patient.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={ROUTES.HEALTH.PATIENT(patient.id)}
                            className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
                          >
                            عرض
                          </Link>
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
        )}

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👤</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد مرضى مطابقون للبحث المحدد
            </p>
          </div>
        )}
      </main>

      {/* Create Patient Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إضافة مريض جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="0501234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العمر
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="patient@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الجنس
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شركة التأمين
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="">بدون تأمين</option>
                    <option value="التأمين التعاوني">التأمين التعاوني</option>
                    <option value="الراجحي للتأمين">الراجحي للتأمين</option>
                    <option value="التحالف الوطني">التحالف الوطني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="أضف ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  إضافة المريض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}