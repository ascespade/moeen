"use client";

import { useState } from "react";

import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  blockedPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  totalStaff: number;
  activeStaff: number;
  onDutyStaff: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;

interface RecentActivity {
  id: string;
  type: "appointment" | "claim" | "patient" | "staff" | "payment";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";

interface StaffWorkHours {
  id: string;
  name: string;
  position: string;
  totalHours: number;
  todayHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
  isOnDuty: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;

// TODO: Replace mock with live API once endpoints ready

const mockStats: DashboardStats = {
  totalPatients: 1247,
  activePatients: 1156,
  blockedPatients: 91,
  totalAppointments: 3421,
  completedAppointments: 2987,
  pendingAppointments: 434,
  totalRevenue: 2450000,
  monthlyRevenue: 187500,
  totalClaims: 892,
  approvedClaims: 756,
  pendingClaims: 98,
  rejectedClaims: 38,
  totalStaff: 45,
  activeStaff: 42,
  onDutyStaff: 28,
  totalSessions: 15678,
  completedSessions: 14234,
  upcomingSessions: 1444,
};

const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "appointment",
    title: "موعد جديد",
    description: "تم حجز موعد جديد للمريض أحمد العتيبي مع د. سارة أحمد",
    timestamp: "منذ 5 دقائق",
    status: "success",
  },
  {
    id: "2",
    type: "claim",
    title: "مطالبة تأمين",
    description: "تمت الموافقة على مطالبة تأمين بقيمة 1,500 ريال",
    timestamp: "منذ 15 دقيقة",
    status: "success",
  },
  {
    id: "3",
    type: "patient",
    title: "مريض محظور",
    description: "تم حظر المريض محمد القحطاني بسبب عدم السداد",
    timestamp: "منذ 30 دقيقة",
    status: "error",
  },
  {
    id: "4",
    type: "staff",
    title: "تسجيل دخول",
    description: "د. نورا محمد سجلت دخولها في الساعة 8:00 صباحاً",
    timestamp: "منذ ساعة",
    status: "info",
  },
  {
    id: "5",
    type: "payment",
    title: "دفعة مستلمة",
    description: "تم استلام دفعة بقيمة 2,500 ريال من المريض فاطمة السعيد",
    timestamp: "منذ ساعتين",
    status: "success",
  },
];

const mockStaffWorkHours: StaffWorkHours[] = [
  {
    id: "1",
    name: "د. سارة أحمد",
    position: "طبيبة علاج طبيعي",
    totalHours: 168,
    todayHours: 6.5,
    thisWeekHours: 32,
    thisMonthHours: 140,
    isOnDuty: true,
    lastCheckIn: "08:00",
  },
    {
    id: "2",
    name: "د. محمد حسن",
    position: "طبيب نفسي",
    totalHours: 156,
    todayHours: 7,
    thisWeekHours: 28,
    thisMonthHours: 132,
    isOnDuty: true,
    lastCheckIn: "07:30",
  },
    {
    id: "3",
    name: "د. نورا محمد",
    position: "طبيبة علاج وظيفي",
    totalHours: 144,
    todayHours: 0,
    thisWeekHours: 24,
    thisMonthHours: 120,
    isOnDuty: false,
    lastCheckIn: "08:00",
    lastCheckOut: "16:00",
  },
    {
    id: "4",
    name: "د. خالد العتيبي",
    position: "طبيب علاج طبيعي",
    totalHours: 160,
    todayHours: 5.5,
    thisWeekHours: 30,
    thisMonthHours: 135,
    isOnDuty: true,
    lastCheckIn: "09:00",
  },
    {
    id: "5",
    name: "أ. فاطمة السعيد",
    position: "ممرضة",
    totalHours: 152,
    todayHours: 8,
    thisWeekHours: 40,
    thisMonthHours: 160,
    isOnDuty: true,
    lastCheckIn: "07:00",
  },
];

const activityTypeConfig = {
  appointment: { icon: "📅", color: "blue", bg: "bg-surface" },
  claim: { icon: "📋", color: "green", bg: "bg-surface" },
  patient: { icon: "👤", color: "red", bg: "bg-surface" },
  staff: { icon: "👨‍⚕️", color: "purple", bg: "bg-surface" },
  payment: { icon: "💰", color: "green", bg: "bg-surface" },
} as const;

const statusConfig = {
  success: { color: "text-brand-success", bg: "bg-surface" },
  warning: { color: "text-yellow-600", bg: "bg-surface" },
  error: { color: "text-brand-error", bg: "bg-surface" },
  info: { color: "text-brand-primary", bg: "bg-surface" },
};

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year"
  >("month");

  const getActivityIcon = (type: RecentActivity["type"]) => {
    const config = activityTypeConfig[type];
    return (
      <div
        className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center text-sm`}
      >
        {config.icon}
      </div>
    );
  };

  const getStatusColor = (status: RecentActivity["status"]) => {
    const config = statusConfig[status];
    return `${config.color} ${config.bg}`;
  };

  const getOnDutyStatus = (staff: StaffWorkHours) => {
    if (staff.isOnDuty) {
      return (
        <div className="flex items-center gap-2 text-brand-success">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-success"></span>
          <span className="text-sm font-medium">في الخدمة</span>
        </div>
      );
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <span className="h-2 w-2 rounded-full bg-gray-400"></span>
        <span className="text-sm font-medium">خارج الخدمة</span>
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
                src="/logo.png"
                alt="مركز الهمم"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-brand text-2xl font-bold">
                  لوحة تحكم الإدارة
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  مركز الهمم للرعاية الصحية المتخصصة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذا العام</option>
              </select>
              <Button variant="outline" size="sm">
                تصدير التقرير
              </Button>
              <Button variant="primary" size="sm">
                إعدادات
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Main Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 text-center">
            <div className="text-brand mb-2 text-3xl font-bold">
              {mockStats.totalPatients.toLocaleString()}
            </div>
            <div className="mb-2 text-gray-600 dark:text-gray-300">
              إجمالي المرضى
            </div>
            <div className="text-sm text-brand-success">
              {mockStats.activePatients} نشط • {mockStats.blockedPatients} محظور
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-success">
              {mockStats.totalAppointments.toLocaleString()}
            </div>
            <div className="mb-2 text-gray-600 dark:text-gray-300">
              إجمالي المواعيد
            </div>
            <div className="text-sm text-brand-primary">
              {mockStats.completedAppointments} مكتمل •{" "}
              {mockStats.pendingAppointments} قيد الانتظار
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockStats.totalRevenue.toLocaleString()} ريال
            </div>
            <div className="mb-2 text-gray-600 dark:text-gray-300">
              إجمالي الإيرادات
            </div>
            <div className="text-sm text-brand-success">
              {mockStats.monthlyRevenue.toLocaleString()} ريال هذا الشهر
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-primary">
              {mockStats.totalStaff}
            </div>
            <div className="mb-2 text-gray-600 dark:text-gray-300">
              إجمالي الموظفين
            </div>
            <div className="text-sm text-brand-primary">
              {mockStats.activeStaff} نشط • {mockStats.onDutyStaff} في الخدمة
              الآن
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">المطالبات التأمينية</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  إجمالي المطالبات:
                </span>
                <span className="font-semibold">{mockStats.totalClaims}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  موافق عليها:
                </span>
                <span className="font-semibold text-brand-success">
                  {mockStats.approvedClaims}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  قيد المراجعة:
                </span>
                <span className="font-semibold text-yellow-600">
                  {mockStats.pendingClaims}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  مرفوضة:
                </span>
                <span className="font-semibold text-brand-error">
                  {mockStats.rejectedClaims}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">الجلسات العلاجية</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  إجمالي الجلسات:
                </span>
                <span className="font-semibold">
                  {mockStats.totalSessions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  مكتملة:
                </span>
                <span className="font-semibold text-brand-success">
                  {mockStats.completedSessions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">قادمة:</span>
                <span className="font-semibold text-brand-primary">
                  {mockStats.upcomingSessions.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">معدلات الأداء</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  معدل إكمال المواعيد:
                </span>
                <span className="font-semibold text-brand-success">
                  {Math.round(
                    (mockStats.completedAppointments /
                      mockStats.totalAppointments) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  معدل الموافقة على المطالبات:
                </span>
                <span className="font-semibold text-brand-success">
                  {Math.round(
                    (mockStats.approvedClaims / mockStats.totalClaims) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  معدل إكمال الجلسات:
                </span>
                <span className="font-semibold text-brand-success">
                  {Math.round(
                    (mockStats.completedSessions / mockStats.totalSessions) *
                      100,
                  )}
                  %
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activities */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">النشاطات الأخيرة</h3>
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </div>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-surface dark:hover:bg-gray-800"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {activity.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Staff Work Hours */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">ساعات عمل الموظفين</h3>
              <Button variant="outline" size="sm">
                عرض التقرير الكامل
              </Button>
            </div>
            <div className="space-y-4">
              {mockStaffWorkHours.map((staff) => (
                <div key={staff.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {staff.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {staff.position}
                      </p>
                    </div>
                    {getOnDutyStatus(staff)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-brand font-semibold">
                        {staff.todayHours}س
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        اليوم
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-brand-primary">
                        {staff.thisWeekHours}س
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        هذا الأسبوع
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-brand-success">
                        {staff.thisMonthHours}س
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        هذا الشهر
                      </div>
                    </div>
                  </div>
                  {staff.isOnDuty && staff.lastCheckIn && (
                    <div className="mt-2 text-xs text-gray-500">
                      آخر تسجيل دخول: {staff.lastCheckIn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 p-6">
          <h3 className="mb-6 text-lg font-semibold">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center justify-center"
            >
              <span className="mb-2 text-2xl">👤</span>
              <span className="text-sm">إضافة مريض</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center justify-center"
            >
              <span className="mb-2 text-2xl">📅</span>
              <span className="text-sm">حجز موعد</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center justify-center"
            >
              <span className="mb-2 text-2xl">📋</span>
              <span className="text-sm">مطالبة تأمين</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center justify-center"
            >
              <span className="mb-2 text-2xl">👨‍⚕️</span>
              <span className="text-sm">إضافة موظف</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center justify-center"
            >
              <span className="mb-2 text-2xl">📊</span>
              <span className="text-sm">تقرير مالي</span>
            </Button>
            <Button
              variant="outline"
              className="flex h-20 flex-col items-center justify-center"
            >
              <span className="mb-2 text-2xl">⚙️</span>
              <span className="text-sm">الإعدادات</span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
