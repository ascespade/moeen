import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import {

import { ROUTES } from "@/constants/routes";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

"use client";

  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  UserPlus,
  MessageCircle,
  Star,
  Clock,
  Activity,
  Heart,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Target,
  FileText,
} from "lucide-react";

interface Patient {
  id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  date_of_birth: string;
  gender: "male" | "female";
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
}

interface PatientWithStats extends Patient {
  lastVisit: string;
  totalSessions: number;
  insuranceProvider?: string;
  notes?: string;
  status: "active" | "inactive" | "blocked";
  condition: string;
  severity: "mild" | "moderate" | "severe";
  therapyType: string[];
  progressPercentage: number;
  nextAppointment?: string;
  assignedTherapist?: string;
  familyMembers: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "blocked"
  >("all");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] =
    useState<PatientWithStats | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load patients from database
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get patients with their appointment statistics
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select(
            `
            *,
            appointments:appointments(count),
            sessions:sessions(count)
          `,
          )
          .order("created_at", { ascending: false });

        if (patientsError) throw patientsError;

        // Transform data to include stats
        const patientsWithStats: PatientWithStats[] = (patientsData || []).map(
          (patient) => ({
            ...patient,
            name: `${patient.first_name} ${patient.last_name}`,
            age: patient.date_of_birth
              ? new Date().getFullYear() -
                new Date(patient.date_of_birth).getFullYear()
              : 0,
            lastVisit:
              patient.appointments?.[0]?.appointment_date ||
              "لم يتم تحديد موعد",
            totalSessions: patient.sessions?.length || 0,
            status: "active" as const, // Default status, can be enhanced later
            insuranceProvider: "غير محدد", // Can be enhanced with insurance claims data
            notes: patient.medical_history || "",
          }),
        );

        setPatients(patientsWithStats);
      } catch (err) {
        setError("فشل في تحميل بيانات المرضى");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter patients based on search and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || patient.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        label: "نشط",
        variant: "primary" as const,
        color: "text-brand-success",
      },
      inactive: {
        label: "غير نشط",
        variant: "secondary" as const,
        color: "text-gray-600",
      },
      blocked: {
        label: "محظور",
        variant: "destructive" as const,
        color: "text-brand-error",
      },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "primary" as const,
      color: "text-gray-600",
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const severityMap = {
      mild: {
        label: "خفيف",
        variant: "primary" as const,
        color: "text-brand-success",
      },
      moderate: {
        label: "متوسط",
        variant: "secondary" as const,
        color: "text-yellow-600",
      },
      severe: {
        label: "شديد",
        variant: "destructive" as const,
        color: "text-brand-error",
      },
    };

    const severityInfo = severityMap[severity as keyof typeof severityMap] || {
      label: severity,
      variant: "primary" as const,
      color: "text-gray-600",
    };
    return <Badge variant={severityInfo.variant}>{severityInfo.label}</Badge>;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-brand-success";
    if (percentage >= 60) return "bg-brand-warning";
    if (percentage >= 40) return "bg-brand-primary";
    return "bg-brand-error";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المرضى...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-brand-error text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-[var(--brand-border)]">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة المرضى</h1>
              <p className="text-gray-600 mt-1">
                إجمالي المرضى: {patients.length}
              </p>
            </div>
            <Link
              href={ROUTES.HEALTH.PATIENTS + "/new"}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة مريض جديد
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container-app py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                placeholder="البحث بالاسم، الهاتف، أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="blocked">محظور</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Patient Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-primary font-semibold text-lg">
                        {patient.first_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        العمر: {(patient as any).age || "غير محدد"} سنة
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}
                  >
                    {getStatusText(patient.status)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📞</span>
                    {patient.phone}
                  </div>
                  {patient.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 h-4 mr-2">✉️</span>
                      {patient.email}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-brand-primary">
                      {patient.totalSessions}
                    </div>
                    <div className="text-xs text-gray-500">الجلسات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-brand-success">
                      {patient.lastVisit === "لم يتم تحديد موعد" ? "0" : "1"}
                    </div>
                    <div className="text-xs text-gray-500">آخر زيارة</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`${ROUTES.HEALTH.PATIENTS}/${patient.public_id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    عرض التفاصيل
                  </Link>
                  <Link
                    href={`${ROUTES.HEALTH.APPOINTMENTS}?patient=${patient.public_id}`}
                    className="flex-1 bg-brand-success text-white text-center py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    حجز موعد
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "لم يتم العثور على مرضى يطابقون معايير البحث"
                : "لم يتم إضافة أي مرضى بعد"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
