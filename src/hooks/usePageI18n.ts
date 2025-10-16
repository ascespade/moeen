import { _usePathname } from "next/navigation";
import { _useEffect, useState } from "react";

import { _useI18n } from "./useI18n";

// Namespace mapping based on route
const ROUTE_NAMESPACES: Record<string, string> = {
  "/": "homepage",
  "/dashboard": "dashboard",
  "/patients": "patients",
  "/appointments": "appointments",
  "/sessions": "sessions",
  "/insurance": "insurance",
  "/settings": "settings",
  "/login": "auth",
  "/register": "auth",
  "/admin": "admin",
};

// Default namespace for unknown routes
const __DEFAULT_NAMESPACE = "common";

/**
 * Enhanced i18n hook that automatically detects the current page
 * and loads the appropriate namespace
 */
export function __usePageI18n(_locale: "ar" | "en" = "ar") {
  const __pathname = (usePathname() as string) || "/";
  const [currentNamespace, setCurrentNamespace] =
    useState<string>(DEFAULT_NAMESPACE);

  // Determine namespace based on current route
  useEffect(() => {
    // Find the best matching namespace
    let namespace = DEFAULT_NAMESPACE;

    // Check for exact matches first
    const __exactNs = ROUTE_NAMESPACES[pathname as keyof typeof ROUTE_NAMESPACES];
    if (exactNs) {
      namespace = exactNs;
    } else {
      // Check for partial matches (e.g., /patients/123 -> patients)
      for (const [route, ns] of Object.entries(ROUTE_NAMESPACES)) {
        if (pathname.startsWith(route) && route !== "/") {
          namespace = ns;
          break;
        }
      }
    }

    setCurrentNamespace(namespace);
  }, [pathname]);

  // Use the base i18n hook with the detected namespace
  const { t, messages, loading } = useI18n(locale, currentNamespace);

  // Enhanced translation function with fallback
  const __translate = (_key: string, fallback?: string) => {
    // Try current namespace first
    let translation = t(key, fallback);

    // If not found and not the same as fallback, try common namespace
    if (translation === key && currentNamespace !== "common") {
      const __commonTranslation = t(key, "common");
      if (commonTranslation !== key) {
        translation = commonTranslation;
      }
    }

    return translation;
  };

  return {
    t: translate,
    messages,
    loading,
    namespace: currentNamespace,
    locale,
  };
}

/**
 * Hook for getting translation with specific namespace
 */
export function __useNamespaceI18n(
  namespace: string,
  locale: "ar" | "en" = "ar",
) {
  const { t, messages, loading } = useI18n(locale, namespace);

  return {
    t,
    messages,
    loading,
    namespace,
    locale,
  };
}

/**
 * Hook for common translations (always uses 'common' namespace)
 */
export function __useCommonI18n(_locale: "ar" | "en" = "ar") {
  return useNamespaceI18n("common", locale);
}
