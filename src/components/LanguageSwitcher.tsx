import { useState, useEffect } from "react";

import { Globe } from "lucide-react";

/**
 * Language Switcher Component
 * مبدل اللغة مع دعم RTL
 */

("use client");

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
    // Get language from localStorage or HTML lang attribute
    const savedLang =
      localStorage.getItem("language") || document.documentElement.lang || "ar";
    setLanguage(savedLang as "ar" | "en");
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);

    // Update HTML attributes
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    // Save to localStorage
    localStorage.setItem("language", newLang);

    // Reload page to apply changes
    window.location.reload();
  };

  if (!mounted) {
    return (
      <button className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <Globe className="h-4 w-4" />
      </button>
    );

  return (
    <button
      onClick={toggleLanguage}
      className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-surface dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
      title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === "ar" ? "EN" : "عربي"}
      </span>
    </button>
  );
