"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

  Trash2,
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
  appointment_type: string;
  priority: "low" | "medium" | "high" | "urgent";
  therapy_type?: string;
  goals?: string[];
  completed_goals?: string[];
  next_appointment?: string;
  reminder_sent: boolean;
  doctors?: {
    first_name: string;
    last_name: string;
    specialty: string;
    phone?: string;
    avatar?: string;
  };
  patients?: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
    avatar?: string;
    condition?: string;
    age?: number;
  };

const AppointmentsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "timeline">(
    "list",
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadAppointments();
  }, [isAuthenticated, router]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointments?patientId=current-user");
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الموعد؟")) return;

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadAppointments(); // إعادة تحميل المواعيد
      } else {
        alert("فشل في إلغاء الموعد: " + data.error);
      }
    } catch (error) {
      alert("حدث خطأ في إلغاء الموعد");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "مجدول", variant: "primary" as const },
      confirmed: { label: "مؤكد", variant: "secondary" as const },
      completed: { label: "مكتمل", variant: "outline" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
      no_show: { label: "لم يحضر", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctors?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctors?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctors?.specialty
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const isUpcoming = new Date(appointment.appointment_date) >= new Date();
    const matchesTimeFilter = showUpcoming ? isUpcoming : !isUpcoming;

    return matchesSearch && matchesStatus && matchesTimeFilter;
  });

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) >= new Date(),
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) < new Date(),
  );

  if (!isAuthenticated) {
    return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مواعيدي</h1>
            <p className="text-gray-600 mt-2">إدارة مواعيدك الطبية</p>
          </div>
          <Button
            onClick={() => router.push("/chatbot")}
            className="bg-[var(--brand-primary)] hover:brightness-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            حجز موعد جديد
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[var(--brand-primary)]" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">
                    المواعيد القادمة
                  </p>
                  <p className="text-2xl font-bold">
                    {upcomingAppointments.length}
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
                    المواعيد المكتملة
                  </p>
                  <p className="text-2xl font-bold">
                      appointments.filter((apt) => apt.status === "completed")
                        .length
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-brand-primary" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">
                    إجمالي المواعيد
                  </p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
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
              </select>

              <Button
                variant={showUpcoming ? "primary" : "outline"}
                onClick={() => setShowUpcoming(!showUpcoming)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showUpcoming ? "القادمة" : "السابقة"}
              </Button>
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
            <p className="text-gray-600 mb-4">
              {showUpcoming ? "لا توجد مواعيد قادمة" : "لا توجد مواعيد سابقة"}
            </p>
            <Button
              onClick={() => router.push("/chatbot")}
              className="bg-[var(--brand-primary)] hover:brightness-95"
            >
              حجز موعد جديد
            </Button>
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
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Doctor"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          د. {appointment.doctors?.first_name}{" "}
                          {appointment.doctors?.last_name}
                        </h3>
                        <p className="text-gray-600">
                          {appointment.doctors?.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(
                            appointment.appointment_date,
                          ).toLocaleDateString("ar-SA")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {appointment.appointment_time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">المدة:</span>
                        <span className="text-sm font-medium">
                          {appointment.duration} دقيقة
                        </span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-surface p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>ملاحظات:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(appointment.status)}

                    {appointment.status === "scheduled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-brand-error hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        إلغاء
                      </Button>
                    )}
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

export default AppointmentsPage;
}}
