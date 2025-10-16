"use client";

import { _useT } from "@/components/providers/I18nProvider";

export default function __FeaturesPage() {
  const { t } = useT();
  const __features = [
    {
      title: t("home.features.unifiedChat", "دردشة موحّدة"),
      desc: t(
        "home.features.unifiedChat.desc",
        "إدارة كل القنوات من واجهة واحدة",
      ),
    },
    {
      title: t("home.features.reports", "تقارير لحظية"),
      desc: t("home.features.reports.desc", "لوحات ذكية ومؤشرات أداء"),
    },
    {
      title: t("home.hero.subtitle", "تلقائية وذكاء"),
      desc: "AI assisted flows",
    },
  ];
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">
        {t("features.title", "المميزات")}
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-border bg-[var(--panel)] p-5"
          >
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
