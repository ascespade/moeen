"use client";

import { useState } from "react";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "أحمد العتيبي",
    doctorName: "د. سارة أحمد",
    date: "2024-01-15",
    time: "09:00",
    duration: 60,
    type: "علاج طبيعي",
    status: "scheduled",
    notes: "جلسة علاج طبيعي للظهر"
  },
  {
    id: "2",
    patientName: "فاطمة السعيد",
    doctorName: "د. محمد حسن",
    date: "2024-01-15",
    time: "10:30",
    duration: 45,
    type: "علاج نفسي",
    status: "scheduled"
  },
  {
    id: "3",
    patientName: "خالد القحطاني",
    doctorName: "د. نورا محمد",
    date: "2024-01-15",
    time: "14:00",
    duration: 30,
    type: "علاج وظيفي",
    status: "completed"
  }
];

const mockDoctors = [
  { id: "1", name: "د. سارة أحمد", specialty: "علاج طبيعي" },
  { id: "2", name: "د. محمد حسن", specialty: "علاج نفسي" },
  { id: "3", name: "د. نورا محمد", specialty: "علاج وظيفي" },
  { id: "4", name: "د. خالد العتيبي", specialty: "علاج طبيعي" }
];

const mockPatients = [
  { id: "1", name: "أحمد العتيبي", phone: "0501234567" },
  { id: "2", name: "فاطمة السعيد", phone: "0507654321" },
  { id: "3", name: "خالد القحطاني", phone: "0509876543" },
  { id: "4", name: "نورا السعد", phone: "0504567890" }
];

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("week");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "مجدول";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

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
                <h1 className="text-2xl font-bold text-brand">إدارة المواعيد</h1>
                <p className="text-gray-600 dark:text-gray-300">نظام التقويم المتطور</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showSidebar ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                إنشاء موعد
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-80 bg-white dark:bg-gray-900 border-l border-brand p-6">
            <h3 className="text-lg font-semibold mb-4">قائمة اليوم</h3>
            <div className="space-y-3">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{appointment.patientName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                  <p className="text-sm text-gray-500">{appointment.time} - {appointment.type}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">إشعارات التعارض</h3>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">تعارض في المواعيد: 10:30 - 11:00</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">أقرب وقت متاح</h3>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">الخميس 2:00 مساءً</p>
                <p className="text-xs text-green-600">د. سارة أحمد</p>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-brand p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الطبيب
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                >
                  <option value="">جميع الأطباء</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المريض
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                >
                  <option value="">جميع المرضى</option>
                  {mockPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الفترة
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                >
                  <option value="day">اليوم</option>
                  <option value="week">الأسبوع</option>
                  <option value="month">الشهر</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-brand p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">التقويم</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg">
                  أسبوعي
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  شهري
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map((day) => (
                <div key={day} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Start from previous month
                const isCurrentMonth = day > 0 && day <= 31;
                const isToday = day === 15; // Mock today
                
                return (
                  <div
                    key={i}
                    className={`min-h-[120px] p-2 border border-gray-200 rounded-lg ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${isToday ? "ring-2 ring-[var(--brand-primary)]" : ""}`}
                  >
                    <div className={`text-sm font-medium ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                      {isCurrentMonth ? day : ""}
                    </div>
                    {isCurrentMonth && day === 15 && (
                      <div className="mt-2 space-y-1">
                        <div className="p-1 bg-blue-100 text-blue-800 text-xs rounded">
                          09:00 - أحمد العتيبي
                        </div>
                        <div className="p-1 bg-green-100 text-green-800 text-xs rounded">
                          10:30 - فاطمة السعيد
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إنشاء موعد جديد</h3>
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
                  المريض
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                  <option value="">اختر المريض</option>
                  {mockPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الطبيب
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                  <option value="">اختر الطبيب</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوقت
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المدة (دقيقة)
                  </label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    النوع
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="علاج طبيعي">علاج طبيعي</option>
                    <option value="علاج نفسي">علاج نفسي</option>
                    <option value="علاج وظيفي">علاج وظيفي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الملاحظات
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
                  إنشاء الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}