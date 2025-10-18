import { useEffect, useState } from "react";

import { isWhatsAppConfigured, getApiConfig } from "@/lib/api/config";
import PlaceholderSquare from "@/components/common/PlaceholderSquare";

("use client");

type Settings = {
  provider: string;
  voice: { stt: string | null; tts: string | null };
  general?: { organizationName?: string; timezone?: string; language?: string };
  providers?: {
    googleApiKey?: string;
    openaiApiKey?: string;
    whatsappAccessToken?: string;
  };
  channels?: { whatsappWebhookUrl?: string; phoneNumberId?: string };
  security?: { dataRetentionDays?: number; piiMasking?: boolean };
  billing?: { dailyAiBudgetUsd?: number };
  notifications?: { slackWebhookUrl?: string };
  emergency?: { keywords?: string[] };
  account?: { name?: string; email?: string; locale?: string };
};

const tabs = [
  { id: "general", label: "عام" },
  { id: "ai", label: "الذكاء الاصطناعي" },
  { id: "voice", label: "الصوت" },
  { id: "providers", label: "المزودون" },
  { id: "channels", label: "القنوات" },
  { id: "security", label: "الأمان" },
  { id: "notifications", label: "الإشعارات" },
  { id: "emergency", label: "الطوارئ" },
  { id: "account", label: "حسابي" },
  { id: "billing", label: "الفوترة والاستخدام" },
  { id: "users", label: "المستخدمون والأدوار" },
];

export default function SettingsTabs() {
  const [active, setActive] = useState<string>(tabs[0]?.id || "general");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = (await res.json()) as Settings;
        if (!ignore) {
          setSettings(data);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  async function save(partial: Partial<Settings>) {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(partial),
      });
      const data = (await res.json()) as Settings;
      setSettings(data);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-xl border p-4">جاري التحميل...</div>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`h-9 px-3 rounded-md border whitespace-nowrap ${active === t.id ? "bg-gray-900 text-white" : "hover:bg-surface dark:hover:bg-white/10"}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "general" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">اسم المؤسسة</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.general?.organizationName || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  general: {
                    ...(settings?.general || {}),
                    organizationName: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">المنطقة الزمنية</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.general?.timezone || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  general: {
                    ...(settings?.general || {}),
                    timezone: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">اللغة</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.general?.language || "ar"}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  general: {
                    ...(settings?.general || {}),
                    language: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ general: settings?.general || {} })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "ai" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">مزود LLM</label>
            <select
              className="h-10 rounded-md border px-3"
              value={settings?.provider || "gemini"}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  provider: e.target.value,
                })
              }
            >
              <option value="gemini">Gemini Pro</option>
              <option value="flash">Gemini Flash 2.5</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Temperature</label>
              <input
                className="h-10 rounded-md border px-3"
                placeholder="0.7"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">حد السياق</label>
              <input
                className="h-10 rounded-md border px-3"
                placeholder="4096"
              />
            </div>
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ provider: settings?.provider || "" })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "voice" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">STT (تحويل صوت لنص)</label>
            <select
              className="h-10 rounded-md border px-3"
              value={settings?.voice?.stt || "whisper"}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  voice: {
                    stt: e.target.value,
                    tts: settings?.voice?.tts || null,
                  },
                })
              }
            >
              <option value="whisper">OpenAI Whisper</option>
              <option value="gemini-stt">Gemini Audio (إن توفر)</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm">TTS (نص لصوت)</label>
            <select
              className="h-10 rounded-md border px-3"
              value={settings?.voice?.tts || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  voice: {
                    stt: settings?.voice?.stt || null,
                    tts: e.target.value,
                  },
                })
              }
            >
              <option value="">غير مفعّل</option>
              <option value="openai-tts">OpenAI TTS</option>
              <option value="google-tts">Google TTS</option>
            </select>
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() =>
                save({ voice: settings?.voice || { stt: null, tts: null } })
              }
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "providers" && (
        <section className="rounded-xl border p-4 grid gap-4">
          {/* WhatsApp Configuration */}
          <div className="grid gap-2">
            <h3 className="text-base font-semibold">إعداد WhatsApp</h3>
            {!isWhatsAppConfigured() && (
              <PlaceholderSquare
                title="WhatsApp API غير مهيأ بعد"
                description="قم بإدخال Token و Phone Number ID ورابط Webhook لربط واتساب."
                steps={[
                  "أنشئ تطبيق واتساب بيزنس من Meta",
                  "انسخ ال Token و Phone Number ID",
                  "أدخل Webhook URL في Meta، وأضفه هنا أيضًا",
                ]}
                docsLink="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/"
              />
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm">WhatsApp Token</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.providers?.whatsappAccessToken || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  providers: {
                    ...(settings?.providers || {}),
                    whatsappAccessToken: e.target.value,
                  },
                })
              }
              placeholder="EAAG..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Phone Number ID</label>
            <input
              className="h-10 rounded-md border px-3"
              value={getApiConfig().whatsapp.phoneNumberId || ""}
              placeholder="e.g. 123456789012345"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Webhook URL</label>
            <input
              className="h-10 rounded-md border px-3"
              value={getApiConfig().whatsapp.webhookUrl || ""}
              placeholder="https://your-domain.com/api/webhooks/whatsapp"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Google AI API Key</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.providers?.googleApiKey || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  providers: {
                    ...(settings?.providers || {}),
                    googleApiKey: e.target.value,
                  },
                })
              }
              placeholder="AIza..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">OpenAI API Key</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.providers?.openaiApiKey || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  providers: {
                    ...(settings?.providers || {}),
                    openaiApiKey: e.target.value,
                  },
                })
              }
              placeholder="sk-..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">WhatsApp Access Token</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.providers?.whatsappAccessToken || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  providers: {
                    ...(settings?.providers || {}),
                    whatsappAccessToken: e.target.value,
                  },
                })
              }
              placeholder="EAAG..."
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ providers: settings?.providers || {} })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "channels" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">WhatsApp Webhook URL</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.channels?.whatsappWebhookUrl || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  channels: {
                    ...(settings?.channels || {}),
                    whatsappWebhookUrl: e.target.value,
                  },
                })
              }
              placeholder="https://.../api/webhooks/whatsapp"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Phone Number ID</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.channels?.phoneNumberId || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  channels: {
                    ...(settings?.channels || {}),
                    phoneNumberId: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ channels: settings?.channels || {} })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "security" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">أيام الاحتفاظ بالبيانات</label>
            <input
              className="h-10 rounded-md border px-3"
              type="number"
              value={settings?.security?.dataRetentionDays ?? 30}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  security: {
                    ...(settings?.security || {}),
                    dataRetentionDays: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="pii"
              type="checkbox"
              checked={!!settings?.security?.piiMasking}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  security: {
                    ...(settings?.security || {}),
                    piiMasking: e.target.checked,
                  },
                })
              }
            />
            <label htmlFor="pii" className="text-sm">
              إخفاء بيانات حساسة (PII)
            </label>
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ security: settings?.security || {} })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "notifications" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">Slack Webhook URL</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.notifications?.slackWebhookUrl || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  notifications: {
                    ...(settings?.notifications || {}),
                    slackWebhookUrl: e.target.value,
                  },
                })
              }
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() =>
                save({ notifications: settings?.notifications || {} })
              }
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "emergency" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">كلمات الطوارئ</label>
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="أدخل الكلمات مفصولة بفواصل"
              value={(settings?.emergency?.keywords || []).join(", ")}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter((k) => k);
                setSettings({
                  ...(settings as Settings),
                  emergency: { ...(settings?.emergency || {}), keywords },
                });
              }}
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() =>
                save({ emergency: settings?.emergency || { keywords: [] } })
              }
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "account" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">الاسم</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.account?.name || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  account: {
                    ...(settings?.account || {}),
                    name: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">البريد الإلكتروني</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.account?.email || ""}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  account: {
                    ...(settings?.account || {}),
                    email: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">اللغة</label>
            <input
              className="h-10 rounded-md border px-3"
              value={settings?.account?.locale || "ar"}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  account: {
                    ...(settings?.account || {}),
                    locale: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ account: settings?.account || {} })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}

      {active === "users" && (
        <section className="rounded-xl border p-4">
          إدارة المستخدمين تُنجز من صفحة &quot;المستخدمون&quot;. هذه تبويب عرض
          فقط.
        </section>
      )}

      {active === "billing" && (
        <section className="rounded-xl border p-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">الميزانية اليومية (USD)</label>
            <input
              className="h-10 rounded-md border px-3"
              type="number"
              value={settings?.billing?.dailyAiBudgetUsd ?? 20}
              onChange={(e) =>
                setSettings({
                  ...(settings as Settings),
                  billing: {
                    ...(settings?.billing || {}),
                    dailyAiBudgetUsd: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <button
              disabled={saving}
              className="h-10 rounded-md bg-gray-900 text-white px-4"
              onClick={() => save({ billing: settings?.billing || {} })}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
