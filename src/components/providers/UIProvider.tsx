import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
"use client";



import useBrandColorFromLogo from "@/hooks/useBrandColorFromLogo";

export type AppTheme = "light" | "dark";
export type AppLang = "ar" | "en";
export type AppRole = "admin" | "staff" | "viewer";

declare global {
  interface Window {
    HSStaticMethods?: { autoInit?: () => void };
  }
}

export default function UIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useBrandColorFromLogo("/hemam-logo.jpg");

  useEffect(() => {
    const html = document.documentElement;
    const isEnglish = pathname?.startsWith("/en");
    html.setAttribute("lang", isEnglish ? "en" : "ar");
    html.setAttribute("dir", isEnglish ? "ltr" : "rtl");
  }, [pathname]);

  return <div>{children}</div>;
}
