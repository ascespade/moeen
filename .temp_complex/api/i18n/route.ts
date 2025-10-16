import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseClient";

// GET /api/i18n?locale=ar&ns=common
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "ar";
  const ns = searchParams.get("ns") || "common";

  try {
    // محاولة قراءة من قاعدة البيانات
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("translations")
      .select("key, value")
      .eq("locale", locale)
      .eq("namespace", ns);

    if (error) {
      console.error("Database error:", error);
      // العودة للرسائل الافتراضية في حالة الخطأ
      return getFallbackMessages(locale, ns);
    }

    if (data && data.length > 0) {
      const messages: Record<string, string> = {};
      for (const row of data) {
        messages[row.key] = row.value;
      }
      return NextResponse.json({ locale, ns, messages, source: "database" });
    }

    // إذا لم توجد ترجمات في قاعدة البيانات، استخدم الرسائل الافتراضية
    return getFallbackMessages(locale, ns);
  } catch (error) {
    console.error("Translation API error:", error);
    // في حالة الخطأ، استخدم الرسائل الافتراضية
    return getFallbackMessages(locale, ns);
  }
}

function getFallbackMessages(locale: string, ns: string) {
  const fallbackMessages: Record<string, string> = {
    "home.hero.title":
      locale === "en"
        ? "Multi-Channel Chat Platform"
        : "منصة دردشة متعددة القنوات",
    "home.hero.subtitle":
      locale === "en"
        ? "Powered by Artificial Intelligence"
        : "مدعومة بالذكاء الاصطناعي",
    "home.hero.ctaPrimary":
      locale === "en" ? "Try Now for Free" : "جرب الآن مجانًا",
    "home.hero.ctaSecondary":
      locale === "en" ? "Discover Features" : "اكتشف المميزات",
    "home.features.unifiedChat":
      locale === "en" ? "Unified Chat" : "دردشة موحدة",
    "home.features.unifiedChat.desc":
      locale === "en"
        ? "All your conversations in one interface with smart search and filters."
        : "كل محادثاتك في واجهة واحدة مع بحث وفلاتر ذكية.",
    "home.features.customers":
      locale === "en" ? "Customer Management" : "إدارة العملاء",
    "home.features.customers.desc":
      locale === "en"
        ? "Rich profiles and complete interaction history."
        : "ملفات تعريف غنية وسجل كامل للتفاعل.",
    "home.features.reports": locale === "en" ? "Smart Reports" : "تقارير ذكية",
    "home.features.reports.desc":
      locale === "en"
        ? "Real-time dashboards and performance indicators."
        : "لوحات تحكم ومؤشرات أداء لحظية.",
    "home.cta.title": locale === "en" ? "Start Today" : "ابدأ اليوم",
    "home.cta.button": locale === "en" ? "Create Account" : "إنشاء حساب",
  };

  return NextResponse.json({
    locale,
    ns,
    messages: fallbackMessages,
    source: "fallback",
  });
}
