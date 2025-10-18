"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

} from "lucide-react";

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_weeks: number;
  max_participants: number;
  current_participants: number;
  instructor_id: string;
  start_date: string;
  end_date: string;
  status: string;
  skills_covered: string[];
  prerequisites: string[];
  created_at: string;
  updated_at: string;
  public_id: string;
  instructor?: {
    first_name: string;
    last_name: string;
    specialty: string;
    avatar?: string;
  };

interface TrainingProgress {
  id: string;
  participant_id: string;
  program_id: string;
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  last_activity: string;
  status: "active" | "completed" | "paused" | "dropped";
  created_at: string;
  participants?: {
    first_name: string;
    last_name: string;
    age: number;
    condition: string;
    avatar?: string;
  };

const TrainingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadTrainingData();
  }, [isAuthenticated, router]);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockPrograms: TrainingProgram[] = [
  {
    id: "1",
          title: "برنامج المهارات الحياتية الأساسية",
          description: "تطوير المهارات الأساسية للحياة اليومية والاستقلالية",
          category: "المهارات الحياتية",
          level: "مبتدئ",
          duration_weeks: 12,
          max_participants: 15,
          current_participants: 12,
          instructor_id: "inst-1",
          start_date: "2024-01-15",
          end_date: "2024-04-15",
          status: "active",
          skills_covered: [
            "العناية الشخصية",
            "إدارة المال",
            "الطبخ البسيط",
            "استخدام المواصلات",
          ],
          prerequisites: ["القدرة على التواصل الأساسي"],
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z",
          public_id: "TP-001",
          instructor: {
            first_name: "أ. سارة",
            last_name: "الزهراني",
            specialty: "التأهيل المهني",
            avatar: "/logo.png",
          },
          id: "2",
          title: "برنامج الحرف اليدوية والتقنية",
          description: "تعلم الحرف اليدوية والتقنيات الحديثة للعمل",
          category: "التأهيل المهني",
          level: "متوسط",
          duration_weeks: 16,
          max_participants: 10,
          current_participants: 8,
          instructor_id: "inst-2",
          start_date: "2024-02-01",
          end_date: "2024-05-30",
          status: "active",
          skills_covered: [
            "النجارة",
            "الخياطة",
            "الطباعة ثلاثية الأبعاد",
            "البرمجة البسيطة",
          ],
          prerequisites: ["إكمال برنامج المهارات الأساسية"],
          created_at: "2024-01-15T00:00:00Z",
          updated_at: "2024-02-01T00:00:00Z",
          public_id: "TP-002",
          instructor: {
            first_name: "أ. محمد",
            last_name: "العتيبي",
            specialty: "التدريب المهني",
            avatar: "/logo.png",
          },
      ];

      const mockProgress: TrainingProgress[] = [
  {
    id: "1",
          participant_id: "part-1",
          program_id: "1",
          progress_percentage: 75,
          completed_modules: 9,
          total_modules: 12,
          last_activity: "2024-01-20T10:00:00Z",
          status: "active",
          created_at: "2024-01-15T00:00:00Z",
          participants: {
            first_name: "أحمد",
            last_name: "محمد",
            age: 18,
            condition: "متلازمة داون",
            avatar: "/logo.png",
          },
      ];

      setPrograms(mockPrograms);
      setProgress(mockProgress);
    } catch (error) {
      setError("فشل في تحميل بيانات التدريب");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "نشط", variant: "primary" as const },
      completed: { label: "مكتمل", variant: "primary" as const },
      paused: { label: "متوقف", variant: "secondary" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "primary" as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const levelMap = {
      مبتدئ: { color: "bg-green-100 text-green-800" },
      متوسط: { color: "bg-yellow-100 text-yellow-800" },
      متقدم: { color: "bg-red-100 text-red-800" },
    };

    const levelInfo = levelMap[level as keyof typeof levelMap] || {
      color: "bg-surface text-gray-800",
    };
    return <Badge className={levelInfo.color}>{level}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "المهارات الحياتية":
        return <BookOpen className="w-4 h-4 text-brand-primary" />;
      case "التأهيل المهني":
        return <GraduationCap className="w-4 h-4 text-brand-success" />;
      case "التكنولوجيا":
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || program.category === filterCategory;
    const matchesLevel = filterLevel === "all" || program.level === filterLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (!isAuthenticated) {
    return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              برامج التدريب والتأهيل المهني
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة برامج التدريب والتأهيل المهني لذوي الاحتياجات الخاصة
            </p>
          </div>
          <Button
            onClick={() => router.push("/training/new")}
            className="bg-[var(--brand-primary)] hover:brightness-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            برنامج تدريبي جديد
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في البرامج التدريبية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع الفئات</option>
              <option value="المهارات الحياتية">المهارات الحياتية</option>
              <option value="التأهيل المهني">التأهيل المهني</option>
              <option value="التكنولوجيا">التكنولوجيا</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع المستويات</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي البرامج
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-muted-foreground">
              {programs.filter((p) => p.status === "active").length} نشطة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاركون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.reduce(
                (acc, program) => acc + program.current_participants,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">مشارك نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progress.length > 0
                ? Math.round(
                    progress.reduce(
                      (acc, p) => acc + p.progress_percentage,
                      0,
                    ) / progress.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">متوسط التقدم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              البرامج المكتملة
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progress.filter((p) => p.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">برنامج مكتمل</p>
          </CardContent>
        </Card>
      </div>

      {/* Programs List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد برامج تدريبية
              </h3>
              <p className="text-gray-600 mb-4">
                ابدأ بإنشاء برنامج تدريبي جديد
              </p>
              <Button
                onClick={() => router.push("/training/new")}
                className="bg-[var(--brand-primary)] hover:brightness-95"
              >
                إنشاء برنامج جديد
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPrograms.map((program) => (
            <Card
              key={program.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface rounded-lg">
                      {getCategoryIcon(program.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{program.title}</h3>
                      <p className="text-sm text-gray-600">
                        {program.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(program.status)}
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{program.category}</Badge>
                    {getLevelBadge(program.level)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {program.start_date} - {program.end_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {program.duration_weeks} أسبوع
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {program.current_participants}/{program.max_participants}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">
                    المهارات المغطاة:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {program.skills_covered.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">المتطلبات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">تقدم المشاركين</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(
                        (program.current_participants /
                          program.max_participants) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[var(--brand-primary)] h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(program.current_participants / program.max_participants) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Image
                      src={program.instructor?.avatar || "/logo.png"}
                      alt="Instructor"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      {program.instructor?.first_name}{" "}
                      {program.instructor?.last_name}
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

export default TrainingPage;
}}
}}}
