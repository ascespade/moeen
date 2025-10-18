"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "lucide-react";

}
interface FamilyMember {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  emergency_contact: boolean;
  primary_caregiver: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  patients?: {
    first_name: string;
    last_name: string;
    age: number;
    condition: string;
    avatar?: string;
  };

}
interface SupportSession {
  id: string;
  family_member_id: string;
  counselor_id: string;
  session_date: string;
  session_time: string;
  duration: number;
  session_type: string;
  status: string;
  topics_discussed: string[];
  recommendations: string[];
  follow_up_notes: string;
  created_at: string;
  updated_at: string;
  family_members?: {
    first_name: string;
    last_name: string;
    relationship: string;
    phone: string;
  };
  counselors?: {
    first_name: string;
    last_name: string;
    specialty: string;
    avatar?: string;
  };

}
interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "document" | "video" | "link" | "guide";
  url?: string;
  file_path?: string;
  tags: string[];
  created_at: string;

}

const FamilySupportPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "members" | "sessions" | "resources"
  >("members");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadFamilySupportData();
  }, [isAuthenticated, router]);

  const loadFamilySupportData = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockFamilyMembers: FamilyMember[] = [
  {
    id: "1",
          patient_id: "pat-1",
          first_name: "فاطمة",
          last_name: "محمد",
          relationship: "أم",
          phone: "0501234567",
          email: "fatima@example.com",
          address: "جدة، المملكة العربية السعودية",
          emergency_contact: true,
          primary_caregiver: true,
          notes: "متابعة يومية للطفل",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z",
          patients: {
            first_name: "أحمد",
            last_name: "محمد",
            age: 8,
            condition: "شلل دماغي",
            avatar: "/logo.png",
          },
          {
    id: "2",
          patient_id: "pat-1",
          first_name: "عبدالله",
          last_name: "محمد",
          relationship: "أب",
          phone: "0507654321",
          email: "abdullah@example.com",
          emergency_contact: false,
          primary_caregiver: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z",
          patients: {
            first_name: "أحمد",
            last_name: "محمد",
            age: 8,
            condition: "شلل دماغي",
            avatar: "/logo.png",
          },
      ];

      const mockSupportSessions: SupportSession[] = [
  {
    id: "1",
          family_member_id: "1",
          counselor_id: "coun-1",
          session_date: "2024-01-15",
          session_time: "14:00",
          duration: 60,
          session_type: "استشارة نفسية",
          status: "completed",
          topics_discussed: ["التعامل مع التوتر", "استراتيجيات الدعم"],
          recommendations: ["جلسات أسبوعية", "قراءة مواد تعليمية"],
          follow_up_notes: "تحسن ملحوظ في التعامل مع الموقف",
          created_at: "2024-01-15T14:00:00Z",
          updated_at: "2024-01-15T15:00:00Z",
          family_members: {
            first_name: "فاطمة",
            last_name: "محمد",
            relationship: "أم",
            phone: "0501234567",
          },
          counselors: {
            first_name: "د. نورا",
            last_name: "السعد",
            specialty: "الاستشارة النفسية للأسر",
            avatar: "/logo.png",
          },
      ];

      const mockResources: Resource[] = [
  {
    id: "1",
          title: "دليل دعم الأسر",
          description: "دليل شامل لدعم أسر ذوي الاحتياجات الخاصة",
          category: "التعليم",
          type: "document",
          file_path: "/resources/family-guide.pdf",
          tags: ["دعم", "أسرة", "تعليم"],
          created_at: "2024-01-01T00:00:00Z",
        },
          {
    id: "2",
          title: "فيديو: استراتيجيات التعامل مع التوتر",
          description:
            "فيديو تعليمي حول كيفية التعامل مع التوتر في رعاية الطفل",
          category: "الصحة النفسية",
          type: "video",
          url: "https://example.com/video1",
          tags: ["توتر", "صحة نفسية", "فيديو"],
          created_at: "2024-01-05T00:00:00Z",
        },
      ];

      setFamilyMembers(mockFamilyMembers);
      setSupportSessions(mockSupportSessions);
      setResources(mockResources);
    } catch (error) {
      setError("فشل في تحميل بيانات دعم الأسر");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      scheduled: { label: "مجدولة", variant: "primary" as const },
      completed: { label: "مكتملة", variant: "primary" as const },
      cancelled: { label: "ملغية", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "primary" as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-4 h-4 text-brand-primary" />;
      case "video":
        return <Video className="w-4 h-4 text-brand-error" />;
      case "link":
        return <BookOpen className="w-4 h-4 text-brand-success" />;
      case "guide":
        return <Lightbulb className="w-4 h-4 text-brand-warning" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case "أم":
      case "أب":
        return <Heart className="w-4 h-4 text-brand-error" />;
      case "أخ":
      case "أخت":
        return <Users className="w-4 h-4 text-brand-primary" />;
      case "جد":
      case "جدة":
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredFamilyMembers = familyMembers.filter(
    (member) =>
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.relationship.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredSessions = supportSessions.filter(
    (session) =>
      session.family_members?.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.family_members?.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.session_type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isAuthenticated) {
    return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">دعم الأسر</h1>
            <p className="text-gray-600 mt-2">
              دعم شامل لأسر ذوي الاحتياجات الخاصة
            </p>
          </div>
          <Button
            onClick={() => router.push("/family-support/new")}
            className="bg-[var(--brand-primary)] hover:brightness-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة عضو أسرة
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md mb-6">
          <Input
            placeholder="البحث في دعم الأسر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أعضاء الأسر</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {familyMembers.filter((m) => m.primary_caregiver).length} مقدم
              رعاية أساسي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">جلسات الدعم</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {supportSessions.filter((s) => s.status === "completed").length}{" "}
              مكتملة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الموارد التعليمية
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">مورد متاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الرضا</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-surface p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "members"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            أعضاء الأسر
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "sessions"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            جلسات الدعم
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "resources"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            الموارد التعليمية
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      ) : (
        <>
          {/* Family Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-6">
              {filteredFamilyMembers.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد أعضاء أسر
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ابدأ بإضافة عضو أسرة جديد
                    </p>
                    <Button
                      onClick={() => router.push("/family-support/new")}
                      className="bg-[var(--brand-primary)] hover:brightness-95"
                    >
                      إضافة عضو أسرة
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredFamilyMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Image
                              src="/logo.png"
                              alt="Family Member"
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-primary rounded-full border-2 border-white flex items-center justify-center">
                              {getRelationshipIcon(member.relationship)}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {member.first_name} {member.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {member.relationship} -{" "}
                              {member.patients?.first_name}{" "}
                              {member.patients?.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.primary_caregiver && (
                            <Badge variant="primary">مقدم رعاية أساسي</Badge>
                          )}
                          {member.emergency_contact && (
                            <Badge variant="destructive">جهة اتصال طارئة</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{member.phone}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{member.email}</span>
                          </div>
                        )}
                        {member.address && (
                          <div className="flex items-center gap-2 col-span-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{member.address}</span>
                          </div>
                        )}
                      </div>

                      {member.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">
                            ملاحظات:
                          </h4>
                          <p className="text-sm text-gray-700 bg-surface p-3 rounded-lg">
                            {member.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          عضو منذ{" "}
                          {new Date(member.created_at).toLocaleDateString(
                            "ar-SA",
                          )}
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
          )}

          {/* Support Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-6">
              {filteredSessions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد جلسات دعم
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ابدأ بجدولة جلسة دعم جديدة
                    </p>
                    <Button
                      onClick={() =>
                        router.push("/family-support/sessions/new")
                      className="bg-[var(--brand-primary)] hover:brightness-95"
                    >
                      جدولة جلسة دعم
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
                        <div>
                          <h3 className="text-lg font-semibold">
                            {session.session_type}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {session.family_members?.first_name}{" "}
                            {session.family_members?.last_name} -{" "}
                            {session.family_members?.relationship}
                          </p>
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
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {session.session_date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {session.session_time} ({session.duration} دقيقة)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {session.counselors?.first_name}{" "}
                            {session.counselors?.last_name}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">
                          المواضيع المناقشة:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {session.topics_discussed.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">
                          التوصيات:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {session.recommendations.map((rec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {session.follow_up_notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">
                            ملاحظات المتابعة:
                          </h4>
                          <p className="text-sm text-gray-700 bg-surface p-3 rounded-lg">
                            {session.follow_up_notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {new Date(session.created_at).toLocaleDateString(
                            "ar-SA",
                          )}
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
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              {filteredResources.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد موارد تعليمية
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ابدأ بإضافة مورد تعليمي جديد
                    </p>
                    <Button
                      onClick={() =>
                        router.push("/family-support/resources/new")
                      className="bg-[var(--brand-primary)] hover:brightness-95"
                    >
                      إضافة مورد جديد
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredResources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-surface rounded-lg">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{resource.category}</Badge>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">
                          العلامات:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {new Date(resource.created_at).toLocaleDateString(
                            "ar-SA",
                          )}
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
          )}
        </>
      )}
    </div>
  );
};

export default FamilySupportPage;
}}}}
}}}
}