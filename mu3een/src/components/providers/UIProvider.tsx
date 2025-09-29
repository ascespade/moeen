"use client";

import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export type AppTheme = "light" | "dark";
export type AppLang = "ar" | "en";
export type AppRole = "admin" | "staff" | "viewer";

export const themeAtom = atom<AppTheme>("light");
export const langAtom = atom<AppLang>("ar");
export const roleAtom = atom<AppRole>("admin");
export const notificationsAtom = atom<number>(3);

export default function UIProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(themeAtom);
  const [lang] = useAtom(langAtom);

  useEffect(() => {
    const html = document.documentElement;
    // Theme
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    // Lang & dir
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [theme, lang]);

  return <>{children}</>;
}