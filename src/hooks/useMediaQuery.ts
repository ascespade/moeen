import { useState, useEffect } from "react";

// Media query hooks

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);

  return matches;
};

export const useBreakpoint = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1440px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    current: isMobile
      ? "mobile"
      : isTablet
        ? "tablet"
        : isDesktop
          ? "desktop"
          : "large-desktop",
  };
};

export const useDarkMode = (): boolean => {
  return useMediaQuery("(prefers-color-scheme: dark)");
};

export const useReducedMotion = (): boolean => {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
};

export const useHighContrast = (): boolean => {
  return useMediaQuery("(prefers-contrast: high)");
};

export const usePrint = (): boolean => {
  return useMediaQuery("print");
};

export const useHover = (): boolean => {
  return useMediaQuery("(hover: hover)");
};

export const useTouch = (): boolean => {
  return useMediaQuery("(pointer: coarse)");
};
