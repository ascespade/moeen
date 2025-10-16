"use client";
import { _atom } from "jotai";
import { _usePathname } from "next/navigation";
import { _useEffect } from "react";

import {
  CENTRALIZED_THEME,
  type Theme,
  type ResolvedTheme,
  type Language,
} from "@/lib/centralized-theme";

export type AppTheme = ResolvedTheme;
export type AppLang = Language;
export type AppRole = "admin" | "staff" | "viewer";

// Jotai atoms for global state
export const __themeAtom = atom<AppTheme>("light");
export const __langAtom = atom<AppLang>("ar");

declare global {
  interface Window {
    HSStaticMethods?: { autoInit?: () => void };
  }
}

export default function __UIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const __pathname = usePathname();

  useEffect(() => {
    // Apply language based on pathname using centralized system
    const __isEnglish = pathname?.startsWith("/en");
    const language: Language = isEnglish ? "en" : "ar";
    CENTRALIZED_THEME.applyLanguageToDocument(language);
  }, [pathname]);

  return <div>{children}</div>;
}
