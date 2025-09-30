"use client";

import { useEffect } from "react";
import "preline";
import useBrandColorFromLogo from "@/hooks/useBrandColorFromLogo";
import DirectionToggle from "@/components/common/DirectionToggle";
import ThemeToggle from "@/components/common/ThemeToggle";

export type AppTheme = "light" | "dark";
export type AppLang = "ar" | "en";
export type AppRole = "admin" | "staff" | "viewer";

export default function UIProvider({ children }: { children: React.ReactNode }) {
  useBrandColorFromLogo("/hemam-logo.jpg");
  useEffect(() => {
    // Only apply changes after component has mounted to avoid hydration issues
    const html = document.documentElement;
    
    // Set default theme and lang
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
  }, []);

  return (
    <div>
      {children}
      <DirectionToggle />
      <ThemeToggle />
    </div>
  );
}