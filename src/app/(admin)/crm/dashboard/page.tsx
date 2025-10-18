"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

Calendar,
  Clock,
  Users,
  Phone,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  UserPlus,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  public_id: string;
  doctors?: {
    first_name: string;
    last_name: string;
    specialty: string;
    phone?: string;
  };
  patients?: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  };

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalPatients: number;
  totalDoctors: number;

const CRMDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadDashboardData();
  }, [isAuthenticated, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // جلب المواعيد
      const appointmentsResponse = await fetch("/api/appointments");
      const appointmentsData = await appointmentsResponse.json();

      if (appointmentsData.success) {
        setAppointments(appointmentsData.appointments || []);

      // جلب الإحصائيات
      const statsResponse = await fetch("/api/crm/stats");
      const statsData = await statsResponse.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: string,
  ) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadDashboardData(); // إعادة تحميل البيانات
      } else {
        alert("فشل في تحديث حالة الموعد: " + data.error);
      }
    } catch (error) {
      alert("حدث خطأ في تحديث حالة الموعد");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        label: "مجدول",
        variant: "primary" as const,
        color: "bg-blue-100 text-blue-800",
      },
      confirmed: {
        label: "مؤكد",
        variant: "secondary" as const,
        color: "bg-green-100 text-green-800",
      },
      completed: {
        label: "مكتمل",
        variant: "outline" as const,
        color: "bg-surface text-gray-800",
      },
      cancelled: {
        label: "ملغي",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      no_show: {
        label: "لم يحضر",
        variant: "destructive" as const,
        color: "bg-orange-100 text-orange-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
      color: "bg-surface text-gray-800",
    };

    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;

    // فلترة حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.patients?.first_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.patients?.last_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.doctors?.first_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.doctors?.last_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.public_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );

    // فلترة حسب الحالة
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter,
      );

    // فلترة حسب التاريخ
    const today = new Date().toISOString().split("T")[0];
    if (dateFilter === "today") {
      filtered = filtered.filter(
        (appointment) => appointment.appointment_date === today,
      );
    } else if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(
        (appointment) => new Date(appointment.appointment_date) >= weekAgo,
      );

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  if (!isAuthenticated) {
    return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              لوحة تحكم الطاقم الطبي
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة المواعيد والمرضى والأطباء
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/crm/patients")}
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              إدارة المرضى
            </Button>
            <Button
              onClick={() => router.push("/crm/doctors")}
              variant="outline"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              إدارة الأطباء
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[var(--brand-primary)]" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">
                    إجمالي المواعيد
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-brand-success" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">
                    مواعيد اليوم
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.todayAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-brand-primary" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">
                    في الانتظار
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.pendingAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-brand-success" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">مكتملة</p>
                  <p className="text-2xl font-bold">
                    {stats.completedAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المواعيد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الحالات</option>
                <option value="scheduled">مجدول</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
                <option value="no_show">لم يحضر</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="all">جميع التواريخ</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد مواعيد
            </h3>
            <p className="text-gray-600">
              لا توجد مواعيد تطابق المعايير المحددة
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* معلومات المريض */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">
                          معلومات المريض
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {appointment.patients?.first_name}{" "}
                              {appointment.patients?.last_name}
                            </span>
                          </div>
                          {appointment.patients?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {appointment.patients.phone}
                              </span>
                            </div>
                          )}
                          {appointment.patients?.email && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {appointment.patients.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* معلومات الطبيب والموعد */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">
                          معلومات الموعد
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              د. {appointment.doctors?.first_name}{" "}
                              {appointment.doctors?.last_name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {appointment.doctors?.specialty}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {new Date(
                                appointment.appointment_date,
                              ).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {appointment.appointment_time}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            المدة: {appointment.duration} دقيقة
                          </div>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-4 bg-surface p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>ملاحظات:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(appointment.status)}

                    <div className="flex gap-2">
                      {appointment.status === "scheduled" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(appointment.id, "confirmed")
                            className="text-brand-success hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            تأكيد
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(appointment.id, "cancelled")
                            className="text-brand-error hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            إلغاء
                          </Button>
                        </>
                      )}

                      {appointment.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "completed")
                          className="text-brand-primary hover:text-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          إكمال
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CRMDashboard;
}}}}}}}}}}
