"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Languages } from "lucide-react";
import { useT } from "@/components/providers/I18nProvider";
import Link from "next/link";

export default function Header() {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light",
  );
  const [dir, setDir] = useState<"rtl" | "ltr">(
    typeof window !== "undefined"
      ? (localStorage.getItem("dir") as "rtl" | "ltr") || "rtl"
      : "rtl",
  );
  const [notif, setNotif] = useState(3);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { t } = useT();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.setAttribute("dir", dir);
    html.setAttribute("lang", dir === "rtl" ? "ar" : "en");
    localStorage.setItem("theme", theme);
    localStorage.setItem("dir", dir);
  }, [theme, dir]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowThemeDropdown(false);
      setShowLangDropdown(false);
      setShowNotifDropdown(false);
      setShowUserDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto px-4 sm:px-6">
        <div className="h-14 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="فتح القائمة"
            data-hs-overlay="#app-sidebar"
          >
            ☰
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid h-8 w-8 place-items-center rounded-lg text-white bg-brand">
                م
              </div>
              <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                لوحة مُعين
              </div>
            </div>

            <div className="w-full max-w-[680px] ms-auto lg:ms-0">
              <div className="relative">
                <input
                  type="search"
                  className="py-2 pe-10 ps-3 block w-full border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 focus:ring-1"
                  placeholder="ابحث في النظام..."
                  aria-label="بحث"
                  style={{ outlineColor: "var(--brand-primary)" }}
                />
                <div className="absolute inset-y-0 end-0 flex items-center pe-2 text-gray-400">
                  ⌘K
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-self-end">
            <div className="relative inline-flex">
              <button
                className="h-9 rounded-md border border-gray-200 dark:border-gray-700 px-3 inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2"
                aria-haspopup="menu"
                style={{ outlineColor: "var(--brand-primary)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowThemeDropdown(!showThemeDropdown);
                }}
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {t("ui.theme", "الثيم")}
                </span>
              </button>
              {showThemeDropdown && (
                <div
                  className="absolute top-full right-0 z-50 min-w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-900"
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-full rounded-md px-3 py-2 text-start hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setTheme("light");
                      setShowThemeDropdown(false);
                    }}
                  >
                    وضع نهاري
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-start hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setTheme("dark");
                      setShowThemeDropdown(false);
                    }}
                  >
                    وضع ليلي
                  </button>
                </div>
              )}
            </div>

            <button
              className="h-9 rounded-md border border-gray-200 dark:border-gray-700 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2"
              aria-label="Toggle direction"
              style={{ outlineColor: "var(--brand-primary)" }}
              onClick={() => setDir(dir === "rtl" ? "ltr" : "rtl")}
            >
              {dir === "rtl" ? "RTL" : "LTR"}
            </button>

            <div className="relative inline-flex">
              <button
                className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLangDropdown(!showLangDropdown);
                }}
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("ui.language", "اللغة")}
                </span>
              </button>
              {showLangDropdown && (
                <div
                  className="absolute top-full right-0 z-50 min-w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-900"
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    className="block rounded-md px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    href="/ar"
                    onClick={() => setShowLangDropdown(false)}
                  >
                    العربية
                  </Link>
                  <Link
                    className="block rounded-md px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    href="/en"
                    onClick={() => setShowLangDropdown(false)}
                  >
                    English
                  </Link>
                </div>
              )}
            </div>

            <div className="hs-dropdown [--trigger:hover] relative inline-flex">
              <button
                className="relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 grid place-items-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2"
                style={{ outlineColor: "var(--brand-primary)" }}
                aria-haspopup="menu"
                aria-expanded="false"
              >
                🔔
                {notif > 0 && (
                  <span className="absolute -top-1 -start-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs grid place-items-center">
                    {notif}
                  </span>
                )}
              </button>
              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-64 bg-white dark:bg-gray-900 shadow-md rounded-lg p-2 border border-gray-200 dark:border-gray-700"
                role="menu"
              >
                <div className="mb-2 font-medium px-2 text-gray-800 dark:text-gray-100">
                  إشعارات
                </div>
                {notif === 0 ? (
                  <div className="text-gray-500 px-2">لا إشعارات</div>
                ) : (
                  <div className="grid gap-2">
                    {Array.from({ length: Math.min(3, notif) }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2 text-gray-800 dark:text-gray-100"
                      >
                        ℹ️ تنبيه #{i + 1}
                      </div>
                    ))}
                    <button
                      className="h-8 rounded-md border border-gray-200 dark:border-gray-700 mx-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setNotif(0)}
                    >
                      تمييز كمقروء
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="hs-dropdown relative inline-flex">
              <button
                className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2"
                style={{ outlineColor: "var(--brand-primary)" }}
                aria-haspopup="menu"
                aria-expanded="false"
              />
              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-44 bg-white dark:bg-gray-900 shadow-md rounded-lg p-1 border border-gray-200 dark:border-gray-700"
                role="menu"
              >
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  مرحبا بك
                </div>
                <button className="w-full text-start px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  الملف الشخصي
                </button>
                <button className="w-full text-start px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  الإعدادات
                </button>
                <button className="w-full text-start px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-red-600">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
