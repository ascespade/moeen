"use client";

import { useEffect, useState } from "react";

import { dynamicContentManager } from "@/lib/dynamic-content-manager";

();

export type Messages = Record<string, string>;

export function useI18n(locale: "ar" | "en" = "ar", ns: string = "common") {
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Load translations from dynamic content manager
    dynamicContentManager
      .getTranslations(locale, ns)
      .then((translations) => {
        if (!mounted) return;
        setMessages(translations);
      })
      .catch((error) => {
        if (!mounted) return;
        setMessages({});
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [locale, ns]);

  const t = (key: string, fallback?: string) =>
    messages[key] ?? fallback ?? key;
  return { t, messages, loading };

export default useI18n;
}
