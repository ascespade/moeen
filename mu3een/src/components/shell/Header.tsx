"use client";

import { useAtom } from "jotai";
import { langAtom, notificationsAtom, themeAtom } from "@/components/providers/UIProvider";

export default function Header() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [lang, setLang] = useAtom(langAtom);
  const [notif] = useAtom(notificationsAtom);

  return (
    <header className="h-14 border-b grid grid-cols-[1fr_auto] items-center px-4">
      <div className="text-lg font-medium">&nbsp;</div>
      <div className="flex items-center gap-2">
        <button
          aria-label="theme"
          className="h-9 rounded-md border px-3"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌞" : "🌙"}
        </button>
        <button
          aria-label="lang"
          className="h-9 rounded-md border px-3"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        >
          {lang.toUpperCase()}
        </button>
        <div className="relative">
          <button className="h-9 w-9 rounded-full border grid place-items-center">🔔</button>
          {notif > 0 && (
            <span className="absolute -top-1 -start-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs grid place-items-center">{notif}</span>
          )}
        </div>
        <div className="h-9 w-9 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}

