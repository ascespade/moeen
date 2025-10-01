"use client";

import { createContext, useContext, useMemo } from "react";
import useI18n from "@/hooks/useI18n";

type Ctx = { t: (k: string, f?: string) => string; locale: "ar" | "en"; loading: boolean };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ locale, ns = "common", children }: { locale: "ar" | "en"; ns?: string; children: React.ReactNode }) {
  const { t, loading } = useI18n(locale, ns);
  const value = useMemo(() => ({ t, locale, loading }), [t, locale, loading]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useT() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}

export default I18nProvider;

