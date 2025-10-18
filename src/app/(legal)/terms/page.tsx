"use client";

import { useT } from "@/components/providers/I18nProvider";

export default function TermsPage() {
  const { t } = useT();
  return (
    <div className="mx-auto max-w-screen-md px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">
        {t("terms.title", "الشروط والأحكام")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {t(
          "terms.desc",
          "باستخدامك للمنصة فأنت توافق على الشروط القياسية للاستخدام.",
        )}
      </p>
    </div>
  );
