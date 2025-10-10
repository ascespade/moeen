"use client";

import { useState } from "react";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

interface Session {
  id: string;
  patientName: string;
  doctorName: string;
  type: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

const mockSessions: Session[] = [
  {
    id: "1",
    patientName: "أحمد العتيبي",
    doctorName: "د. سارة أحمد",
    type: "علاج طبيعي",
    startTime: "09:00",
    endTime: "10:00",
    status: "in-progress",
    notes: "جلسة علاج طبيعي للظهر"
  },
  {
    id: "2",
    patientName: "فاطمة السعيد",
    doctorName: "د. محمد حسن",
    type: "علاج نفسي",
    startTime: "10:30",
    endTime: "11:15",
    status: "upcoming"
  },
  {
    id: "3",
    patientName: "خالد القحطاني",
    doctorName: "د. نورا محمد",
    type: "علاج وظيفي",
    startTime: "14:00",
    endTime: "14:30",
    status: "completed"
  },
  {
    id: "4",
    patientName: "نورا السعد",
    doctorName: "د. خالد العتيبي",
    type: "علاج طبيعي",
    startTime: "15:30",
    endTime: "16:30",
    status: "upcoming"
  }
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
        return "bg-gray-100 text-gray-800";
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

  const filteredSessions = selectedStatus === "all" 
    ? mockSessions 
    : mockSessions.filter(session => session.status === selectedStatus);

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
                <h1 className="text-2xl font-bold text-brand">إدارة الجلسات</h1>
                <p className="text-gray-600 dark:text-gray-300">جلسات اليوم العلاجية</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">جميع الجلسات</option>
                <option value="upcoming">قادمة</option>
                <option value="in-progress">جارية</option>
                <option value="completed">مكتملة</option>
                <option value="cancelled">ملغية</option>
              </select>
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
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockSessions.filter(s => s.status === "upcoming").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">جلسات قادمة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mockSessions.filter(s => s.status === "in-progress").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">جلسات جارية</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockSessions.filter(s => s.status === "completed").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">جلسات مكتملة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {mockSessions.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الجلسات</div>
          </div>
        </div>

        {/* Sessions Content */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div key={session.id} className="card p-6 hover:shadow-soft transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {session.patientName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{session.doctorName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(session.status)}`}>
                    {getStatusText(session.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">النوع:</span>
                    <span className="font-medium">{session.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">الوقت:</span>
                    <span className="font-medium">{session.startTime} - {session.endTime}</span>
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
                    <button className="flex-1 btn-brand py-2 rounded-lg text-white text-sm hover:bg-[var(--brand-primary-hover)] transition-colors">
                      بدء الجلسة
                    </button>
                  )}
                  {session.status === "in-progress" && (
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                      إنهاء الجلسة
                    </button>
                  )}
                  {session.status === "completed" && (
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      عرض التفاصيل
                    </button>
                  )}
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
                      الطبيب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الوقت
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
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.patientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {session.doctorName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {session.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {session.startTime} - {session.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                          {getStatusText(session.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {session.status === "upcoming" && (
                            <button className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]">
                              بدء
                            </button>
                          )}
                          {session.status === "in-progress" && (
                            <button className="text-green-600 hover:text-green-700">
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
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
}