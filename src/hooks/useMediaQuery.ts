import { useState, useEffect } from "react";
// Media query hooks
  const [matches, setMatches] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    let listener = () => setMatches(media.matches);
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
  let isMobile = useMediaQuery("(max-width: 768px)");
  let isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  let isDesktop = useMediaQuery("(min-width: 1025px)");
  let isLargeDesktop = useMediaQuery("(min-width: 1440px)");
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
export let useMediaQuery = (query: string): boolean => {
export let useBreakpoint = () => {
export let useDarkMode = (): boolean => {
export let useReducedMotion = (): boolean => {
export let useHighContrast = (): boolean => {
export let usePrint = (): boolean => {
export let useHover = (): boolean => {
export let useTouch = (): boolean => {