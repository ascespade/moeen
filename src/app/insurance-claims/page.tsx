"use client";

import { useState } from "react";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

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
    notes: "تمت الموافقة على المطالبة بالكامل"
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
    attachments: ["طلب الأشعة", "تقرير الأشعة"]
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
    notes: "المطالبة مرفوضة - العلاج غير مشمول بالتأمين"
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
    attachments: ["تقرير طبي", "خطة العلاج"]
  }
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

  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || claim.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedClaim = showDetailsModal ? mockClaims.find(c => c.id === showDetailsModal) : null;

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
                <h1 className="text-2xl font-bold text-brand">المطالبات التأمينية</h1>
                <p className="text-gray-600 dark:text-gray-300">إدارة وتتبع المطالبات</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                إضافة مطالبة
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
              {mockClaims.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي المطالبات</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mockClaims.filter(c => c.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">قيد الانتظار</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockClaims.filter(c => c.status === "approved").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">موافق عليها</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {mockClaims.filter(c => c.status === "rejected").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مرفوضة</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو رقم المطالبة..."
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
                <option value="pending">قيد الانتظار</option>
                <option value="under-review">قيد المراجعة</option>
                <option value="approved">موافق عليها</option>
                <option value="rejected">مرفوضة</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    رقم المطالبة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المريض
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    شركة التأمين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    تاريخ الإرسال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {claim.claimNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {claim.patientName}
                      </div>
                      <div className="text-sm text-gray-500">{claim.treatmentType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {claim.insuranceProvider}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {claim.amount.toLocaleString()} ريال
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {claim.submissionDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المريض
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="">اختر المريض</option>
                    <option value="1">أحمد العتيبي</option>
                    <option value="2">فاطمة السعيد</option>
                    <option value="3">خالد القحطاني</option>
                    <option value="4">نورا السعد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شركة التأمين
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="">اختر شركة التأمين</option>
                    <option value="التأمين التعاوني">التأمين التعاوني</option>
                    <option value="الراجحي للتأمين">الراجحي للتأمين</option>
                    <option value="التحالف الوطني">التحالف الوطني</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع العلاج
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="">اختر نوع العلاج</option>
                    <option value="علاج طبيعي">علاج طبيعي</option>
                    <option value="علاج نفسي">علاج نفسي</option>
                    <option value="علاج وظيفي">علاج وظيفي</option>
                    <option value="أشعة">أشعة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المبلغ
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف العلاج
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="وصف مفصل للعلاج المطلوب..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المرفقات
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <span className="text-gray-500">اسحب الملفات هنا أو انقر للرفع</span>
                </div>
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
                  إضافة المطالبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">تفاصيل المطالبة</h3>
              <button
                onClick={() => setShowDetailsModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">معلومات المطالبة</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">رقم المطالبة:</span>
                    <span className="font-medium">{selectedClaim.claimNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">المريض:</span>
                    <span className="font-medium">{selectedClaim.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">شركة التأمين:</span>
                    <span className="font-medium">{selectedClaim.insuranceProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">نوع العلاج:</span>
                    <span className="font-medium">{selectedClaim.treatmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">المبلغ:</span>
                    <span className="font-medium">{selectedClaim.amount.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">الحالة:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedClaim.status)}`}>
                      {getStatusText(selectedClaim.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">التواريخ</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">تاريخ الإرسال:</span>
                    <span className="font-medium">{selectedClaim.submissionDate}</span>
                  </div>
                  {selectedClaim.reviewDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">تاريخ المراجعة:</span>
                      <span className="font-medium">{selectedClaim.reviewDate}</span>
                    </div>
                  )}
                  {selectedClaim.reviewer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">المراجع:</span>
                      <span className="font-medium">{selectedClaim.reviewer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-4">الوصف</h4>
              <p className="text-gray-600 dark:text-gray-300">{selectedClaim.description}</p>
            </div>

            {selectedClaim.attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-4">المرفقات</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedClaim.attachments.map((attachment, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedClaim.notes && (
              <div className="mt-6">
                <h4 className="font-semibold mb-4">ملاحظات</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedClaim.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowDetailsModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
              {selectedClaim.status === "pending" && (
                <button className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
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