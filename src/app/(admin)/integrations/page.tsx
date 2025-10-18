"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";

} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  type: "api" | "webhook" | "oauth" | "database" | "email" | "sms" | "calendar";
  status: "active" | "inactive" | "error" | "pending";
  provider: string;
  last_sync: string;
  config: any;
  health_score: number;

const IntegrationsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadIntegrations();
  }, [isAuthenticated, router]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);

      // Load API keys from settings
      const apiKeysRaw = localStorage.getItem("api_keys_config");
      const apiKeys = apiKeysRaw ? JSON.parse(apiKeysRaw) : [];

      // Build integrations based on configured API keys
      const integrations: Integration[] = [
  {
    id: "supabase",
          name: "Supabase Database",
          description: "قاعدة البيانات الرئيسية - PostgreSQL + Realtime",
          type: "database",
          status: apiKeys.find((k: any) => k.id === "supabase_anon")?.key_value
            ? "active"
            : "inactive",
          provider: "Supabase",
          last_sync: new Date().toISOString(),
          health_score: apiKeys.find((k: any) => k.id === "supabase_anon")
            ?.key_value
            ? 98
            : 0,
          config: {
            url:
              apiKeys.find((k: any) => k.id === "supabase_url")?.key_value ||
              "غير مُعد",
            status:
              apiKeys.find((k: any) => k.id === "supabase_anon")?.status ||
              "inactive",
          },
          id: "whatsapp",
          name: "WhatsApp Business API",
          description: "تكامل مع واتساب لإرسال الرسائل والتذكيرات التلقائية",
          type: "api",
          status: apiKeys.find((k: any) => k.id === "whatsapp_token")?.key_value
            ? "active"
            : "inactive",
          provider: "Meta",
          last_sync: new Date().toISOString(),
          health_score:
            apiKeys.find((k: any) => k.id === "whatsapp_token")?.status ===
            "active"
              ? 95
              : 0,
          config: {
            phone_number:
              apiKeys.find((k: any) => k.id === "whatsapp_phone")?.key_value ||
              "غير مُعد",
            token_status:
              apiKeys.find((k: any) => k.id === "whatsapp_token")?.status ||
              "inactive",
          },
          id: "google",
          name: "Google Calendar",
          description: "مزامنة المواعيد تلقائياً مع تقويم جوجل",
          type: "oauth",
          status: apiKeys.find((k: any) => k.id === "google_client_id")
            ?.key_value
            ? "active"
            : "inactive",
          provider: "Google",
          last_sync: new Date().toISOString(),
          health_score: apiKeys.find((k: any) => k.id === "google_client_id")
            ?.key_value
            ? 92
            : 0,
          config: {
            client_id: apiKeys.find((k: any) => k.id === "google_client_id")
              ?.key_value
              ? "مُعد"
              : "غير مُعد",
            calendar_sync: "bidirectional",
          },
          id: "stripe",
          name: "Stripe Payments",
          description: "معالجة الدفعات الإلكترونية والاشتراكات",
          type: "api",
          status: apiKeys.find((k: any) => k.id === "stripe_secret")?.key_value
            ? "active"
            : "inactive",
          provider: "Stripe",
          last_sync: new Date().toISOString(),
          health_score:
            apiKeys.find((k: any) => k.id === "stripe_secret")?.status ===
            "active"
              ? 94
              : 0,
          config: {
            public_key: apiKeys.find((k: any) => k.id === "stripe_public")
              ?.key_value
              ? "مُعد"
              : "غير مُعد",
            webhooks: "enabled",
          },
          id: "smtp",
          name: "Email / SMTP",
          description: "إرسال الإشعارات والتقارير عبر البريد الإلكتروني",
          type: "email",
          status: apiKeys.find((k: any) => k.id === "smtp_host")?.key_value
            ? "active"
            : "inactive",
          provider: "SMTP",
          last_sync: new Date().toISOString(),
          health_score: apiKeys.find((k: any) => k.id === "smtp_host")
            ?.key_value
            ? 88
            : 0,
          config: {
            host:
              apiKeys.find((k: any) => k.id === "smtp_host")?.key_value ||
              "غير مُعد",
            port: "587",
          },
      ];

      setIntegrations(integrations);
    } catch (error) {
      console.error("Error loading integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-brand-success" />;
      case "error":
        return <XCircle className="w-4 h-4 text-brand-error" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-brand-warning" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Globe className="w-4 h-4 text-brand-primary" />;
      case "webhook":
        return <Plug className="w-4 h-4 text-purple-500" />;
      case "oauth":
        return <Key className="w-4 h-4 text-brand-success" />;
      case "sms":
        return <Phone className="w-4 h-4 text-brand-primary" />;
      case "email":
        return <Mail className="w-4 h-4 text-brand-error" />;
      case "calendar":
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">التكاملات الخارجية</h1>
        <p className="text-gray-600 mt-2">
          إدارة التكاملات مع الخدمات الخارجية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(integration.type)}
                  <div>
                    <CardTitle className="text-lg">
                      {integration.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {integration.provider}
                    </p>
                  </div>
                </div>
                {getStatusIcon(integration.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">
                {integration.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>الحالة:</span>
                  <Badge
                    variant={
                      integration.status === "active" ? "primary" : "secondary"
                  >
                    {integration.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>آخر مزامنة:</span>
                  <span>
                    {new Date(integration.last_sync).toLocaleDateString(
                      "ar-SA",
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>صحة الاتصال:</span>
                  <span
                    className={
                      integration.health_score > 80
                        ? "text-brand-success"
                        : "text-brand-error"
                  >
                    {integration.health_score}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push("/settings/api-keys")}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  إعدادات
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => loadIntegrations()}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  تحديث
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
