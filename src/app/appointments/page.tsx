"use client";

import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import Image from "next/image";


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
    notes: "جلسة علاج طبيعي للظهر",
  },
  {
    id: "2",
    patientName: "فاطمة السعيد",
    doctorName: "د. محمد حسن",
    date: "2024-01-15",
    time: "10:30",
    duration: 45,
    type: "علاج نفسي",
    status: "scheduled",
  },
  {
    id: "3",
    patientName: "خالد القحطاني",
    doctorName: "د. نورا محمد",
    date: "2024-01-15",
    time: "14:00",
    duration: 30,
    type: "علاج وظيفي",
    status: "completed",
  },
];

const mockDoctors = [
  { id: "1", name: "د. سارة أحمد", specialty: "علاج طبيعي" },
  { id: "2", name: "د. محمد حسن", specialty: "علاج نفسي" },
  { id: "3", name: "د. نورا محمد", specialty: "علاج وظيفي" },
  { id: "4", name: "د. خالد العتيبي", specialty: "علاج طبيعي" },
];

const mockPatients = [
  { id: "1", name: "أحمد العتيبي", phone: "0501234567" },
  { id: "2", name: "فاطمة السعيد", phone: "0507654321" },
  { id: "3", name: "خالد القحطاني", phone: "0509876543" },
  { id: "4", name: "نورا السعد", phone: "0504567890" },
];

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month"
  >("week");
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
                <h1 className="text-brand text-2xl font-bold">
                  إدارة المواعيد
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  نظام التقويم المتطور
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
              >
                {showSidebar ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
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
          <aside className="border-brand w-80 border-l bg-white p-6 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold">قائمة اليوم</h3>
            <div className="space-y-3">
              {mockAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-medium">{appointment.patientName}</h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {appointment.doctorName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.time} - {appointment.type}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">إشعارات التعارض</h3>
              <div className="space-y-2">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    تعارض في المواعيد: 10:30 - 11:00
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">أقرب وقت متاح</h3>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm text-green-800">الخميس 2:00 مساءً</p>
                <p className="text-xs text-green-600">د. سارة أحمد</p>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Filters */}
          <div className="border-brand mb-6 rounded-lg border bg-white p-6 dark:bg-gray-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الطبيب
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
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
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  المريض
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
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
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الفترة
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                >
                  <option value="day">اليوم</option>
                  <option value="week">الأسبوع</option>
                  <option value="month">الشهر</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="border-brand rounded-lg border bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">التقويم</h2>
              <div className="flex gap-2">
                <button className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-white">
                  أسبوعي
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
                  شهري
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4 grid grid-cols-7 gap-1">
              {[
                "الأحد",
                "الاثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت",
              ].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300"
                >
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
                    className={`min-h-[120px] rounded-lg border border-gray-200 p-2 ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${isToday ? "ring-2 ring-[var(--brand-primary)]" : ""}`}
                  >
                    <div
                      className={`text-sm font-medium ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {isCurrentMonth ? day : ""}
                    </div>
                    {isCurrentMonth && day === 15 && (
                      <div className="mt-2 space-y-1">
                        <div className="rounded bg-blue-100 p-1 text-xs text-blue-800">
                          09:00 - أحمد العتيبي
                        </div>
                        <div className="rounded bg-green-100 p-1 text-xs text-green-800">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
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
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  المريض
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                  <option value="">اختر المريض</option>
                  {mockPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الطبيب
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
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
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الوقت
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    المدة (دقيقة)
                  </label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    النوع
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="علاج طبيعي">علاج طبيعي</option>
                    <option value="علاج نفسي">علاج نفسي</option>
                    <option value="علاج وظيفي">علاج وظيفي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الملاحظات
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
