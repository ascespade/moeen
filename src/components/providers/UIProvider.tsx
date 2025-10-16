"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { atom } from "jotai";
import { CENTRALIZED_THEME, type Theme, type ResolvedTheme, type Language } from "@/lib/centralized-theme";

export type AppTheme = ResolvedTheme;
export type AppLang = Language;
export type AppRole = "admin" | "staff" | "viewer";

// Jotai atoms for global state
export const themeAtom = atom<AppTheme>("light");
export const langAtom = atom<AppLang>("ar");

declare global {
  interface Window {
    HSStaticMethods?: { autoInit?: () => void };
  }
}

export default function UIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Apply language based on pathname using centralized system
    const isEnglish = pathname?.startsWith("/en");
    const language: Language = isEnglish ? "en" : "ar";
    CENTRALIZED_THEME.applyLanguageToDocument(language);
  }, [pathname]);

  return <div>{children}</div>;
}
