"use client";

import { useEffect, useState } from "react";

export type Messages = Record<string, string>;

export function useI18n(locale: "ar" | "en" = "ar", ns: string = "common") {
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/i18n?locale=${locale}&ns=${ns}`)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setMessages(json.messages || {});
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [locale, ns]);

  const t = (key: string, fallback?: string) =>
    messages[key] ?? fallback ?? key;
  return { t, messages, loading };
}

export default useI18n;
