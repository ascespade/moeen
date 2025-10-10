"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ThemeSwitcher({
  className = "",
  showLabel = true,
  size = "md",
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<string>("light");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n("ar"); // Default to Arabic for theme labels

  // Load user preferences from database on mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Apply theme changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);

    // Only save to database if not initial load
    if (!isLoading) {
      saveUserPreference("theme", theme);
    }
  }, [theme, isLoading]);

  // Function to load user preferences from database
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/preferences");
      if (response.ok) {
        const data = await response.json();
        if (data.theme) setTheme(data.theme);
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

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      onClick={toggleTheme}
      disabled={isLoading}
      title={
        theme === "light"
          ? t("theme.dark", "الوضع المظلم")
          : t("theme.light", "الوضع المضيء")
      }
    >
      {isLoading ? (
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 ${iconSizes[size]}`}
        ></div>
      ) : theme === "light" ? (
        <Sun className={iconSizes[size]} />
      ) : (
        <Moon className={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="ml-2 hidden sm:inline">
          {t("theme.label", "الثيم")}
        </span>
      )}
    </button>
  );
}
