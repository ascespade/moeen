import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

"use client";

  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Activity,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Globe,
  Key,
  Fingerprint,
  Database,
  FileText,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "failed_login"
    | "password_change"
    | "permission_change"
    | "data_access"
    | "system_change";
  user_id: string;
  user_name: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  device_type: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  details: string;
  risk_level: "low" | "medium" | "high" | "critical";

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category:
    | "authentication"
    | "authorization"
    | "data_protection"
    | "network"
    | "system";
  is_active: boolean;
  rules: string[];
  last_updated: string;
  updated_by: string;

interface UserSession {
  id: string;
  user_id: string;
  user_name: string;
  ip_address: string;
  location: string;
  device: string;
  browser: string;
  login_time: string;
  last_activity: string;
  is_active: boolean;

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  type:
    | "suspicious_activity"
    | "failed_attempts"
    | "data_breach"
    | "system_vulnerability";
  status: "new" | "investigating" | "resolved" | "false_positive";
  created_at: string;
  resolved_at?: string;
  assigned_to?: string;

const SecurityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    "events" | "policies" | "sessions" | "alerts"
  >("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadSecurityData();
  }, [isAuthenticated, router]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockEvents: SecurityEvent[] = [
          id: "1",
          type: "login",
          user_id: "user-1",
          user_name: "د. فاطمة العلي",
          ip_address: "192.168.1.100",
          user_agent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          location: "جدة، المملكة العربية السعودية",
          device_type: "desktop",
          browser: "Chrome",
          os: "Windows 10",
          timestamp: "2024-01-15T10:30:00Z",
          status: "success",
          details: "تسجيل دخول ناجح",
          risk_level: "low",
        },
          id: "2",
          type: "failed_login",
          user_id: "unknown",
          user_name: "مجهول",
          ip_address: "203.45.67.89",
          user_agent: "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
          location: "الرياض، المملكة العربية السعودية",
          device_type: "mobile",
          browser: "Chrome Mobile",
          os: "Android 10",
          timestamp: "2024-01-15T09:45:00Z",
          status: "failed",
          details: "محاولة تسجيل دخول فاشلة - كلمة مرور خاطئة",
          risk_level: "high",
        },
          id: "3",
          type: "data_access",
          user_id: "user-2",
          user_name: "أ. محمد السعد",
          ip_address: "192.168.1.105",
          user_agent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          location: "جدة، المملكة العربية السعودية",
          device_type: "desktop",
          browser: "Safari",
          os: "macOS",
          timestamp: "2024-01-15T08:20:00Z",
          status: "success",
          details: "وصول إلى بيانات المرضى",
          risk_level: "medium",
        },
      ];

      const mockPolicies: SecurityPolicy[] = [
          id: "1",
          name: "سياسة كلمات المرور",
          description: "متطلبات كلمات المرور القوية",
          category: "authentication",
          is_active: true,
          rules: [
            "الحد الأدنى 8 أحرف",
            "يجب أن تحتوي على أحرف كبيرة وصغيرة",
            "يجب أن تحتوي على أرقام ورموز خاصة",
            "تغيير كلمة المرور كل 90 يوم",
          ],
          last_updated: "2024-01-01T00:00:00Z",
          updated_by: "مدير النظام",
        },
          id: "2",
          name: "سياسة الوصول إلى البيانات",
          description: "قواعد الوصول إلى البيانات الطبية",
          category: "data_protection",
          is_active: true,
          rules: [
            "الوصول فقط للمستخدمين المصرح لهم",
            "تسجيل جميع عمليات الوصول",
            "عدم مشاركة البيانات مع أطراف ثالثة",
            "تشفير البيانات الحساسة",
          ],
          last_updated: "2024-01-01T00:00:00Z",
          updated_by: "مدير النظام",
        },
      ];

      const mockSessions: UserSession[] = [
          id: "1",
          user_id: "user-1",
          user_name: "د. فاطمة العلي",
          ip_address: "192.168.1.100",
          location: "جدة، المملكة العربية السعودية",
          device: "Windows 10 - Chrome",
          browser: "Chrome",
          login_time: "2024-01-15T08:00:00Z",
          last_activity: "2024-01-15T10:30:00Z",
          is_active: true,
        },
          id: "2",
          user_id: "user-2",
          user_name: "أ. محمد السعد",
          ip_address: "192.168.1.105",
          location: "جدة، المملكة العربية السعودية",
          device: "macOS - Safari",
          browser: "Safari",
          login_time: "2024-01-15T09:15:00Z",
          last_activity: "2024-01-15T10:25:00Z",
          is_active: true,
        },
      ];

      const mockAlerts: SecurityAlert[] = [
          id: "1",
          title: "محاولات تسجيل دخول مشبوهة",
          description: "تم رصد 5 محاولات تسجيل دخول فاشلة من نفس العنوان IP",
          severity: "high",
          type: "failed_attempts",
          status: "new",
          created_at: "2024-01-15T09:45:00Z",
          assigned_to: "فريق الأمان",
        },
          id: "2",
          title: "وصول غير عادي للبيانات",
          description: "تم الوصول إلى ملفات حساسة في وقت غير عادي",
          severity: "medium",
          type: "suspicious_activity",
          status: "investigating",
          created_at: "2024-01-15T08:30:00Z",
          assigned_to: "مدير النظام",
        },
      ];

      setSecurityEvents(mockEvents);
      setPolicies(mockPolicies);
      setSessions(mockSessions);
      setAlerts(mockAlerts);
    } catch (error) {
      setError("فشل في تحميل بيانات الأمان");
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircle className="w-4 h-4 text-brand-success" />;
      case "logout":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "failed_login":
        return <AlertTriangle className="w-4 h-4 text-brand-error" />;
      case "password_change":
        return <Key className="w-4 h-4 text-brand-primary" />;
      case "data_access":
        return <Database className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskBadge = (level: string) => {
    const riskMap = {
      low: {
        label: "منخفض",
        variant: "primary" as const,
        color: "text-brand-success",
      },
      medium: {
        label: "متوسط",
        variant: "secondary" as const,
        color: "text-yellow-600",
      },
      high: {
        label: "عالي",
        variant: "primary" as const,
        color: "text-brand-primary",
      },
      critical: {
        label: "حرج",
        variant: "destructive" as const,
        color: "text-brand-error",
      },
    };

    const riskInfo = riskMap[level as keyof typeof riskMap] || {
      label: level,
      variant: "primary" as const,
      color: "text-gray-600",
    };
    return <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const severityMap = {
      low: { label: "منخفض", variant: "primary" as const },
      medium: { label: "متوسط", variant: "secondary" as const },
      high: { label: "عالي", variant: "primary" as const },
      critical: { label: "حرج", variant: "destructive" as const },
    };

    const severityInfo = severityMap[severity as keyof typeof severityMap] || {
      label: severity,
      variant: "primary" as const,
    };
    return <Badge variant={severityInfo.variant}>{severityInfo.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      success: { label: "نجح", variant: "primary" as const },
      failed: { label: "فشل", variant: "destructive" as const },
      blocked: { label: "محظور", variant: "destructive" as const },
      new: { label: "جديد", variant: "primary" as const },
      investigating: { label: "قيد التحقيق", variant: "secondary" as const },
      resolved: { label: "محلول", variant: "primary" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "primary" as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getDeviceIcon = (device: string) => {
    if (
      device.includes("Windows") ||
      device.includes("macOS") ||
      device.includes("Linux")
    ) {
      return <Monitor className="w-4 h-4 text-brand-primary" />;
    } else if (device.includes("Android") || device.includes("iOS")) {
      return <Smartphone className="w-4 h-4 text-brand-success" />;
    } else {
      return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch =
      event.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip_address.includes(searchTerm);

    const matchesType = filterType === "all" || event.type === filterType;
    const matchesSeverity =
      filterSeverity === "all" || event.risk_level === filterSeverity;

    return matchesSearch && matchesType && matchesSeverity;
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
              مركز الأمان والحماية
            </h1>
            <p className="text-gray-600 mt-2">مراقبة الأمان وحماية البيانات</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadSecurityData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              تصدير تقرير
            </Button>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الأحداث الأمنية
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                  securityEvents.filter(
                    (e) =>
                      e.risk_level === "high" || e.risk_level === "critical",
                  ).length
                }{" "}
                عالية المخاطر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات النشطة
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions.filter((s) => s.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">جلسة نشطة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التنبيهات</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                  alerts.filter(
                    (a) => a.status === "new" || a.status === "investigating",
                  ).length
              </div>
              <p className="text-xs text-muted-foreground">تنبيه نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">السياسات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {policies.filter((p) => p.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">سياسة نشطة</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-surface p-1 rounded-lg mb-6">
          <button
            onClick={() => setSelectedTab("events")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === "events"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            الأحداث الأمنية
          </button>
          <button
            onClick={() => setSelectedTab("sessions")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === "sessions"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            الجلسات النشطة
          </button>
          <button
            onClick={() => setSelectedTab("alerts")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === "alerts"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            التنبيهات
          </button>
          <button
            onClick={() => setSelectedTab("policies")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === "policies"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            السياسات
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في الأحداث الأمنية..."
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
              <option value="all">جميع الأنواع</option>
              <option value="login">تسجيل دخول</option>
              <option value="logout">تسجيل خروج</option>
              <option value="failed_login">تسجيل دخول فاشل</option>
              <option value="data_access">وصول للبيانات</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">جميع المستويات</option>
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">عالي</option>
              <option value="critical">حرج</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      ) : (
        <>
          {/* Security Events Tab */}
          {selectedTab === "events" && (
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد أحداث أمنية
                    </h3>
                    <p className="text-gray-600">
                      ستظهر الأحداث الأمنية هنا عند حدوثها
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white rounded-full">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">
                                {event.user_name}
                              </h3>
                              {getRiskBadge(event.risk_level)}
                              {getStatusBadge(event.status)}
                            </div>
                            <p className="text-gray-700 mb-3">
                              {event.details}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <span>{event.ip_address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getDeviceIcon(event.device_type)}
                                <span>
                                  {event.device_type} - {event.browser}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString(
                              "ar-SA",
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(event.timestamp).toLocaleTimeString(
                              "ar-SA",
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Active Sessions Tab */}
          {selectedTab === "sessions" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد جلسات نشطة
                    </h3>
                    <p className="text-gray-600">ستظهر الجلسات النشطة هنا</p>
                  </CardContent>
                </Card>
              ) : (
                sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white rounded-full">
                            {getDeviceIcon(session.device)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                              {session.user_name}
                            </h3>
                            <p className="text-gray-700 mb-3">
                              {session.device}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <span>{session.ip_address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{session.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  تسجيل الدخول:{" "}
                                  {new Date(session.login_time).toLocaleString(
                                    "ar-SA",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                <span>
                                  آخر نشاط:{" "}
                                  {new Date(
                                    session.last_activity,
                                  ).toLocaleString("ar-SA")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              session.is_active ? "primary" : "secondary"
                          >
                            {session.is_active ? "نشط" : "غير نشط"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Security Alerts Tab */}
          {selectedTab === "alerts" && (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد تنبيهات أمنية
                    </h3>
                    <p className="text-gray-600">ستظهر التنبيهات الأمنية هنا</p>
                  </CardContent>
                </Card>
              ) : (
                alerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white rounded-full">
                            <AlertTriangle className="w-4 h-4 text-brand-error" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">
                                {alert.title}
                              </h3>
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                            <p className="text-gray-700 mb-3">
                              {alert.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>النوع: {alert.type}</span>
                              <span>
                                المسؤول: {alert.assigned_to || "غير محدد"}
                              </span>
                              <span>
                                التاريخ:{" "}
                                {new Date(alert.created_at).toLocaleDateString(
                                  "ar-SA",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Security Policies Tab */}
          {selectedTab === "policies" && (
            <div className="space-y-4">
              {policies.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد سياسات أمنية
                    </h3>
                    <p className="text-gray-600">ستظهر السياسات الأمنية هنا</p>
                  </CardContent>
                </Card>
              ) : (
                policies.map((policy) => (
                  <Card
                    key={policy.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {policy.name}
                            </h3>
                            <Badge
                              variant={
                                policy.is_active ? "primary" : "secondary"
                            >
                              {policy.is_active ? "نشط" : "غير نشط"}
                            </Badge>
                            <Badge variant="outline">{policy.category}</Badge>
                          </div>
                          <p className="text-gray-700 mb-4">
                            {policy.description}
                          </p>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">القواعد:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {policy.rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-4 text-xs text-gray-500">
                            آخر تحديث:{" "}
                            {new Date(policy.last_updated).toLocaleDateString(
                              "ar-SA",
                            )}{" "}
                            بواسطة {policy.updated_by}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
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

export default SecurityPage;
