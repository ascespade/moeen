"use client";

import { useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("ar");
  const [notif, setNotif] = useState(3);

  return (
    <header className="sticky top-0 z-40 border-b bg-[var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="h-14 mx-auto px-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          aria-label="فتح القائمة"
          data-hs-overlay="#app-sidebar"
        >
          ☰
        </button>
        <div className="text-lg font-semibold">لوحة مُعين</div>
        <div className="flex items-center gap-2 justify-self-end">
          <button
            aria-label="theme"
            className="h-9 rounded-md border px-3 inline-flex items-center gap-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "☀️" : "🌙"}
            <span className="hidden sm:inline">الثيم</span>
          </button>
          <button
            aria-label="lang"
            className="h-9 rounded-md border px-3 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          >
            {lang.toUpperCase()}
          </button>

          <div className="hs-dropdown [--trigger:hover] relative inline-flex">
            <button className="h-9 w-9 rounded-full border grid place-items-center focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" aria-haspopup="menu" aria-expanded="false">
              🔔
              {notif > 0 && (
                <span className="absolute -top-1 -start-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs grid place-items-center">{notif}</span>
              )}
            </button>
            <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white dark:bg-gray-900 shadow-md rounded-lg p-2 border border-gray-200 dark:border-gray-700" role="menu">
              <div className="mb-2 font-medium px-2">إشعارات</div>
              {notif === 0 ? (
                <div className="text-gray-500 px-2">لا إشعارات</div>
              ) : (
                <div className="grid gap-2">
                  {Array.from({ length: Math.min(3, notif) }).map((_, i) => (
                    <div key={i} className="rounded border p-2 flex items-center gap-2">
                      ℹ️ تنبيه #{i + 1}
                    </div>
                  ))}
                  <button className="h-8 rounded-md border mx-2" onClick={() => setNotif(0)}>تمييز كمقروء</button>
                </div>
              )}
            </div>
          </div>

          <div className="h-9 w-9 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  );
}
