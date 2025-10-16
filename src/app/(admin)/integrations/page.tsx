"use client";

import {
  Plug,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Key,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Database,
  Cloud,
  Shield,
} from "lucide-react";
import { _useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { _Badge } from "@/components/ui/Badge";
import { _Button } from "@/components/ui/Button";
import {
  _Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { _useAuth } from "@/hooks/useAuth";

interface Integration {
  id: string;
  name: string;
  description: string;
  type: "api" | "webhook" | "oauth" | "database" | "email" | "sms" | "calendar";
  status: "active" | "inactive" | "error" | "pending";
  provider: string;
  last_sync: string;
  config: unknown;
  health_score: number;
}

const IntegrationsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const __router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadIntegrations();
  }, [isAuthenticated, router]);

  const __loadIntegrations = async () => {
    try {
      setLoading(true);
      const mockIntegrations: Integration[] = [
        {
          id: "1",
          name: "WhatsApp Business API",
          description: "تكامل مع واتساب لإرسال الرسائل والتذكيرات",
          type: "api",
          status: "active",
          provider: "Meta",
          last_sync: "2024-01-15T10:30:00Z",
          health_score: 95,
          config: { api_key: "***", phone_number: "+966501234567" },
        },
        {
          id: "2",
          name: "Slack Integration",
          description: "تكامل مع سلاك لإشعارات الفريق",
          type: "webhook",
          status: "active",
          provider: "Slack",
          last_sync: "2024-01-15T09:45:00Z",
          health_score: 88,
          config: { webhook_url: "***", channel: "#alhemam-center" },
        },
        {
          id: "3",
          name: "Google Calendar",
          description: "مزامنة المواعيد مع تقويم جوجل",
          type: "oauth",
          status: "active",
          provider: "Google",
          last_sync: "2024-01-15T08:20:00Z",
          health_score: 92,
          config: { calendar_id: "primary", sync_direction: "bidirectional" },
        },
        {
          id: "4",
          name: "SMS Gateway",
          description: "إرسال الرسائل النصية للمرضى",
          type: "sms",
          status: "error",
          provider: "Twilio",
          last_sync: "2024-01-14T15:30:00Z",
          health_score: 45,
          config: { account_sid: "***", auth_token: "***" },
        },
      ];
      setIntegrations(mockIntegrations);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const __getStatusIcon = (_status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const __getTypeIcon = (_type: string) => {
    switch (type) {
      case "api":
        return <Globe className="w-4 h-4 text-blue-500" />;
      case "webhook":
        return <Plug className="w-4 h-4 text-purple-500" />;
      case "oauth":
        return <Key className="w-4 h-4 text-green-500" />;
      case "sms":
        return <Phone className="w-4 h-4 text-orange-500" />;
      case "email":
        return <Mail className="w-4 h-4 text-red-500" />;
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
                    }
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
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {integration.health_score}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  إعدادات
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  اختبار
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
