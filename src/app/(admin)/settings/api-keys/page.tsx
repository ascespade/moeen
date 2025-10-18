import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import {

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

"use client";

  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Trash2,
  Plus,
  Shield,
  Globe,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";
  encrypt,
  decrypt,
  encryptApiKey,
  decryptApiKey,
} from "@/lib/encryption";

interface ApiKeyConfig {
  id: string;
  name: string;
  service: string;
  key_name: string;
  key_value: string;
  is_encrypted: boolean;
  status: "active" | "inactive" | "invalid";
  last_tested?: string;
  icon: any;
  description: string;
  placeholder: string;
  validation_url?: string;

const APIKeysSettingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Predefined API key configurations
  const defaultApiKeys: Omit<ApiKeyConfig, "key_value" | "status">[] = [
      id: "supabase_url",
      name: "Supabase URL",
      service: "supabase",
      key_name: "NEXT_PUBLIC_SUPABASE_URL",
      is_encrypted: false,
      icon: Globe,
      description: "عنوان URL لقاعدة بيانات Supabase",
      placeholder: "https://xxxxx.supabase.co",
    },
      id: "supabase_anon",
      name: "Supabase Anon Key",
      service: "supabase",
      key_name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      is_encrypted: true,
      icon: Key,
      description: "مفتاح Supabase العام (Anon Key)",
      placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
      id: "supabase_service",
      name: "Supabase Service Key",
      service: "supabase",
      key_name: "SUPABASE_SERVICE_ROLE",
      is_encrypted: true,
      icon: Shield,
      description: "مفتاح Supabase الخاص (Service Role)",
      placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
      id: "whatsapp_token",
      name: "WhatsApp Business Token",
      service: "whatsapp",
      key_name: "WHATSAPP_ACCESS_TOKEN",
      is_encrypted: true,
      icon: MessageSquare,
      description: "رمز الوصول لواتساب بزنس",
      placeholder: "EAAxxxxxxxxxxxxxx",
      validation_url: "https://graph.facebook.com/v18.0/me",
    },
      id: "whatsapp_phone",
      name: "WhatsApp Phone Number ID",
      service: "whatsapp",
      key_name: "WHATSAPP_PHONE_NUMBER_ID",
      is_encrypted: false,
      icon: Phone,
      description: "معرف رقم الهاتف في واتساب بزنس",
      placeholder: "123456789012345",
    },
      id: "google_client_id",
      name: "Google Client ID",
      service: "google",
      key_name: "GOOGLE_CLIENT_ID",
      is_encrypted: false,
      icon: Calendar,
      description: "معرف عميل Google (لتقويم جوجل)",
      placeholder: "xxxxx-xxxxx.apps.googleusercontent.com",
    },
      id: "google_client_secret",
      name: "Google Client Secret",
      service: "google",
      key_name: "GOOGLE_CLIENT_SECRET",
      is_encrypted: true,
      icon: Key,
      description: "سر العميل لـ Google",
      placeholder: "GOCSPX-xxxxxxxxxxxxx",
    },
      id: "stripe_public",
      name: "Stripe Public Key",
      service: "stripe",
      key_name: "NEXT_PUBLIC_STRIPE_PUBLIC_KEY",
      is_encrypted: false,
      icon: CreditCard,
      description: "مفتاح Stripe العام",
      placeholder: "pk_test_xxxxxxxxxxxxx",
    },
      id: "stripe_secret",
      name: "Stripe Secret Key",
      service: "stripe",
      key_name: "STRIPE_SECRET_KEY",
      is_encrypted: true,
      icon: Key,
      description: "مفتاح Stripe السري",
      placeholder: "sk_test_xxxxxxxxxxxxx",
    },
      id: "smtp_host",
      name: "SMTP Host",
      service: "email",
      key_name: "SMTP_HOST",
      is_encrypted: false,
      icon: Mail,
      description: "عنوان خادم البريد الإلكتروني",
      placeholder: "smtp.gmail.com",
    },
      id: "smtp_user",
      name: "SMTP Username",
      service: "email",
      key_name: "SMTP_USER",
      is_encrypted: false,
      icon: Mail,
      description: "اسم مستخدم SMTP",
      placeholder: "your-email@gmail.com",
    },
      id: "smtp_pass",
      name: "SMTP Password",
      service: "email",
      key_name: "SMTP_PASS",
      is_encrypted: true,
      icon: Key,
      description: "كلمة مرور SMTP",
      placeholder: "••••••••••••",
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadApiKeys();
  }, [isAuthenticated, router]);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Load from database or localStorage
      const stored = localStorage.getItem("api_keys_config");
      if (stored) {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed);
      } else {
        // Initialize with defaults
        const initialized = defaultApiKeys.map((key) => ({
          ...key,
          key_value: "",
          status: "inactive" as const,
        }));
        setApiKeys(initialized);
      }
    } catch (error) {
      console.error("Error loading API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Encrypt sensitive keys before saving
      const keysToSave = apiKeys.map((key) => {
        if (key.is_encrypted && key.key_value) {
          return {
            ...key,
            key_value: encryptApiKey(key.key_value),
          };
        return key;
      });

      // Save to localStorage (in production, save to database)
      localStorage.setItem("api_keys_config", JSON.stringify(keysToSave));

      setSuccessMessage("✅ تم حفظ المفاتيح بنجاح!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error saving API keys:", error);
      alert("فشل حفظ المفاتيح");
    } finally {
      setSaving(false);
    }
  };

  const handleTestKey = async (keyId: string) => {
    const keyConfig = apiKeys.find((k) => k.id === keyId);
    if (!keyConfig || !keyConfig.validation_url) return;

    try {
      setTestingKey(keyId);

      // Test the API key (simplified - implement actual testing)
      const response = await fetch(keyConfig.validation_url, {
        headers: {
          Authorization: `Bearer ${keyConfig.key_value}`,
        },
      });

      if (response.ok) {
        setApiKeys((prev) =>
          prev.map((k) =>
            k.id === keyId
              ? {
                  ...k,
                  status: "active",
                  last_tested: new Date().toISOString(),
              : k,
          ),
        );
      } else {
        setApiKeys((prev) =>
          prev.map((k) => (k.id === keyId ? { ...k, status: "invalid" } : k)),
        );
      }
    } catch (error) {
      setApiKeys((prev) =>
        prev.map((k) => (k.id === keyId ? { ...k, status: "invalid" } : k)),
      );
    } finally {
      setTestingKey(null);
    }
  };

  const toggleVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("✅ تم النسخ إلى الحافظة");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const updateKeyValue = (keyId: string, value: string) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, key_value: value } : k)),
    );
  };

  if (!isAuthenticated) return null;

  // Group by service
  const groupedKeys = apiKeys.reduce(
    (acc, key) => {
      if (!key) return acc;
      const service = key.service;
      if (!service) return acc;
      if (!acc[service]) {
        acc[service] = [];
      acc[service]!.push(key);
      return acc;
    },
    {} as Record<string, ApiKeyConfig[]>,
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Key className="w-8 h-8 text-brand-primary" />
              إدارة مفاتيح API
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة وتأمين مفاتيح الوصول لجميع الخدمات المتكاملة
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>

        {successMessage && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}
      </div>

      {/* Security Notice */}
      <Card className="mb-6 border-brand-warning bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">تنبيه أمني</h3>
              <p className="text-sm text-amber-800">
                جميع المفاتيح السرية يتم تشفيرها باستخدام AES-256 قبل الحفظ. لا
                تشارك هذه المفاتيح مع أي شخص ولا ترفعها إلى مستودعات الكود
                العامة.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys by Service */}
      <div className="space-y-6">
        {Object.entries(groupedKeys).map(([service, keys]) => (
          <Card key={service}>
            <CardHeader>
              <CardTitle className="text-xl capitalize">
                {service === "supabase" && "🗄️ Supabase Database"}
                {service === "whatsapp" && "💬 WhatsApp Business"}
                {service === "google" && "📅 Google Services"}
                {service === "stripe" && "💳 Stripe Payments"}
                {service === "email" && "📧 Email / SMTP"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keys.map((keyConfig) => {
                  const Icon = keyConfig.icon;
                  const isVisible = visibleKeys.has(keyConfig.id);
                  const displayValue = isVisible
                    ? keyConfig.key_value
                    : "••••••••••••••••";

                  return (
                    <div
                      key={keyConfig.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {keyConfig.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {keyConfig.description}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            keyConfig.status === "active"
                              ? "primary"
                              : keyConfig.status === "invalid"
                                ? "secondary"
                                : "secondary"
                        >
                          {keyConfig.status === "active" && "✅ نشط"}
                          {keyConfig.status === "invalid" && "❌ غير صالح"}
                          {keyConfig.status === "inactive" && "⚪ غير مفعل"}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            type={isVisible ? "text" : "password"}
                            value={keyConfig.key_value}
                            onChange={(e) =>
                              updateKeyValue(keyConfig.id, e.target.value)
                            placeholder={keyConfig.placeholder}
                            className="pr-24 font-mono text-sm"
                          />
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => toggleVisibility(keyConfig.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {isVisible ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            {keyConfig.key_value && (
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(keyConfig.key_value)
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {keyConfig.validation_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestKey(keyConfig.id)}
                            disabled={
                              !keyConfig.key_value ||
                              testingKey === keyConfig.id
                          >
                            {testingKey === keyConfig.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 ml-1" />
                                اختبار
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {keyConfig.key_name}
                        </code>
                        {keyConfig.is_encrypted && (
                          <span className="mr-2 text-green-600">🔒 مشفر</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APIKeysSettingsPage;
