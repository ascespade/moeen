"use client";

import { _useT } from "@/components/providers/I18nProvider";

export default function __FAQPage() {
  const { t } = useT();
  const __faqs = [
    {
      q: t("faq.q1", "هل تدعمون RTL؟"),
      a: t("faq.a1", "نعم، دعم كامل للعربية مع تبديل تلقائي للاتجاه."),
    },
    {
      q: t("faq.q2", "هل يوجد نسخة مجانية؟"),
      a: t("faq.a2", "نعم، خطة أساسية مجانية للبدء السريع."),
    },
    {
      q: t("faq.q3", "كيف أفعّل القنوات؟"),
      a: t("faq.a3", "من صفحة القنوات داخل لوحة التحكم."),
    },
  ];
  return (
    <div className="mx-auto max-w-screen-md px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">
        {t("faq.title", "الأسئلة الشائعة")}
      </h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="rounded-lg border border-brand-border bg-[var(--panel)] p-4"
          >
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
