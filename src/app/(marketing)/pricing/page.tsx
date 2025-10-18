
"use client";

import { useT } from "@/components/providers/I18nProvider";


export default function PricingPage() {
  const { t } = useT();
  const tiers = [
    {
      name: t("pricing.basic", "أساسي"),
      price: t("pricing.free", "مجاني"),
      features: [
        t("pricing.f1", "قناة واحدة"),
        t("pricing.f2", "محادثات محدودة"),
      ],
    },
    {
      name: t("pricing.pro", "محترف"),
      price: "$29",
      features: [t("pricing.f3", "3 قنوات"), t("pricing.f4", "تقارير أساسية")],
    },
    {
      name: t("pricing.enterprise", "مؤسسات"),
      price: t("pricing.custom", "مخصص"),
      features: [
        t("pricing.f5", "قنوات غير محدودة"),
        t("pricing.f6", "دعم مخصص"),
      ],
    },
  ];
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">
        {t("pricing.title", "الأسعار")}
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className="rounded-xl border border-brand-border bg-[var(--panel)] p-5"
          >
            <div className="mb-2 text-xl font-semibold">{t.name}</div>
            <div className="mb-4 text-2xl font-bold">{t.price}</div>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
