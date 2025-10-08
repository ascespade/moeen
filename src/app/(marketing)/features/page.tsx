"use client";

import { useT } from "@/components/providers/I18nProvider";

export default function FeaturesPage() {
  const { t } = useT();
  const features = [
    { title: t('home.features.unifiedChat','دردشة موحّدة'), desc: t('home.features.unifiedChat.desc','إدارة كل القنوات من واجهة واحدة') },
    { title: t('home.features.reports','تقارير لحظية'), desc: t('home.features.reports.desc','لوحات ذكية ومؤشرات أداء') },
    { title: t('home.hero.subtitle','تلقائية وذكاء'), desc: 'AI assisted flows' },
  ];
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('features.title','المميزات')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="rounded-xl border border-brand-border p-5 bg-[var(--panel)]">
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

