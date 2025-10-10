"use client";
import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "dropdown";
}

export default function LanguageSwitcher({
  className = "",
  showLabel = true,
  size = "md",
  variant = "button",
}: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<string>("ar");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n(language as "ar" | "en");

  // Load user preferences from database on mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Apply language changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

    // Only save to database if not initial load
    if (!isLoading) {
      saveUserPreference("language", language);
    }
  }, [language, isLoading]);

  // Function to load user preferences from database
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/preferences");
      if (response.ok) {
        const data = await response.json();
        if (data.language) setLanguage(data.language);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save preferences to database
  const saveUserPreference = async (key: string, value: string) => {
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value }),
      });
    } catch (error) {
      console.error("Failed to save preference:", error);
    }
  };

  // Toggle language function - reload page to apply translations
  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar";
    setLanguage(newLanguage);
    // Save preference and reload page to apply translations
    saveUserPreference("language", newLanguage).then(() => {
      window.location.reload();
    });
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 px-2",
    md: "h-9 px-3",
    lg: "h-10 px-4",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <select
          className={`inline-flex items-center gap-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 ${sizeClasses[size]} ${textSizes[size]}`}
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            saveUserPreference("language", e.target.value).then(() => {
              window.location.reload();
            });
          }}
          disabled={isLoading}
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </div>
    );
  }

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      onClick={toggleLanguage}
      disabled={isLoading}
      title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      {isLoading ? (
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 ${iconSizes[size]}`}
        ></div>
      ) : (
        <Languages className={iconSizes[size]} />
      )}
      {showLabel && (
        <span className={`hidden sm:inline ${textSizes[size]}`}>
          {language === "ar" ? "العربية" : "English"}
        </span>
      )}
    </button>
  );
}
