/**
 * Design System Provider
 * مزود نظام التصميم
 *
 * Provides design system context to the entire application
 * يوفر سياق نظام التصميم للتطبيق بأكمله
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { _useTheme, useLanguage } from "@/design-system/hooks";
import { _applyTheme, generateThemeVariables } from "@/design-system/utils";

import {
  DesignSystemConfig,
  Theme,
  Language,
  Direction,
} from "@/design-system/types";

interface DesignSystemContextValue {
  theme: Theme;
  language: Language;
  direction: Direction;
  config: DesignSystemConfig;
  updateTheme: (_theme: Theme) => void;
  updateLanguage: (_language: Language) => void;
  isLoading: boolean;
}

const __DesignSystemContext = createContext<DesignSystemContextValue | null>(
  null,
);

interface DesignSystemProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  config?: Partial<DesignSystemConfig>;
}

export function __DesignSystemProvider({
  children,
  defaultTheme = "light",
  defaultLanguage = "ar",
  config: customConfig,
}: DesignSystemProviderProps) {
  const { theme, isLoading: themeLoading } = useTheme();
  const { language, direction, isLoading: languageLoading } = useLanguage();
  const [isInitialized, setIsInitialized] = useState(false);

  // Default configuration
  const defaultConfig: DesignSystemConfig = {
    theme: defaultTheme,
    language: defaultLanguage,
    direction: defaultLanguage === "ar" ? "rtl" : "ltr",
    breakpoint: "sm",
    colors: {
      primary: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
        DEFAULT: "#f58220",
        hover: "#d66f15",
      },
      secondary: {
        50: "#fdf8f6",
        100: "#f2e8e5",
        200: "#eaddd7",
        300: "#e0cec7",
        400: "#d2bab0",
        500: "#bfa094",
        600: "#a18072",
        700: "#977669",
        800: "#846358",
        900: "#43302b",
        DEFAULT: "#a18072",
      },
      accent: {
        blue: "#007bff",
        green: "#009688",
        purple: "#8b5cf6",
        pink: "#ec4899",
        yellow: "#f59e0b",
      },
      status: {
        success: "#009688",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#007bff",
      },
      neutral: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },
    },
    spacing: {
      px: "1px",
      0: "0",
      0.5: "0.125rem",
      1: "0.25rem",
      1.5: "0.375rem",
      2: "0.5rem",
      2.5: "0.625rem",
      3: "0.75rem",
      3.5: "0.875rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      14: "3.5rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      52: "13rem",
      56: "14rem",
      60: "15rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem",
    },
    typography: {
      fontFamily: {
        sans: ["Cairo", "Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      none: "0 0 #0000",
    },
    zIndex: {
      hide: -1,
      auto: "auto",
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1020,
      banner: 1030,
      overlay: 1040,
      modal: 1050,
      popover: 1060,
      skipLink: 1070,
      toast: 1080,
      tooltip: 1090,
    },
    animation: {
      duration: {
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1000: "1000ms",
      },
      easing: {
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  };

  // Merge with custom config
  const config: DesignSystemConfig = {
    ...defaultConfig,
    ...customConfig,
    theme,
    language,
    direction: direction as Direction,
  };

  // Initialize design system
  useEffect(() => {
    if (!themeLoading && !languageLoading) {
      // Apply theme
      applyTheme(theme);

      // Apply language and direction
      const __root = document.documentElement;
      root.setAttribute("lang", language);
      root.setAttribute("dir", direction);

      setIsInitialized(true);
    }
  }, [theme, language, direction, themeLoading, languageLoading]);

  // Update theme function
  const __updateTheme = (_newTheme: Theme) => {
    applyTheme(newTheme);
  };

  // Update language function
  const __updateLanguage = (_newLanguage: Language) => {
    const __root = document.documentElement;
    root.setAttribute("lang", newLanguage);
    root.setAttribute("dir", newLanguage === "ar" ? "rtl" : "ltr");
  };

  const value: DesignSystemContextValue = {
    theme,
    language,
    direction: direction as Direction,
    config,
    updateTheme,
    updateLanguage,
    isLoading: themeLoading || languageLoading || !isInitialized,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

// Hook to use design system context
export function __useDesignSystem(): DesignSystemContextValue {
  const __context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider",
    );
  }
  return context;
}
