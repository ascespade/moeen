"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useBrandColorFromLogo from "@/hooks/useBrandColorFromLogo";
import DirectionToggle from "@/components/common/DirectionToggle";
import ThemeToggle from "@/components/common/ThemeToggle";

export type AppTheme = "light" | "dark";
export type AppLang = "ar" | "en";
export type AppRole = "admin" | "staff" | "viewer";

declare global {
  interface Window {
    HSStaticMethods?: { autoInit?: () => void };
  }
}

export default function UIProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useBrandColorFromLogo("/hemam-logo.jpg");

  useEffect(() => {
    import("preline")
      .then(() => {
        window.HSStaticMethods?.autoInit?.();
      })
      .catch(() => {});

    const html = document.documentElement;
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
  }, [pathname]);

  return (
    <div>
      {children}
      <DirectionToggle />
      <ThemeToggle />
    </div>
  );
}
