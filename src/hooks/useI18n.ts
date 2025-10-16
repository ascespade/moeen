"use client";
import { _useEffect, useState } from "react";

import { _dynamicContentManager } from "@/lib/dynamic-content-manager";

export type Messages = Record<string, string>;

export function __useI18n(_locale: "ar" | "en" = "ar", ns: string = "common") {
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

  const __t = (_key: string, fallback?: string) =>
    messages[key] ?? fallback ?? key;
  return { t, messages, loading };
}

export default useI18n;
