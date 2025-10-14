import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "./useI18n";

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
const DEFAULT_NAMESPACE = "common";

/**
 * Enhanced i18n hook that automatically detects the current page
 * and loads the appropriate namespace
 */
export function usePageI18n(locale: "ar" | "en" = "ar") {
  const pathname = usePathname();
  const [currentNamespace, setCurrentNamespace] =
    useState<string>(DEFAULT_NAMESPACE);

  // Determine namespace based on current route
  useEffect(() => {
    // Find the best matching namespace
    let namespace = DEFAULT_NAMESPACE;

    // Check for exact matches first
    if (ROUTE_NAMESPACES[pathname]) {
      namespace = ROUTE_NAMESPACES[pathname];
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
  const translate = (key: string, fallback?: string) => {
    // Try current namespace first
    let translation = t(key, fallback);

    // If not found and not the same as fallback, try common namespace
    if (translation === key && currentNamespace !== "common") {
      const commonTranslation = t(key, undefined, "common");
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
export function useNamespaceI18n(
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
export function useCommonI18n(locale: "ar" | "en" = "ar") {
  return useNamespaceI18n("common", locale);
}
