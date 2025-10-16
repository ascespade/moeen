"use client";

import {
  Activity,
  Calendar,
  Clock,
  User,
  Target,
  TrendingUp,
  FileText,
  Video,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Heart,
  Brain,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { _useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { _Badge } from "@/components/ui/Badge";
import { _Button } from "@/components/ui/Button";
import { _Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { _Input } from "@/components/ui/Input";
import { _useAuth } from "@/hooks/useAuth";

interface TherapySession {
  id: string;
  patient_id: string;
  therapist_id: string;
  session_date: string;
  session_time: string;
  duration: number;
  therapy_type: string;
  status: string;
  goals: string[];
  activities: string[];
  progress_notes: string;
  next_session_goals: string[];
  created_at: string;
  updated_at: string;
  public_id: string;
  patients?: {
    first_name: string;
    last_name: string;
    age: number;
    condition: string;
    avatar?: string;
  };
  therapists?: {
    first_name: string;
    last_name: string;
    specialty: string;
    avatar?: string;
  };
}

interface TherapyGoal {
  id: string;
  patient_id: string;
  goal_title: string;
  description: string;
  target_date: string;
  progress_percentage: number;
  status: "active" | "completed" | "paused";
  created_at: string;
}

const TherapyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const __router = useRouter();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [goals, setGoals] = useState<TherapyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadTherapyData();
  }, [isAuthenticated, router]);

  const __loadTherapyData = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockSessions: TherapySession[] = [
        {
          id: "1",
          patient_id: "pat-1",
          therapist_id: "ther-1",
          session_date: "2024-01-15",
          session_time: "10:00",
          duration: 60,
          therapy_type: "العلاج الطبيعي",
          status: "completed",
          goals: ["تحسين الحركة", "تقوية العضلات"],
          activities: ["تمارين الحركة", "العلاج المائي"],
          progress_notes: "تحسن ملحوظ في نطاق الحركة",
          next_session_goals: ["زيادة مدة التمارين", "تمارين التوازن"],
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T11:00:00Z",
          public_id: "TH-001",
          patients: {
            first_name: "أحمد",
            last_name: "محمد",
            age: 8,
            condition: "شلل دماغي",
            avatar: "/logo.png",
          },
          therapists: {
            first_name: "د. فاطمة",
            last_name: "العلي",
            specialty: "العلاج الطبيعي للأطفال",
            avatar: "/logo.png",
          },
        },
      ];

      const mockGoals: TherapyGoal[] = [
        {
          id: "1",
          patient_id: "pat-1",
          goal_title: "تحسين المشي",
          description: "القدرة على المشي لمسافة 10 أمتار بدون مساعدة",
          target_date: "2024-03-15",
          progress_percentage: 65,
          status: "active",
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      setSessions(mockSessions);
      setGoals(mockGoals);
    } catch (error) {
      setError("فشل في تحميل بيانات العلاج");
    } finally {
      setLoading(false);
    }
  };

  const __getStatusBadge = (_status: string) => {
    const __statusMap = {
      scheduled: { label: "مجدولة", variant: "primary" as const },
      in_progress: { label: "جارية", variant: "secondary" as const },
      completed: { label: "مكتملة", variant: "primary" as const },
      cancelled: { label: "ملغية", variant: "destructive" as const },
    };

    const __statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "primary" as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const __getTherapyTypeIcon = (_type: string) => {
    switch (type) {
      case "العلاج الطبيعي":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "العلاج الوظيفي":
        return <Target className="w-4 h-4 text-green-500" />;
      case "علاج النطق":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "العلاج النفسي":
        return <Brain className="w-4 h-4 text-purple-500" />;
      default:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  const __filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.patients?.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.patients?.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.therapy_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || session.therapy_type === filterType;
    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              جلسات العلاج والتأهيل
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة جلسات العلاج الطبيعي والتأهيل لذوي الاحتياجات الخاصة
            </p>
          </div>
          <Button
            onClick={() => router.push("/therapy/new")}
            className="bg-[var(--brand-primary)] hover:brightness-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            جلسة علاج جديدة
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في الجلسات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع أنواع العلاج</option>
              <option value="العلاج الطبيعي">العلاج الطبيعي</option>
              <option value="العلاج الوظيفي">العلاج الوظيفي</option>
              <option value="علاج النطق">علاج النطق</option>
              <option value="العلاج النفسي">العلاج النفسي</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع الحالات</option>
              <option value="scheduled">مجدولة</option>
              <option value="in_progress">جارية</option>
              <option value="completed">مكتملة</option>
              <option value="cancelled">ملغية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الجلسات
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {sessions.filter((s) => s.status === "completed").length} مكتملة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الجلسات اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                sessions.filter(
                  (s) =>
                    new Date(s.session_date).toDateString() ===
                    new Date().toDateString(),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">جلسات مجدولة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الأهداف النشطة
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter((g) => g.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">أهداف قيد التنفيذ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.length > 0
                ? Math.round(
                    goals.reduce(
                      (acc, goal) => acc + goal.progress_percentage,
                      0,
                    ) / goals.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">متوسط التقدم</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد جلسات علاج
              </h3>
              <p className="text-gray-600 mb-4">ابدأ بإنشاء جلسة علاج جديدة</p>
              <Button
                onClick={() => router.push("/therapy/new")}
                className="bg-[var(--brand-primary)] hover:brightness-95"
              >
                إنشاء جلسة جديدة
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={session.patients?.avatar || "/logo.png"}
                        alt="Patient"
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {session.patients?.first_name}{" "}
                        {session.patients?.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        العمر: {session.patients?.age} سنة |{" "}
                        {session.patients?.condition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(session.status)}
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {getTherapyTypeIcon(session.therapy_type)}
                    <span className="text-sm font-medium">
                      {session.therapy_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{session.session_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {session.session_time} ({session.duration} دقيقة)
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">أهداف الجلسة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">الأنشطة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.activities.map((activity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {session.progress_notes && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">
                      ملاحظات التقدم:
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {session.progress_notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Image
                      src={session.therapists?.avatar || "/logo.png"}
                      alt="Therapist"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      {session.therapists?.first_name}{" "}
                      {session.therapists?.last_name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TherapyPage;
