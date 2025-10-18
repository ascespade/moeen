import { useState } from "react";

import Image from "next/image";

import { ROUTES } from "@/constants/routes";

("use client");

interface Session {
  id: string;
  patientName: string;
  doctorName: string;
  type: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  notes?: string;

const mockSessions: Session[] = [
    id: "1",
    patientName: "أحمد العتيبي",
    doctorName: "د. سارة أحمد",
    type: "علاج طبيعي",
    startTime: "09:00",
    endTime: "10:00",
    status: "in-progress",
    notes: "جلسة علاج طبيعي للظهر",
  },
    id: "2",
    patientName: "فاطمة السعيد",
    doctorName: "د. محمد حسن",
    type: "علاج نفسي",
    startTime: "10:30",
    endTime: "11:15",
    status: "upcoming",
  },
    id: "3",
    patientName: "خالد القحطاني",
    doctorName: "د. نورا محمد",
    type: "علاج وظيفي",
    startTime: "14:00",
    endTime: "14:30",
    status: "completed",
  },
    id: "4",
    patientName: "نورا السعد",
    doctorName: "د. خالد العتيبي",
    type: "علاج طبيعي",
    startTime: "15:30",
    endTime: "16:30",
    status: "upcoming",
  },
];

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusText = (status: Session["status"]) => {
    switch (status) {
      case "upcoming":
        return "قادمة";
      case "in-progress":
        return "جارية";
      case "completed":
        return "مكتملة";
      case "cancelled":
        return "ملغية";
      default:
        return "غير محدد";
    }
  };

  const filteredSessions =
    selectedStatus === "all"
      ? mockSessions
      : mockSessions.filter((session) => session.status === selectedStatus);

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <main className="container-app py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-brand text-3xl font-bold">إدارة الجلسات</h1>
            <p className="text-gray-600 dark:text-gray-300">
              جلسات اليوم العلاجية
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">جميع الجلسات</option>
              <option value="upcoming">قادمة</option>
              <option value="in-progress">جارية</option>
              <option value="completed">مكتملة</option>
              <option value="cancelled">ملغية</option>
            </select>
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
        </div>
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-primary">
              {mockSessions.filter((s) => s.status === "upcoming").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">جلسات قادمة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockSessions.filter((s) => s.status === "in-progress").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">جلسات جارية</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-success">
              {mockSessions.filter((s) => s.status === "completed").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">جلسات مكتملة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-gray-600">
              {mockSessions.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الجلسات
            </div>
          </div>
        </div>

        {/* Sessions Content */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="card hover:shadow-soft p-6 transition-shadow"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {session.patientName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {session.doctorName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getStatusColor(session.status)}`}
                  >
                    {getStatusText(session.status)}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      النوع:
                    </span>
                    <span className="font-medium">{session.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      الوقت:
                    </span>
                    <span className="font-medium">
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                </div>

                {session.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ملاحظات:</strong> {session.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {session.status === "upcoming" && (
                    <button className="btn-brand flex-1 rounded-lg py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                      بدء الجلسة
                    </button>
                  )}
                  {session.status === "in-progress" && (
                    <button className="flex-1 rounded-lg bg-brand-success py-2 text-sm text-white transition-colors hover:bg-green-700">
                      إنهاء الجلسة
                    </button>
                  )}
                  {session.status === "completed" && (
                    <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-700 transition-colors hover:bg-surface">
                      عرض التفاصيل
                    </button>
                  )}
                  <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-surface">
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
                <thead className="bg-surface dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      المريض
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الطبيب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      الوقت
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
                  {filteredSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-surface dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.patientName}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {session.doctorName}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {session.type}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {session.startTime} - {session.endTime}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${getStatusColor(session.status)}`}
                        >
                          {getStatusText(session.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          {session.status === "upcoming" && (
                            <button className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]">
                              بدء
                            </button>
                          )}
                          {session.status === "in-progress" && (
                            <button className="text-brand-success hover:text-green-700">
                              إنهاء
                            </button>
                          )}
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
        {filteredSessions.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد جلسات
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد جلسات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>
    </div>
  );
