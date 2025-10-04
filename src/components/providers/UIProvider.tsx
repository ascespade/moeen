"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UIState {
  theme: "light" | "dark" | "system";
  direction: "rtl" | "ltr";
  sidebarCollapsed: boolean;
  notifications: number;
}

interface UIActions {
  setTheme: (theme: UIState["theme"]) => void;
  setDirection: (direction: UIState["direction"]) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotifications: (count: number) => void;
}

type UIContextType = UIState & UIActions;

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<UIState["theme"]>("system");
  const [direction, setDirection] = useState<UIState["direction"]>("rtl");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(0);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("muayin_theme") as UIState["theme"];
    const savedDirection = localStorage.getItem("muayin_direction") as UIState["direction"];
    const savedSidebarState = localStorage.getItem("muayin_sidebar_collapsed");

    if (savedTheme) setTheme(savedTheme);
    if (savedDirection) setDirection(savedDirection);
    if (savedSidebarState) setSidebarCollapsed(JSON.parse(savedSidebarState));
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("muayin_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("muayin_direction", direction);
  }, [direction]);

  useEffect(() => {
    localStorage.setItem("muayin_sidebar_collapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.setAttribute("data-theme", systemTheme);
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Apply direction
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", direction);
    root.setAttribute("lang", direction === "rtl" ? "ar" : "en");
  }, [direction]);

  const value: UIContextType = {
    theme,
    direction,
    sidebarCollapsed,
    notifications,
    setTheme,
    setDirection,
    setSidebarCollapsed,
    setNotifications,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}