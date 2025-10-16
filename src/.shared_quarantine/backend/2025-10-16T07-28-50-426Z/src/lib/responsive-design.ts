// Comprehensive Responsive Design System for Hemam Center
import React, { useEffect, useState } from "react";

// Breakpoint definitions
export const __breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Screen size hook
export function __useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    width: 0,
    height: 0,
    breakpoint: "xs",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const __updateScreenSize = () => {
      const __width = window.innerWidth;
      const __height = window.innerHeight;

      let breakpoint: Breakpoint = "xs";
      if (width >= breakpoints["2xl"]) breakpoint = "2xl";
      else if (width >= breakpoints.xl) breakpoint = "xl";
      else if (width >= breakpoints.lg) breakpoint = "lg";
      else if (width >= breakpoints.md) breakpoint = "md";
      else if (width >= breakpoints.sm) breakpoint = "sm";

      setScreenSize({
        width,
        height,
        breakpoint,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
}

// Responsive utility functions
export const __responsive = {
  // Get responsive classes based on screen size
  getClasses: (_classes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    default?: string;
  }) => {
    const { mobile, tablet, desktop, default: defaultClass } = classes;
    return `${defaultClass || ""} ${mobile || ""} md:${tablet || ""} lg:${desktop || ""}`;
  },

  // Get responsive grid columns
  getGridColumns: (_columns: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  }) => {
    const { mobile = 1, tablet = 2, desktop = 3 } = columns;
    return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  },

  // Get responsive spacing
  getSpacing: (_spacing: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }) => {
    const { mobile = "p-4", tablet = "md:p-6", desktop = "lg:p-8" } = spacing;
    return `${mobile} ${tablet} ${desktop}`;
  },

  // Get responsive text sizes
  getTextSize: (_sizes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }) => {
    const {
      mobile = "text-sm",
      tablet = "md:text-base",
      desktop = "lg:text-lg",
    } = sizes;
    return `${mobile} ${tablet} ${desktop}`;
  },
};

// Mobile-first responsive design patterns
export const __mobilePatterns = {
  // Navigation patterns
  navigation: {
    mobile:
      "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50",
    desktop: "lg:relative lg:border-t-0 lg:bg-transparent",
  },

  // Card patterns
  card: {
    mobile: "bg-white rounded-lg shadow-sm border border-gray-200 p-4",
    tablet: "md:p-6",
    desktop: "lg:p-8 lg:shadow-md",
  },

  // Button patterns
  button: {
    mobile: "w-full py-3 px-4 text-sm font-medium rounded-lg",
    tablet: "md:w-auto md:py-2 md:px-6",
    desktop: "lg:py-3 lg:px-8",
  },

  // Form patterns
  form: {
    mobile: "space-y-4",
    tablet: "md:space-y-6",
    desktop: "lg:space-y-8",
  },

  // Grid patterns
  grid: {
    mobile: "grid grid-cols-1 gap-4",
    tablet: "md:grid-cols-2 md:gap-6",
    desktop: "lg:grid-cols-3 lg:gap-8",
  },
};

// Touch-friendly design utilities
export const __touchFriendly = {
  // Minimum touch target size (44px)
  minTouchTarget: "min-h-[44px] min-w-[44px]",

  // Touch-friendly spacing
  touchSpacing: "p-3 md:p-4",

  // Touch-friendly buttons
  touchButton: "min-h-[44px] min-w-[44px] flex items-center justify-center",

  // Touch-friendly inputs
  touchInput: "min-h-[44px] px-4 py-3 text-base",

  // Touch-friendly links
  touchLink: "min-h-[44px] flex items-center justify-center",
};

// Accessibility utilities
export const __accessibility = {
  // Focus styles
  focus:
    "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",

  // Screen reader only
  srOnly: "sr-only",

  // High contrast
  highContrast: "text-gray-900 bg-white border-gray-900",

  // Reduced motion
  reducedMotion: "motion-reduce:transition-none motion-reduce:transform-none",
};

// RTL support utilities
export const __rtl = {
  // RTL-aware margins
  margin: {
    left: "ml-0 mr-4 rtl:ml-4 rtl:mr-0 rtl:ml-4",
    right: "mr-0 ml-4 rtl:ml-0 rtl:mr-4",
  },

  // RTL-aware padding
  padding: {
    left: "pl-0 pr-4 rtl:pr-0 rtl:pl-4",
    right: "pr-0 pl-4 rtl:pl-0 rtl:pr-4",
  },

  // RTL-aware text alignment
  textAlign: {
    left: "text-left rtl:text-right",
    right: "text-right rtl:text-left",
  },

  // RTL-aware flex direction
  flexDirection: {
    row: "flex-row rtl:flex-row-reverse",
    rowReverse: "flex-row-reverse rtl:flex-row",
  },
};

// Performance optimization utilities
export const __performance = {
  // Lazy loading
  lazyLoad: 'loading="lazy"',

  // Image optimization
  imageOptimization: "object-cover object-center",

  // Critical CSS
  criticalCSS: "inline-block",

  // Non-critical CSS
  nonCriticalCSS: "hidden md:block",
};

// Dark mode utilities
export const __darkMode = {
  // Dark mode colors
  colors: {
    background: "bg-white dark:bg-gray-900",
    text: "text-gray-900 dark:text-white",
    border: "border-gray-200 dark:border-gray-700",
    card: "bg-white dark:bg-gray-800",
  },

  // Dark mode transitions
  transition: "transition-colors duration-200",
};

// Print utilities
export const __print = {
  // Print styles
  styles: "print:bg-white print:text-black print:shadow-none",

  // Hide in print
  hide: "print:hidden",

  // Show only in print
  show: "hidden print:block",
};

// Responsive design hooks
export function __useResponsive() {
  const __screenSize = useScreenSize();

  return {
    ...screenSize,
    isXs: screenSize.breakpoint === "xs",
    isSm: screenSize.breakpoint === "sm",
    isMd: screenSize.breakpoint === "md",
    isLg: screenSize.breakpoint === "lg",
    isXl: screenSize.breakpoint === "xl",
    is2Xl: screenSize.breakpoint === "2xl",

    // Responsive helpers
    getResponsiveValue: <T>(_values: {
      mobile?: T;
      tablet?: T;
      desktop?: T;
      default?: T;
    }) => {
      if (screenSize.isMobile && values.mobile !== undefined)
        return values.mobile;
      if (screenSize.isTablet && values.tablet !== undefined)
        return values.tablet;
      if (screenSize.isDesktop && values.desktop !== undefined)
        return values.desktop;
      return values.default;
    },
  };
}

// Responsive component wrapper
export function __ResponsiveWrapper({
  children,
  className = "",
  mobileClassName = "",
  tabletClassName = "",
  desktopClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  let classes = className;
  if (isMobile) classes += ` ${mobileClassName}`;
  if (isTablet) classes += ` ${tabletClassName}`;
  if (isDesktop) classes += ` ${desktopClassName}`;
  classes = classes.trim();

  return React.createElement("div", { className: classes }, children);
}

// Export all utilities
export default {
  breakpoints,
  useScreenSize,
  useResponsive,
  responsive,
  mobilePatterns,
  touchFriendly,
  accessibility,
  rtl,
  performance,
  darkMode,
  print,
  ResponsiveWrapper,
};
