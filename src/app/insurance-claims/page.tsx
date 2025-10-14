import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
"use client";


import Image from "next/image";


interface InsuranceClaim {
  id: string;
  patientName: string;
  patientId: string;
  claimNumber: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "under-review";
  submissionDate: string;
  reviewDate?: string;
  insuranceProvider: string;
  treatmentType: string;
  description: string;
  attachments: string[];
  reviewer?: string;
  notes?: string;
}

const mockClaims: InsuranceClaim[] = [
  {
    id: "1",
    patientName: "أحمد العتيبي",
    patientId: "1",
    claimNumber: "CLM-2024-001",
    amount: 1500,
    status: "approved",
    submissionDate: "2024-01-10",
    reviewDate: "2024-01-12",
    insuranceProvider: "التأمين التعاوني",
    treatmentType: "علاج طبيعي",
    description: "جلسات علاج طبيعي للظهر - 5 جلسات",
    attachments: ["تقرير طبي", "فاتورة العلاج"],
    reviewer: "د. محمد العتيبي",
    notes: "تمت الموافقة على المطالبة بالكامل",
  },
  {
    id: "2",
    patientName: "فاطمة السعيد",
    patientId: "2",
    claimNumber: "CLM-2024-002",
    amount: 800,
    status: "under-review",
    submissionDate: "2024-01-12",
    insuranceProvider: "الراجحي للتأمين",
    treatmentType: "أشعة",
    description: "أشعة سينية للعمود الفقري",
    attachments: ["طلب الأشعة", "تقرير الأشعة"],
  },
  {
    id: "3",
    patientName: "خالد القحطاني",
    patientId: "3",
    claimNumber: "CLM-2024-003",
    amount: 2000,
    status: "rejected",
    submissionDate: "2024-01-08",
    reviewDate: "2024-01-10",
    insuranceProvider: "التحالف الوطني",
    treatmentType: "علاج نفسي",
    description: "جلسات علاج نفسي - 10 جلسات",
    attachments: ["تقرير نفسي", "خطة العلاج"],
    reviewer: "د. نورا محمد",
    notes: "المطالبة مرفوضة - العلاج غير مشمول بالتأمين",
  },
  {
    id: "4",
    patientName: "نورا السعد",
    patientId: "4",
    claimNumber: "CLM-2024-004",
    amount: 1200,
    status: "pending",
    submissionDate: "2024-01-15",
    insuranceProvider: "التأمين التعاوني",
    treatmentType: "علاج وظيفي",
    description: "جلسات علاج وظيفي - 6 جلسات",
    attachments: ["تقرير طبي", "خطة العلاج"],
  },
];

export default function InsuranceClaimsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);

  const getStatusColor = (status: InsuranceClaim["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: InsuranceClaim["status"]) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "approved":
        return "موافق عليها";
      case "rejected":
        return "مرفوضة";
      case "under-review":
        return "قيد المراجعة";
      default:
        return "غير محدد";
    }
  };

  const filteredClaims = mockClaims.filter((claim) => {
    const matchesSearch =
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || claim.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedClaim = showDetailsModal
    ? mockClaims.find((c) => c.id === showDetailsModal)
    : null;

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
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
                  المطالبات التأمينية
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  إدارة وتتبع المطالبات
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إضافة مطالبة
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
              {mockClaims.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي المطالبات
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockClaims.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">قيد الانتظار</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockClaims.filter((c) => c.status === "approved").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">موافق عليها</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-red-600">
              {mockClaims.filter((c) => c.status === "rejected").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مرفوضة</div>
          </div>
        </div>

        {/* Filters */}
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
                placeholder="ابحث بالاسم أو رقم المطالبة..."
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
                <option value="pending">قيد الانتظار</option>
                <option value="under-review">قيد المراجعة</option>
                <option value="approved">موافق عليها</option>
                <option value="rejected">مرفوضة</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    رقم المطالبة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    المريض
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    شركة التأمين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    تاريخ الإرسال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {claim.claimNumber}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {claim.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {claim.treatmentType}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {claim.insuranceProvider}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {claim.amount.toLocaleString()} ريال
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(claim.status)}`}
                      >
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {claim.submissionDate}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDetailsModal(claim.id)}
                          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
                        >
                          عرض
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          تعديل
                        </button>
                        {claim.status === "pending" && (
                          <button className="text-green-600 hover:text-green-700">
                            موافقة
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredClaims.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد مطالبات
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد مطالبات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {/* Create Claim Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إضافة مطالبة تأمينية</h3>
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
                    المريض
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="">اختر المريض</option>
                    <option value="1">أحمد العتيبي</option>
                    <option value="2">فاطمة السعيد</option>
                    <option value="3">خالد القحطاني</option>
                    <option value="4">نورا السعد</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    شركة التأمين
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="">اختر شركة التأمين</option>
                    <option value="التأمين التعاوني">التأمين التعاوني</option>
                    <option value="الراجحي للتأمين">الراجحي للتأمين</option>
                    <option value="التحالف الوطني">التحالف الوطني</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    نوع العلاج
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="">اختر نوع العلاج</option>
                    <option value="علاج طبيعي">علاج طبيعي</option>
                    <option value="علاج نفسي">علاج نفسي</option>
                    <option value="علاج وظيفي">علاج وظيفي</option>
                    <option value="أشعة">أشعة</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    المبلغ
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  وصف العلاج
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="وصف مفصل للعلاج المطلوب..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  المرفقات
                </label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                  <span className="text-gray-500">
                    اسحب الملفات هنا أو انقر للرفع
                  </span>
                </div>
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
                  إضافة المطالبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">تفاصيل المطالبة</h3>
              <button
                onClick={() => setShowDetailsModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-4 font-semibold">معلومات المطالبة</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      رقم المطالبة:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.claimNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      المريض:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.patientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      شركة التأمين:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.insuranceProvider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      نوع العلاج:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.treatmentType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      المبلغ:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.amount.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      الحالة:
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(selectedClaim.status)}`}
                    >
                      {getStatusText(selectedClaim.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">التواريخ</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      تاريخ الإرسال:
                    </span>
                    <span className="font-medium">
                      {selectedClaim.submissionDate}
                    </span>
                  </div>
                  {selectedClaim.reviewDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        تاريخ المراجعة:
                      </span>
                      <span className="font-medium">
                        {selectedClaim.reviewDate}
                      </span>
                    </div>
                  )}
                  {selectedClaim.reviewer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        المراجع:
                      </span>
                      <span className="font-medium">
                        {selectedClaim.reviewer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 font-semibold">الوصف</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedClaim.description}
              </p>
            </div>

            {selectedClaim.attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-4 font-semibold">المرفقات</h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {selectedClaim.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {attachment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedClaim.notes && (
              <div className="mt-6">
                <h4 className="mb-4 font-semibold">ملاحظات</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedClaim.notes}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowDetailsModal(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                إغلاق
              </button>
              {selectedClaim.status === "pending" && (
                <button className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  مراجعة المطالبة
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
