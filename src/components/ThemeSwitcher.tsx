/**
 * Theme Switcher Component
 * مكون تبديل الثيم
 * 
 * Enhanced theme switcher with design system integration
 * مبدل ثيم محسن مع تكامل نظام التصميم
 */

"use client";

import { useTheme } from "@/design-system/hooks";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "dropdown" | "toggle";
}

export default function ThemeSwitcher({
  className = "",
  showLabel = true,
  size = "md",
  variant = "dropdown",
}: ThemeSwitcherProps) {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, isLoading } = useTheme();
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

  const getThemeIcon = (currentTheme: string) => {
    switch (currentTheme) {
      case "light":
        return <Sun className={getIconSize(size)} />;
      case "dark":
        return <Moon className={getIconSize(size)} />;
      default:
        return <Monitor className={getIconSize(size)} />;
    }
  };

  const getThemeLabel = (currentTheme: string) => {
    switch (currentTheme) {
      case "light":
        return "الوضع النهاري";
      case "dark":
        return "الوضع الليلي";
      default:
        return "نظام";
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`
          inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 
          text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150
          ${getSizeClasses(size)} ${className}
        `}
        aria-label={`تبديل إلى ${theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}`}
      >
        {getThemeIcon(theme)}
        {showLabel && (
          <span className="hidden sm:inline text-sm font-medium">
            {getThemeLabel(theme)}
          </span>
        )}
      </button>
    );
  }

  if (variant === "toggle") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={setLightTheme}
          className={`
            p-2 rounded-md transition-colors duration-150
            ${theme === "light" 
              ? "bg-brand-primary text-white" 
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }
          `}
          aria-label="الوضع النهاري"
        >
          <Sun className={getIconSize(size)} />
        </button>
        <button
          onClick={setDarkTheme}
          className={`
            p-2 rounded-md transition-colors duration-150
            ${theme === "dark" 
              ? "bg-brand-primary text-white" 
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }
          `}
          aria-label="الوضع الليلي"
        >
          <Moon className={getIconSize(size)} />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 
          text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-150
          ${getSizeClasses(size)}
        `}
        aria-label="تبديل الثيم"
        aria-expanded={isOpen}
      >
        {getThemeIcon(theme)}
        {showLabel && (
          <span className="hidden sm:inline text-sm font-medium">
            {getThemeLabel(theme)}
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
          <div className="absolute top-full right-0 z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
            <div className="py-1">
              <button
                onClick={() => {
                  setLightTheme();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150
                  ${theme === "light" 
                    ? "bg-brand-primary text-white" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
              >
                <Sun className="h-4 w-4" />
                الوضع النهاري
              </button>
              
              <button
                onClick={() => {
                  setDarkTheme();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150
                  ${theme === "dark" 
                    ? "bg-brand-primary text-white" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
              >
                <Moon className="h-4 w-4" />
                الوضع الليلي
              </button>
              
              <button
                onClick={() => {
                  // System theme - detect and apply
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  if (systemTheme === 'dark') {
                    setDarkTheme();
                  } else {
                    setLightTheme();
                  }
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150
                  text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800
                `}
              >
                <Monitor className="h-4 w-4" />
                تلقائي (نظام)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
