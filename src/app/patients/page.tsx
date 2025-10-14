"use client";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

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
    notes: "مريض يعاني من آلام الظهر",
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
    insuranceProvider: "الراجحي للتأمين",
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
    notes: "توقف عن الحضور",
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
    notes: "حظر بسبب عدم السداد",
  },
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

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
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
                <h1 className="text-brand text-2xl font-bold">إدارة المرضى</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  ملفات المرضى الشاملة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إضافة مريض
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockPatients.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي المرضى
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockPatients.filter((p) => p.status === "active").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مرضى نشطين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockPatients.filter((p) => p.status === "inactive").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">غير نشطين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-red-600">
              {mockPatients.filter((p) => p.status === "blocked").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">محظورين</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو الهاتف أو البريد..."
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
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="blocked">محظور</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                طريقة العرض
              </label>
              <div className="flex rounded-lg border border-gray-300">
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
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Patients Content */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="card hover:shadow-soft p-6 transition-shadow"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)] font-semibold text-white">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {patient.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {patient.phone}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getStatusColor(patient.status)}`}
                  >
                    {getStatusText(patient.status)}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      العمر:
                    </span>
                    <span className="font-medium">{patient.age} سنة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      الجنس:
                    </span>
                    <span className="font-medium">
                      {patient.gender === "male" ? "ذكر" : "أنثى"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      آخر زيارة:
                    </span>
                    <span className="font-medium">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      إجمالي الجلسات:
                    </span>
                    <span className="font-medium">{patient.totalSessions}</span>
                  </div>
                  {patient.insuranceProvider && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        التأمين:
                      </span>
                      <span className="text-sm font-medium">
                        {patient.insuranceProvider}
                      </span>
                    </div>
                  )}
                </div>

                {patient.notes && (
                  <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ملاحظات:</strong> {patient.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={ROUTES.HEALTH.PATIENT(patient.id)}
                    className="btn-brand flex-1 rounded-lg py-2 text-center text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                  >
                    عرض الملف
                  </Link>
                  <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
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
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      المريض
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      العمر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      آخر زيارة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الجلسات
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
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-semibold text-white">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.name}
                            </div>
                            {patient.email && (
                              <div className="text-sm text-gray-500">
                                {patient.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.phone}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.age} سنة
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.lastVisit}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.totalSessions}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${getStatusColor(patient.status)}`}
                        >
                          {getStatusText(patient.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
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
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">👤</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
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
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="أدخل الاسم الكامل"
                />
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
                    العمر
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="patient@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الجنس
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    شركة التأمين
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="">بدون تأمين</option>
                    <option value="التأمين التعاوني">التأمين التعاوني</option>
                    <option value="الراجحي للتأمين">الراجحي للتأمين</option>
                    <option value="التحالف الوطني">التحالف الوطني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="أضف ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
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
