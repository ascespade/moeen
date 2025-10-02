import { useT } from "@/components/providers/I18nProvider";

export default function PrivacyPage() {
  const { t } = useT();
  return (
    <div className="max-w-screen-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{t('privacy.title','الخصوصية')}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t('privacy.desc','نلتزم بحماية بياناتك وفق أفضل الممارسات.')}</p>
    </div>
  );
}

