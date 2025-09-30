"use client";

import { useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("ar");
  const [notif, setNotif] = useState(3);
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 border-b grid grid-cols-[1fr_auto] items-center px-4">
      <div className="text-lg font-medium">لوحة مُعين</div>
      <div className="flex items-center gap-2 relative">
        <button
          aria-label="theme"
          className="h-9 rounded-md border px-3 inline-flex items-center gap-2"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "☀️" : "🌙"}
          <span className="hidden sm:inline">الثيم</span>
        </button>
        <button
          aria-label="lang"
          className="h-9 rounded-md border px-3"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        >
          {lang.toUpperCase()}
        </button>
        <div className="relative">
          <button className="h-9 w-9 rounded-full border grid place-items-center" onClick={() => setOpen(!open)}>
            🔔
          </button>
          {notif > 0 && (
            <span className="absolute -top-1 -start-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs grid place-items-center">{notif}</span>
          )}
          {open && (
            <div className="absolute end-0 mt-2 w-64 rounded-md border bg-white dark:bg-gray-900 shadow p-2 text-sm">
              <div className="mb-2 font-medium">إشعارات</div>
              {notif === 0 ? (
                <div className="text-gray-500">لا إشعارات</div>
              ) : (
                <div className="grid gap-2">
                  {Array.from({ length: Math.min(3, notif) }).map((_, i) => (
                    <div key={i} className="rounded border p-2 flex items-center gap-2">
                      ℹ️
                      تنبيه #{i + 1}
                    </div>
                  ))}
                  <button className="h-8 rounded-md border" onClick={() => setNotif(0)}>تمييز كمقروء</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="h-9 w-9 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}

