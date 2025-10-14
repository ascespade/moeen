"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

interface InsuranceClaim {
  id: string;
  patientName: string;
  patientId: string;
  claimNumber: string;
  insuranceCompany: string;
  serviceType: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "under_review";
  submissionDate: string;
  approvalDate?: string;
  rejectionReason?: string;
  isBlocked: boolean;
  hasOutstandingBalance: boolean;
  outstandingAmount?: number;
}

const mockClaims: InsuranceClaim[] = [
  {
    id: "1",
    patientName: "أحمد محمد العتيبي",
    patientId: "P001",
    claimNumber: "IC-2024-001",
    insuranceCompany: "شركة التعاونية للتأمين",
    serviceType: "علاج طبيعي",
    amount: 1500,
    status: "approved",
    submissionDate: "2024-01-15",
    approvalDate: "2024-01-18",
    isBlocked: false,
    hasOutstandingBalance: false,
  },
  {
    id: "2",
    patientName: "فاطمة عبدالله السعيد",
    patientId: "P002",
    claimNumber: "IC-2024-002",
    insuranceCompany: "شركة الأهلي للتأمين",
    serviceType: "علاج نفسي",
    amount: 2000,
    status: "pending",
    submissionDate: "2024-01-20",
    isBlocked: false,
    hasOutstandingBalance: false,
  },
  {
    id: "3",
    patientName: "محمد سالم القحطاني",
    patientId: "P003",
    claimNumber: "IC-2024-003",
    insuranceCompany: "شركة سابك للتأمين",
    serviceType: "علاج وظيفي",
    amount: 1200,
    status: "rejected",
    submissionDate: "2024-01-18",
    rejectionReason: "عدم اكتمال الوثائق المطلوبة",
    isBlocked: true,
    hasOutstandingBalance: true,
    outstandingAmount: 1200,
  },
  {
    id: "4",
    patientName: "نورا أحمد الزهراني",
    patientId: "P004",
    claimNumber: "IC-2024-004",
    insuranceCompany: "شركة الراجحي للتأمين",
    serviceType: "علاج طبيعي",
    amount: 1800,
    status: "under_review",
    submissionDate: "2024-01-22",
    isBlocked: false,
    hasOutstandingBalance: false,
  },
];

const statusConfig = {
  pending: { label: "قيد المراجعة", color: "warning" as const },
  approved: { label: "موافق عليه", color: "success" as const },
  rejected: { label: "مرفوض", color: "error" as const },
  under_review: { label: "قيد التدقيق", color: "info" as const },
};

export default function InsurancePage() {
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(
    null,
  );
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filteredClaims = mockClaims.filter(
    (claim) => filter === "all" || claim.status === filter,
  );

  const getStatusBadge = (status: InsuranceClaim["status"]) => {
    const config = statusConfig[status];
    return (
      <Badge variant="default" className="text-sm">
        {config.label}
      </Badge>
    );
  };

  const getBlockStatus = (claim: InsuranceClaim) => {
    if (claim.isBlocked) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span className="text-sm font-medium">محظور</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        <span className="text-sm font-medium">نشط</span>
      </div>
    );
  };

  const getOutstandingBalance = (claim: InsuranceClaim) => {
    if (claim.hasOutstandingBalance) {
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          <span className="text-sm font-medium">
            رصيد مستحق: {claim.outstandingAmount?.toLocaleString()} ريال
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        <span className="text-sm font-medium">لا يوجد رصيد مستحق</span>
      </div>
    );
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
                alt="مركز الهمم"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-brand text-2xl font-bold">
                  إدارة المطالبات التأمينية
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  مركز الهمم للرعاية الصحية المتخصصة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                تصدير التقرير
              </Button>
              <Button variant="primary" size="sm">
                إضافة مطالبة جديدة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="p-6 text-center">
            <div className="text-brand mb-2 text-3xl font-bold">
              {mockClaims.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي المطالبات
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockClaims.filter((c) => c.status === "approved").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              مطالبات موافق عليها
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockClaims.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">قيد المراجعة</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-red-600">
              {mockClaims.filter((c) => c.isBlocked).length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              مطالبات محظورة
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            variant={filter === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            جميع المطالبات
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            قيد المراجعة
          </Button>
          <Button
            variant={filter === "approved" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("approved")}
          >
            موافق عليها
          </Button>
          <Button
            variant={filter === "rejected" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("rejected")}
          >
            مرفوضة
          </Button>
        </div>

        {/* Claims List */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredClaims.map((claim) => (
            <Card
              key={claim.id}
              className="cursor-pointer p-6 transition-all duration-300 hover:shadow-lg"
              onClick={() => setSelectedClaim(claim)}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {claim.patientName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    رقم المريض: {claim.patientId}
                  </p>
                </div>
                {getStatusBadge(claim.status)}
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    رقم المطالبة:
                  </span>
                  <span className="text-sm font-medium">
                    {claim.claimNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    شركة التأمين:
                  </span>
                  <span className="text-sm font-medium">
                    {claim.insuranceCompany}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    نوع الخدمة:
                  </span>
                  <span className="text-sm font-medium">
                    {claim.serviceType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    المبلغ:
                  </span>
                  <span className="text-brand text-sm font-bold">
                    {claim.amount.toLocaleString()} ريال
                  </span>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                {getBlockStatus(claim)}
                {getOutstandingBalance(claim)}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  عرض التفاصيل
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  تحديث
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredClaims.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mb-4 text-gray-400">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد مطالبات
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              لا توجد مطالبات تأمينية تطابق الفلتر المحدد
            </p>
            <Button variant="brand">إضافة مطالبة جديدة</Button>
            <Button variant="primary">
              إضافة مطالبة جديدة
            </Button>
          </Card>
        )}
      </main>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">تفاصيل المطالبة</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedClaim(null)}
                >
                  إغلاق
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      اسم المريض
                    </label>
                    <p className="font-medium">{selectedClaim.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      رقم المريض
                    </label>
                    <p className="font-medium">{selectedClaim.patientId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      رقم المطالبة
                    </label>
                    <p className="font-medium">{selectedClaim.claimNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      شركة التأمين
                    </label>
                    <p className="font-medium">
                      {selectedClaim.insuranceCompany}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      نوع الخدمة
                    </label>
                    <p className="font-medium">{selectedClaim.serviceType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      المبلغ
                    </label>
                    <p className="text-brand text-lg font-bold">
                      {selectedClaim.amount.toLocaleString()} ريال
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      تاريخ التقديم
                    </label>
                    <p className="font-medium">
                      {selectedClaim.submissionDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      الحالة
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedClaim.status)}
                    </div>
                  </div>
                </div>

                {selectedClaim.approvalDate && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      تاريخ الموافقة
                    </label>
                    <p className="font-medium">{selectedClaim.approvalDate}</p>
                  </div>
                )}

                {selectedClaim.rejectionReason && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      سبب الرفض
                    </label>
                    <p className="font-medium text-red-600">
                      {selectedClaim.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      حالة الحظر
                    </label>
                    <div className="mt-1">{getBlockStatus(selectedClaim)}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      الرصيد المستحق
                    </label>
                    <div className="mt-1">
                      {getOutstandingBalance(selectedClaim)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1">
              <div className="flex gap-3 mt-8">
                <Button variant="secondary" className="flex-1">
                  طباعة
                </Button>
                <Button variant="primary" className="flex-1">
                  تحديث الحالة
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
