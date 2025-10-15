/**
 * Language Switcher Component
 * مكون تبديل اللغة
 * 
 * Enhanced language switcher with RTL support
 * مبدل لغة محسن مع دعم RTL
 */

"use client";

import { useLanguage } from "@/design-system/hooks";
import { Languages, Globe } from "lucide-react";
import { useState } from "react";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "dropdown" | "toggle";
}

export default function LanguageSwitcher({
  className = "",
  showLabel = true,
  size = "md",
  variant = "dropdown",
}: LanguageSwitcherProps) {
  const { language, toggleLanguage, setArabic, setEnglish, isLoading, direction } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "md":
        return "h-9 w-9";
      case "lg":
        return "h-10 w-10";
      default:
        return "h-9 w-9";
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-md ${getSizeClasses(size)} ${className}`} />
    );
  }

  const getIconSize = (size: string) => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "md":
        return "h-4 w-4";
      case "lg":
        return "h-5 w-5";
      default:
        return "h-4 w-4";
    }
  };

  const getLanguageLabel = (currentLanguage: string) => {
    switch (currentLanguage) {
      case "ar":
        return "العربية";
      case "en":
        return "English";
      default:
        return "العربية";
    }
  };

  const getLanguageFlag = (currentLanguage: string) => {
    switch (currentLanguage) {
      case "ar":
        return "🇸🇦";
      case "en":
        return "🇺🇸";
      default:
        return "🇸🇦";
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={toggleLanguage}
        className={`
          inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 
          text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150
          ${getSizeClasses(size)} ${className}
        `}
        aria-label={`تبديل إلى ${language === "ar" ? "English" : "العربية"}`}
        dir={direction}
      >
        <span className="text-lg">{getLanguageFlag(language)}</span>
        {showLabel && (
          <span className="hidden sm:inline text-sm font-medium">
            {getLanguageLabel(language)}
          </span>
        )}
      </button>
    );
  }

  if (variant === "toggle") {
    return (
      <div className={`flex items-center gap-2 ${className}`} dir={direction}>
        <button
          onClick={setArabic}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-150
            ${language === "ar" 
              ? "bg-brand-primary text-white" 
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }
          `}
          aria-label="العربية"
        >
          <span className="text-lg">🇸🇦</span>
          <span className="text-sm font-medium">ع</span>
        </button>
        <button
          onClick={setEnglish}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-150
            ${language === "en" 
              ? "bg-brand-primary text-white" 
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }
          `}
          aria-label="English"
        >
          <span className="text-lg">🇺🇸</span>
          <span className="text-sm font-medium">EN</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} dir={direction}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 
          text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150
          ${getSizeClasses(size)}
        `}
        aria-label="تبديل اللغة"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{getLanguageFlag(language)}</span>
        {showLabel && (
          <span className="hidden sm:inline text-sm font-medium">
            {getLanguageLabel(language)}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`
            absolute top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-700 
            bg-white dark:bg-gray-900 shadow-lg
            ${direction === 'rtl' ? 'right-0' : 'left-0'}
          `}>
            <div className="py-1">
              <button
                onClick={() => {
                  setArabic();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150
                  ${language === "ar" 
                    ? "bg-brand-primary text-white" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
                dir="rtl"
              >
                <span className="text-lg">🇸🇦</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">العربية</span>
                  <span className="text-xs opacity-75">Arabic</span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setEnglish();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150
                  ${language === "en" 
                    ? "bg-brand-primary text-white" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
                dir="ltr"
              >
                <span className="text-lg">🇺🇸</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">English</span>
                  <span className="text-xs opacity-75">الإنجليزية</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
