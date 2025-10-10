"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface Approval {
  id: string;
  patientName: string;
  patientId: string;
  requestType: "treatment" | "medication" | "procedure" | "referral" | "emergency";
  requestTitle: string;
  description: string;
  requestedBy: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimatedCost?: number;
  insuranceCoverage?: number;
  patientContribution?: number;
  isBlocked: boolean;
  blockReason?: string;
  hasOutstandingBalance: boolean;
  outstandingAmount?: number;
  attachments: string[];
  notes?: string;
}

const mockApprovals: Approval[] = [
  {
    id: "1",
    patientName: "أحمد محمد العتيبي",
    patientId: "P001",
    requestType: "treatment",
    requestTitle: "موافقة على برنامج العلاج الطبيعي",
    description: "طلب موافقة على بدء برنامج علاج طبيعي مكثف لمدة 6 أسابيع لعلاج إصابة العمود الفقري",
    requestedBy: "د. سارة أحمد",
    requestedDate: "2024-01-20",
    status: "approved",
    approvedBy: "د. خالد العتيبي",
    approvedDate: "2024-01-22",
    priority: "high",
    estimatedCost: 3000,
    insuranceCoverage: 2400,
    patientContribution: 600,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ["التقرير الطبي.pdf", "الأشعة.pdf"],
    notes: "تمت الموافقة مع تعديل عدد الجلسات من 20 إلى 18 جلسة",
  },
  {
    id: "2",
    patientName: "فاطمة عبدالله السعيد",
    patientId: "P002",
    requestType: "medication",
    requestTitle: "موافقة على دواء جديد",
    description: "طلب موافقة على وصف دواء مضاد للاكتئاب جديد للمريضة",
    requestedBy: "د. محمد حسن",
    requestedDate: "2024-01-21",
    status: "pending",
    priority: "medium",
    estimatedCost: 450,
    insuranceCoverage: 360,
    patientContribution: 90,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ["التقرير النفسي.pdf"],
  },
  {
    id: "3",
    patientName: "محمد سالم القحطاني",
    patientId: "P003",
    requestType: "procedure",
    requestTitle: "موافقة على إجراء جراحي",
    description: "طلب موافقة على إجراء جراحة لعلاج الشلل النصفي",
    requestedBy: "د. نورا محمد",
    requestedDate: "2024-01-18",
    status: "rejected",
    rejectionReason: "عدم توفر التغطية التأمينية للإجراء المطلوب",
    priority: "urgent",
    estimatedCost: 15000,
    insuranceCoverage: 0,
    patientContribution: 15000,
    isBlocked: true,
    blockReason: "عدم سداد الرسوم المستحقة",
    hasOutstandingBalance: true,
    outstandingAmount: 5000,
    attachments: ["التقرير الجراحي.pdf", "الأشعة المقطعية.pdf"],
  },
  {
    id: "4",
    patientName: "نورا أحمد الزهراني",
    patientId: "P004",
    requestType: "referral",
    requestTitle: "إحالة إلى طبيب مختص",
    description: "طلب إحالة المريضة إلى طبيب عظام مختص لمراجعة حالة الركبة",
    requestedBy: "د. خالد العتيبي",
    requestedDate: "2024-01-22",
    status: "under_review",
    priority: "medium",
    estimatedCost: 800,
    insuranceCoverage: 640,
    patientContribution: 160,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ["التقرير الطبي.pdf", "أشعة الركبة.pdf"],
  },
  {
    id: "5",
    patientName: "سعد عبدالرحمن الغامدي",
    patientId: "P005",
    requestType: "emergency",
    requestTitle: "موافقة طارئة على العلاج",
    description: "طلب موافقة طارئة على بدء علاج فوري لحالة طوارئ",
    requestedBy: "د. فاطمة السعيد",
    requestedDate: "2024-01-23",
    status: "approved",
    approvedBy: "د. أحمد محمد",
    approvedDate: "2024-01-23",
    priority: "urgent",
    estimatedCost: 2000,
    insuranceCoverage: 1800,
    patientContribution: 200,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ["التقرير الطارئ.pdf"],
    notes: "تمت الموافقة الفورية بسبب طبيعة الحالة الطارئة",
  },
];

const requestTypeConfig = {
  treatment: { label: "علاج", color: "info" as const, icon: "🏥" },
  medication: { label: "دواء", color: "warning" as const, icon: "💊" },
  procedure: { label: "إجراء", color: "danger" as const, icon: "⚕️" },
  referral: { label: "إحالة", color: "success" as const, icon: "👨‍⚕️" },
  emergency: { label: "طوارئ", color: "danger" as const, icon: "🚨" },
};

const statusConfig = {
  pending: { label: "قيد المراجعة", color: "warning" as const },
  approved: { label: "موافق عليه", color: "success" as const },
  rejected: { label: "مرفوض", color: "danger" as const },
  under_review: { label: "قيد التدقيق", color: "info" as const },
};

const priorityConfig = {
  low: { label: "منخفض", color: "info" as const },
  medium: { label: "متوسط", color: "warning" as const },
  high: { label: "عالي", color: "danger" as const },
  urgent: { label: "عاجل", color: "danger" as const },
};

export default function ApprovalsPage() {
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Approval["requestType"]>("all");

  const filteredApprovals = mockApprovals.filter(approval => {
    const matchesSearch = approval.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requestTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filter === "all" || approval.status === filter;
    const matchesType = typeFilter === "all" || approval.requestType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getRequestTypeBadge = (type: Approval["requestType"]) => {
    const config = requestTypeConfig[type];
    return (
      <Badge variant={config.color} className="text-xs">
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: Approval["status"]) => {
    const config = statusConfig[status];
    return (
      <Badge variant={config.color} className="text-sm">
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Approval["priority"]) => {
    const config = priorityConfig[priority];
    return (
      <Badge variant={config.color} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getBlockStatus = (approval: Approval) => {
    if (approval.isBlocked) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="text-sm font-medium">محظور</span>
          {approval.blockReason && (
            <span className="text-xs text-gray-500">({approval.blockReason})</span>
          )}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-sm font-medium">نشط</span>
      </div>
    );
  };

  const getOutstandingBalance = (approval: Approval) => {
    if (approval.hasOutstandingBalance) {
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span className="text-sm font-medium">
            رصيد مستحق: {approval.outstandingAmount?.toLocaleString()} ريال
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-sm font-medium">لا يوجد رصيد مستحق</span>
      </div>
    );
  };

  const getCostBreakdown = (approval: Approval) => {
    if (!approval.estimatedCost) return null;
    
    return (
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">التكلفة الإجمالية:</span>
          <span className="font-medium">{approval.estimatedCost.toLocaleString()} ريال</span>
        </div>
        {approval.insuranceCoverage && (
          <div className="flex justify-between text-green-600">
            <span>التغطية التأمينية:</span>
            <span className="font-medium">-{approval.insuranceCoverage.toLocaleString()} ريال</span>
          </div>
        )}
        {approval.patientContribution && (
          <div className="flex justify-between text-brand">
            <span>مساهمة المريض:</span>
            <span className="font-bold">{approval.patientContribution.toLocaleString()} ريال</span>
          </div>
        )}
      </div>
    );
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
                alt="مركز الهمم"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة الموافقات</h1>
                <p className="text-gray-600 dark:text-gray-300">مركز الهمم للرعاية الصحية المتخصصة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                تصدير التقرير
              </Button>
              <Button variant="primary" size="sm">
                إضافة طلب موافقة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-brand mb-2">
              {mockApprovals.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الطلبات</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mockApprovals.filter(a => a.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">قيد المراجعة</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockApprovals.filter(a => a.status === "approved").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">موافق عليها</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {mockApprovals.filter(a => a.status === "rejected").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مرفوضة</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="البحث بالاسم أو رقم المريض أو عنوان الطلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filter === "all" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              جميع الطلبات
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
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={typeFilter === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTypeFilter("all")}
          >
            جميع الأنواع
          </Button>
          {Object.entries(requestTypeConfig).map(([type, config]) => (
            <Button
              key={type}
              variant={typeFilter === type ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTypeFilter(type as Approval["requestType"])}
            >
              <span className="mr-1">{config.icon}</span>
              {config.label}
            </Button>
          ))}
        </div>

        {/* Approvals List */}
        <div className="space-y-6">
          {filteredApprovals.map((approval) => (
            <Card
              key={approval.id}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedApproval(approval)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {approval.requestTitle}
                    </h3>
                    {getRequestTypeBadge(approval.requestType)}
                    {getPriorityBadge(approval.priority)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    المريض: {approval.patientName} (رقم: {approval.patientId})
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {approval.description}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(approval.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">طلب من:</span>
                  <p className="text-sm font-medium">{approval.requestedBy}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">تاريخ الطلب:</span>
                  <p className="text-sm font-medium">{approval.requestedDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">المرفقات:</span>
                  <p className="text-sm font-medium">{approval.attachments.length} ملف</p>
                </div>
              </div>

              {approval.estimatedCost && (
                <div className="mb-4">
                  {getCostBreakdown(approval)}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  {getBlockStatus(approval)}
                  {getOutstandingBalance(approval)}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    عرض التفاصيل
                  </Button>
                  {approval.status === "pending" && (
                    <Button variant="primary" size="sm">
                      مراجعة
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredApprovals.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد طلبات موافقة
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              لا توجد طلبات موافقة تطابق البحث أو الفلتر المحدد
            </p>
            <Button variant="primary">
              إضافة طلب موافقة
            </Button>
          </Card>
        )}
      </main>

      {/* Approval Details Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">تفاصيل طلب الموافقة</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedApproval(null)}
                >
                  إغلاق
                </Button>
              </div>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedApproval.requestTitle}</h3>
                    <div className="flex items-center gap-3">
                      {getRequestTypeBadge(selectedApproval.requestType)}
                      {getPriorityBadge(selectedApproval.priority)}
                      {getStatusBadge(selectedApproval.status)}
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">معلومات المريض</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">الاسم:</span>
                        <p className="font-medium">{selectedApproval.patientName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">رقم المريض:</span>
                        <p className="font-medium">{selectedApproval.patientId}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">معلومات الطلب</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">طلب من:</span>
                        <p className="font-medium">{selectedApproval.requestedBy}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">تاريخ الطلب:</span>
                        <p className="font-medium">{selectedApproval.requestedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-3">وصف الطلب</h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {selectedApproval.description}
                  </p>
                </div>

                {/* Cost Information */}
                {selectedApproval.estimatedCost && (
                  <div>
                    <h4 className="font-semibold mb-3">معلومات التكلفة</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      {getCostBreakdown(selectedApproval)}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div>
                  <h4 className="font-semibold mb-3">المرفقات</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApproval.attachments.map((attachment, index) => (
                      <Badge key={index} variant="default" className="text-sm">
                        📎 {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Approval Info */}
                {selectedApproval.status === "approved" && selectedApproval.approvedBy && (
                  <div>
                    <h4 className="font-semibold mb-3">معلومات الموافقة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">وافق عليه:</span>
                        <p className="font-medium">{selectedApproval.approvedBy}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">تاريخ الموافقة:</span>
                        <p className="font-medium">{selectedApproval.approvedDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejection Info */}
                {selectedApproval.status === "rejected" && selectedApproval.rejectionReason && (
                  <div>
                    <h4 className="font-semibold mb-3">سبب الرفض</h4>
                    <p className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      {selectedApproval.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedApproval.notes && (
                  <div>
                    <h4 className="font-semibold mb-3">ملاحظات</h4>
                    <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      {selectedApproval.notes}
                    </p>
                  </div>
                )}

                {/* Status Info */}
                <div>
                  <h4 className="font-semibold mb-3">حالة الطلب</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">حالة الحظر:</span>
                      <div className="mt-1">
                        {getBlockStatus(selectedApproval)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">الرصيد المستحق:</span>
                      <div className="mt-1">
                        {getOutstandingBalance(selectedApproval)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="secondary" className="flex-1">
                  طباعة
                </Button>
                {selectedApproval.status === "pending" && (
                  <>
                    <Button variant="secondary" className="flex-1">
                      رفض
                    </Button>
                    <Button variant="primary" className="flex-1">
                      موافقة
                    </Button>
                  </>
                )}
                <Button variant="primary" className="flex-1">
                  تحديث
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
