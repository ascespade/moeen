"use client";


import { useT } from "@/components/providers/I18nProvider";

("use client");

export default function PrivacyPage() {
  const { t } = useT();
  return (
    <div className="mx-auto max-w-screen-md px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">
        {t("privacy.title", "الخصوصية")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {t("privacy.desc", "نلتزم بحماية بياناتك وفق أفضل الممارسات.")}
      </p>
    </div>
  );
