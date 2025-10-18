import { createContext, useContext, useEffect, useMemo, useState } from "react";

import useI18n from "@/hooks/useI18n";

("use client");

type Ctx = {
  t: (k: string, f?: string) => string;
  locale: "ar" | "en";
  loading: boolean;
};
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({
  locale: localeProp,
  ns = "common",
  children,
}: {
  locale?: "ar" | "en";
  ns?: string;
  children: React.ReactNode;
}) {
  const [resolvedLocale, setResolvedLocale] = useState<"ar" | "en">(
    localeProp || "ar",
  );
  useEffect(() => {
    // try to derive from <html lang>
    const lang =
      typeof document !== "undefined"
        ? document.documentElement.getAttribute("lang")
        : null;
    if (lang === "en") setResolvedLocale("en");
    else setResolvedLocale(localeProp || "ar");
  }, [localeProp]);

  const { t, loading } = useI18n(resolvedLocale, ns);
  const value = useMemo(
    () => ({ t, locale: resolvedLocale, loading }),
    [t, resolvedLocale, loading],
  );
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;

  export function useT() {
    const ctx = useContext(I18nCtx);
    if (!ctx) throw new Error("useT must be used within I18nProvider");
    return ctx;

    export default I18nProvider;
  }
}
