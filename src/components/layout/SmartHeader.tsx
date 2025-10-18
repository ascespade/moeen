
"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Languages, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useI18n } from "@/hooks/useI18n";

// Theme and Language Switches Component
function ThemeLanguageSwitches() {
  const [theme, setTheme] = useState<string>("light");
  const [language, setLanguage] = useState<string>("ar");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n(language as "ar" | "en");

  // Load user preferences from database on mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Apply theme and language changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

    // Only save to database if not initial load
    if (!isLoading) {
      saveUserPreference("theme", theme);
      saveUserPreference("language", language);
    }
  }, [theme, language, isLoading]);

  // Function to load user preferences from database
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/preferences");
      if (response.ok) {
        const data = await response.json();
        if (data.theme) setTheme(data.theme);
        if (data.language) setLanguage(data.language);
      }
    } catch (error) {
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
      }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
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

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-gray-700 hover:bg-surface focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
        onClick={toggleTheme}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        ) : theme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{t("theme.label", "الثيم")}</span>
      </button>

      {/* Language Toggle Button */}
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-gray-700 hover:bg-surface focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
        onClick={toggleLanguage}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        ) : (
          <Languages className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {language === "ar" ? "العربية" : "English"}
        </span>
      </button>
    </>
  );
}

// Main Smart Header Component
export default function SmartHeader() {
  const [language, setLanguage] = useState<string>("ar");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n(language as "ar" | "en");

  // Load language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        if (response.ok) {
          const data = await response.json();
          if (data.language) setLanguage(data.language);
        }
      } catch (error) {
        }
    };
    loadLanguage();
  }, []);

  // Determine if user is authenticated (simplified check)
  useEffect(() => {
    // This is a simplified check - in a real app you'd use proper auth state
    const isAuth =
      pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
    setIsAuthenticated(isAuth);
  }, [pathname]);

  // Navigation items based on context
  const getNavigationItems = () => {
    if (isAuthenticated) {
      // Authenticated user navigation
      return [
        { href: "/", label: t("nav.dashboard", "لوحة التحكم") },
        { href: ROUTES.HEALTH.PATIENTS, label: t("nav.patients", "المرضى") },
        {
          href: ROUTES.HEALTH.APPOINTMENTS,
          label: t("nav.appointments", "المواعيد"),
        },
        { href: ROUTES.HEALTH.SESSIONS, label: t("nav.sessions", "الجلسات") },
      ];
    } else {
      // Public navigation
      return [
        { href: "#services", label: t("nav.services", "الخدمات") },
        { href: "#about", label: t("nav.about", "عن معين") },
        { href: "#gallery", label: t("nav.gallery", "المعرض") },
        { href: "#contact", label: t("nav.contact", "اتصل بنا") },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="nav sticky top-0 z-50">
      <div className="container-app py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-brand text-2xl font-bold">مُعين</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme and Language Switches */}
            <ThemeLanguageSwitches />

            {/* Auth Buttons */}
            {!isAuthenticated && (
              <>
                <Link href={ROUTES.LOGIN} className="btn btn-outline">
                  {t("nav.login", "تسجيل الدخول")}
                </Link>
                <Link href={ROUTES.REGISTER} className="btn btn-brand">
                  {t("nav.register", "إنشاء حساب")}
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className="nav-link py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("nav.login", "تسجيل الدخول")}
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="nav-link py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("nav.register", "إنشاء حساب")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
