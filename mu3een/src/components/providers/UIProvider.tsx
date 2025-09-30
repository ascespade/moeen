"use client";

import { useEffect } from "react";

export type AppTheme = "light" | "dark";
export type AppLang = "ar" | "en";
export type AppRole = "admin" | "staff" | "viewer";

export default function UIProvider({ children }: { children: React.ReactNode }) {
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
    </div>
  );
}