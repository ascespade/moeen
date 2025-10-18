import { useState, useEffect } from "react";
// Media query hooks
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
  return useMediaQuery("(prefers-color-scheme: dark)");
};
  return useMediaQuery("(prefers-reduced-motion: reduce)");
};
  return useMediaQuery("(prefers-contrast: high)");
};
  return useMediaQuery("print");
};
  return useMediaQuery("(hover: hover)");
};
  return useMediaQuery("(pointer: coarse)");
};
// Exports
export const useMediaQuery = (query: string): boolean => {
export const useBreakpoint = () => {
export const useDarkMode = (): boolean => {
export const useReducedMotion = (): boolean => {
export const useHighContrast = (): boolean => {
export const usePrint = (): boolean => {
export const useHover = (): boolean => {
export const useTouch = (): boolean => {