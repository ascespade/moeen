import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";

("use client");

interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: "male" | "female";
  status: "active" | "inactive" | "blocked";
  insuranceProvider?: string;
  notes?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string[];
  allergies?: string[];
}

interface Session {
  id: string;
  date: string;
  doctor: string;
  type: string;
  duration: number;
  status: "completed" | "cancelled" | "upcoming";
  notes?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

const mockPatient: Patient = {
  id: "1",
  name: "أحمد العتيبي",
  phone: "0501234567",
  email: "ahmed@example.com",
  age: 35,
  gender: "male",
  status: "active",
  insuranceProvider: "التأمين التعاوني",
  notes: "مريض يعاني من آلام الظهر المزمنة",
  address: "الرياض، حي النرجس",
  emergencyContact: "0509876543 - فاطمة العتيبي",
  medicalHistory: ["جراحة في العمود الفقري 2020", "كسر في الساق 2018"],
  allergies: ["البنسلين", "الأسبرين"],
};

const mockSessions: Session[] = [
    id: "1",
    date: "2024-01-15",
    doctor: "د. سارة أحمد",
    type: "علاج طبيعي",
    duration: 60,
    status: "completed",
    notes: "جلسة علاج طبيعي للظهر - تحسن ملحوظ",
  },
    id: "2",
    date: "2024-01-10",
    doctor: "د. سارة أحمد",
    type: "علاج طبيعي",
    duration: 60,
    status: "completed",
    notes: "تمارين تقوية عضلات الظهر",
  },
    id: "3",
    date: "2024-01-20",
    doctor: "د. سارة أحمد",
    type: "علاج طبيعي",
    duration: 60,
    status: "upcoming",
  },
];

const mockDocuments: Document[] = [
    id: "1",
    name: "تقرير الأشعة السينية",
    type: "PDF",
    uploadDate: "2024-01-10",
    size: "2.3 MB",
  },
    id: "2",
    name: "تحليل الدم",
    type: "PDF",
    uploadDate: "2024-01-08",
    size: "1.1 MB",
  },
    id: "3",
    name: "صورة الأشعة المقطعية",
    type: "JPG",
    uploadDate: "2024-01-05",
    size: "5.7 MB",
  },
];

export default function PatientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<
    "info" | "sessions" | "documents" | "relatives" | "claims"
  >("info");
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-surface text-gray-800";
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

  const getSessionStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getSessionStatusText = (status: Session["status"]) => {
    switch (status) {
      case "completed":
        return "مكتملة";
      case "cancelled":
        return "ملغية";
      case "upcoming":
        return "قادمة";
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
              <Link
                href={ROUTES.HEALTH.PATIENTS}
                className="text-gray-400 hover:text-gray-600"
              >
                ← العودة
              </Link>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xl font-semibold text-white">
                {mockPatient.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockPatient.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">ملف المريض</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
              >
                تعديل البيانات
              </button>
              <button className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                حجز موعد
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Patient Summary */}
        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-[var(--brand-primary)]">
                {mockSessions.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                إجمالي الجلسات
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-brand-success">
                {mockSessions.filter((s) => s.status === "completed").length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                جلسات مكتملة
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-brand-primary">
                {mockDocuments.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">الوثائق</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-purple-600">2</div>
              <div className="text-gray-600 dark:text-gray-300">المطالبات</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {[
                { id: "info", label: "البيانات الشخصية" },
                { id: "sessions", label: "سجل الجلسات" },
                { id: "documents", label: "الوثائق" },
                { id: "relatives", label: "الأقارب" },
                { id: "claims", label: "المطالبات" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">
                    المعلومات الأساسية
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        الاسم:
                      </span>
                      <span className="font-medium">{mockPatient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        الهاتف:
                      </span>
                      <span className="font-medium">{mockPatient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        البريد الإلكتروني:
                      </span>
                      <span className="font-medium">
                        {mockPatient.email || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        العمر:
                      </span>
                      <span className="font-medium">{mockPatient.age} سنة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        الجنس:
                      </span>
                      <span className="font-medium">
                        {mockPatient.gender === "male" ? "ذكر" : "أنثى"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        الحالة:
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(mockPatient.status)}`}
                      >
                        {getStatusText(mockPatient.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold">معلومات إضافية</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="mb-1 block text-gray-600 dark:text-gray-300">
                        العنوان:
                      </span>
                      <span className="font-medium">
                        {mockPatient.address || "غير محدد"}
                      </span>
                    </div>
                    <div>
                      <span className="mb-1 block text-gray-600 dark:text-gray-300">
                        جهة الاتصال في الطوارئ:
                      </span>
                      <span className="font-medium">
                        {mockPatient.emergencyContact || "غير محدد"}
                      </span>
                    </div>
                    <div>
                      <span className="mb-1 block text-gray-600 dark:text-gray-300">
                        شركة التأمين:
                      </span>
                      <span className="font-medium">
                        {mockPatient.insuranceProvider || "بدون تأمين"}
                      </span>
                    </div>
                    <div>
                      <span className="mb-1 block text-gray-600 dark:text-gray-300">
                        ملاحظات:
                      </span>
                      <span className="font-medium">
                        {mockPatient.notes || "لا توجد ملاحظات"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-semibold">التاريخ الطبي</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium">الأمراض السابقة:</h4>
                      <ul className="space-y-1">
                        {mockPatient.medicalHistory?.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-300"
                          >
                            • {item}
                          </li>
                        )) || (
                          <li className="text-sm text-gray-500">
                            لا توجد أمراض سابقة
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">الحساسية:</h4>
                      <ul className="space-y-1">
                        {mockPatient.allergies?.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-300"
                          >
                            • {item}
                          </li>
                        )) || (
                          <li className="text-sm text-gray-500">
                            لا توجد حساسية
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === "sessions" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">سجل الجلسات</h3>
                  <button className="btn-brand rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                    إضافة جلسة
                  </button>
                </div>
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{session.doctor}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {session.type}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${getSessionStatusColor(session.status)}`}
                        >
                          {getSessionStatusText(session.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{session.date}</span>
                        <span>{session.duration} دقيقة</span>
                      </div>
                      {session.notes && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">الوثائق</h3>
                  <button className="btn-brand rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                    رفع وثيقة
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mockDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="hover:shadow-soft rounded-lg border border-gray-200 p-4 transition-shadow dark:border-gray-700"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                          <span className="font-semibold text-brand-error">
                            PDF
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{doc.name}</h4>
                          <p className="text-xs text-gray-500">
                            {doc.type} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.uploadDate}</span>
                        <div className="flex gap-2">
                          <button className="text-[var(--brand-primary)] hover:underline">
                            عرض
                          </button>
                          <button className="text-gray-500 hover:underline">
                            تحميل
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Relatives Tab */}
            {activeTab === "relatives" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">الأقارب</h3>
                  <button className="btn-brand rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                    إضافة قريب
                  </button>
                </div>
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-gray-500">لا توجد أقارب مسجلين</p>
                </div>
              </div>
            )}

            {/* Claims Tab */}
            {activeTab === "claims" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">المطالبات التأمينية</h3>
                  <button className="btn-brand rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                    إضافة مطالبة
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">مطالبة علاج طبيعي</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          رقم المطالبة: #12345
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                        موافق عليها
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>المبلغ: 1,500 ريال</span>
                      <span>2024-01-10</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">مطالبة أشعة</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          رقم المطالبة: #12346
                        </p>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                        قيد المراجعة
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>المبلغ: 800 ريال</span>
                      <span>2024-01-12</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">تعديل بيانات المريض</h3>
              <button
                onClick={() => setShowEditModal(false)}
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
                    defaultValue={mockPatient.name}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الهاتف
                  </label>
                  <input
                    type="tel"
                    defaultValue={mockPatient.phone}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    defaultValue={mockPatient.email}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    العمر
                  </label>
                  <input
                    type="number"
                    defaultValue={mockPatient.age}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الجنس
                  </label>
                  <select
                    defaultValue={mockPatient.gender}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الحالة
                  </label>
                  <select
                    defaultValue={mockPatient.status}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="blocked">محظور</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  defaultValue={mockPatient.notes}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
