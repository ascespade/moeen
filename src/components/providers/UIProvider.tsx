import React from "react";
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { atom } from "jotai";
import useBrandColorFromLogo from "@/hooks/useBrandColorFromLogo";

// Jotai atoms for global state
export const themeAtom = atom<"light" | "dark">("light");
export const sidebarOpenAtom = atom<boolean>(false);
export const notificationsAtom = atom<any[]>([]);

declare global {
  interface Window {
    HSStaticMethods?: { autoInit?: () => void };
  }
}

export function UIProvider({
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

  useEffect(() => {
    // Initialize HSStaticMethods if available
    if (typeof window !== "undefined" && window.HSStaticMethods?.autoInit) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  return <>{children}</>;
}